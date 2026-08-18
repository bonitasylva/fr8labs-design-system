import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, userEvent, within} from 'storybook/test';
import {DateTimePicker, type DateTimePickerProps, type DateTimeRangeValue} from '../components/DateTimePicker';

const meta = {
  title: 'Components/Inputs/DateTimePicker',
  component: DateTimePicker,
  tags: ['autodocs'],
  argTypes: {
    range: {control: 'boolean', description: 'Use a {start, end} value and the shared range calendar.', table: {defaultValue: {summary: 'false'}}},
    showTime: {control: 'boolean', description: 'Include time entry and return date-time values.', table: {defaultValue: {summary: 'true'}}},
    locale: {
      control: 'select',
      options: ['en-US', 'en-GB', 'id-ID'],
      description: 'Set the language and date format.',
    },
    step: {
      name: 'Time interval',
      control: {
        type: 'select',
        labels: {60: '1 minute', 300: '5 minutes', 600: '10 minutes', 900: '15 minutes', 1800: '30 minutes', 3600: '1 hour'},
      },
      options: [60, 300, 600, 900, 1800, 3600],
      description: 'Set the interval between available times.',
    },
    value: {control: false},
    onChange: {control: false},
  },
  parameters: {fds: {approved: true, status: 'approved'}, docs: {description: {component: 'DateTimePicker supports single or range selection and date-only or date-time values through the range and showTime options. Every configuration keeps the same direct-entry field, calendar interaction, validation, and responsive width.'}}},
} satisfies Meta<typeof DateTimePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

const normalizeValue = (value: string, showTime: boolean, fallbackTime: string) => value ? showTime ? `${value.slice(0, 10)}T${value.includes('T') ? value.slice(11, 16) : fallbackTime}` : value.slice(0, 10) : '';

function ControlledPicker(props: DateTimePickerProps) {
  const [singleValue, setSingleValue] = useState('2025-02-03T08:45');
  const [rangeValue, setRangeValue] = useState<DateTimeRangeValue>({start: '2025-02-03T08:45', end: '2025-02-06T17:00'});
  const showTime = props.showTime ?? true;
  if (props.range) {
    const value = {start: normalizeValue(rangeValue.start, showTime, '08:45'), end: normalizeValue(rangeValue.end, showTime, '17:00')};
    return <div style={{width: '26rem', maxWidth: '100%'}}><DateTimePicker {...props} showTime={showTime} value={value} onChange={setRangeValue} /></div>;
  }
  return <div style={{width: '26rem', maxWidth: '100%'}}><DateTimePicker {...props} showTime={showTime} value={normalizeValue(singleValue, showTime, '08:45')} onChange={setSingleValue} /></div>;
}

export const SingleDateTime: Story = {
  args: {
    label: 'Date',
    value: '',
    onChange: () => {},
    range: false,
    showTime: true,
    timezone: 'PST',
    locale: 'en-US',
    step: 900,
    description: 'Enter a value directly or use the calendar button.'
  },
  render: (args) => <ControlledPicker {...args} />,
  play: async ({canvasElement}) => {
    const trigger = canvasElement.querySelector<HTMLButtonElement>('[popovertarget]');
    const panel = canvasElement.querySelector<HTMLElement>('[popover]');
    if (!trigger || !panel) throw new Error('Date-time picker trigger or popover is missing');
    await userEvent.click(trigger);
    await new Promise(requestAnimationFrame);
    const selectedDay = panel.querySelector<HTMLButtonElement>('[aria-selected="true"] > button');
    if (!panel.matches(':popover-open') || !selectedDay || canvasElement.ownerDocument.activeElement !== selectedDay) throw new Error('Calendar did not open on the selected date');
    await userEvent.keyboard('{ArrowRight}');
    await new Promise(requestAnimationFrame);
    if (canvasElement.ownerDocument.activeElement?.getAttribute('data-date') !== '2025-02-04') throw new Error('Arrow key navigation did not move to the next date');
    await userEvent.keyboard('{Escape}');
    await new Promise(requestAnimationFrame);
    if (panel.matches(':popover-open') || canvasElement.ownerDocument.activeElement !== trigger) throw new Error('Escape did not close the calendar and restore focus');
  },
};

export const SingleDate: Story = {args: {label: 'Date', value: '', onChange: () => {}, range: false, showTime: false, locale: 'en-US'}, render: (args) => <ControlledPicker {...args} />};

export const DateTimeRange: Story = {
  args: {range: true, showTime: true, label: 'Shipment window', value: {start: '', end: ''}, onChange: () => {}, timezone: 'PST', locale: 'en-US', startName: 'shipmentStart', endName: 'shipmentEnd', step: 900, description: 'Enter the range directly or use the calendar button.'},
  render: (args) => <ControlledPicker {...args} />,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const start = canvas.getByLabelText('Start date and time');
    const end = canvas.getByLabelText('End date and time');
    const trigger = canvas.getByRole('button', {name: 'Choose shipment window'});
    await expect(end).toHaveAttribute('min', '2025-02-03T08:45');
    await expect(canvasElement.querySelectorAll('.fds-date-time-range-picker__field')).toHaveLength(1);
    await userEvent.click(trigger);
    await new Promise(requestAnimationFrame);
    const panel = canvasElement.querySelector<HTMLElement>('[popover]');
    if (!panel) throw new Error('Range calendar is missing');
    const calendar = within(panel);
    await userEvent.click(calendar.getByRole('button', {name: 'Tuesday, February 4, 2025'}));
    await expect(start).toHaveValue('2025-02-04T08:45');
    await expect(end).toHaveValue('');
    await userEvent.click(calendar.getByRole('button', {name: 'Thursday, February 6, 2025'}));
    await expect(end).toHaveValue('2025-02-06T17:00');
    await expect(panel.querySelectorAll('[aria-selected="true"]')).toHaveLength(2);
  },
};

export const DateRange: Story = {args: {range: true, showTime: false, label: 'Travel dates', value: {start: '', end: ''}, onChange: () => {}, locale: 'en-US'}, render: (args) => <ControlledPicker {...args} />};
export const ValidationError: Story = {args: {label: 'Delivery appointment', value: '', onChange: () => {}, timezone: 'WIB', isRequired: true, error: 'Enter the delivery date and time.'}};
export const Disabled: Story = {args: {label: 'Delivery appointment', value: '', onChange: () => {}, timezone: 'WIB', isDisabled: true, disabledMessage: 'Choose a delivery location before setting the appointment.'}};
