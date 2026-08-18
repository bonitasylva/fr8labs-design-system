import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {Tabs, type TabsItem} from '../index';

const items: readonly TabsItem[] = [
  {value: 'summary', label: 'Summary', content: <p>Shipment SHP-260081 is moving from Jakarta to Rotterdam.</p>},
  {value: 'charges', label: 'Charges', content: <p>Sell and buy charges are ready for review.</p>},
  {value: 'documents', label: 'Documents', content: <p>House bill and carrier draft are available.</p>},
];

function ShipmentTabs({tabs = items}: {tabs?: readonly TabsItem[]}) {
  const [value, setValue] = useState('summary');
  return <Tabs ariaLabel="Shipment sections" items={tabs} value={value} onChange={setValue} />;
}

const meta = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: {ariaLabel: 'Shipment sections', items, value: 'summary', onChange: () => {}},
  parameters: {fds: {approved: true, status: 'approved'}, docs: {description: {component: 'Approved Tabs switch between related in-page panels. This initial horizontal slice uses immediate automatic activation, native buttons, and one roving tab stop.'}}},
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ShipmentWorkspace: Story = {render: () => <ShipmentTabs />};

export const UnavailableSection: Story = {
  render: () => <ShipmentTabs tabs={[items[0], {...items[1], disabled: true}, items[2]]} />,
  play: async ({canvasElement}) => {
    const tabs = [...canvasElement.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    tabs[0]?.focus();
    tabs[0]?.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}));
    await new Promise((resolve) => setTimeout(resolve));
    if (tabs[1]?.tabIndex !== -1 || !tabs[1]?.disabled || tabs[2]?.getAttribute('aria-selected') !== 'true' || canvasElement.ownerDocument.activeElement !== tabs[2]) throw new Error('Tabs roving focus or disabled-state contract failed');
    tabs[2]?.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}));
    await new Promise((resolve) => setTimeout(resolve));
    if (tabs[0]?.getAttribute('aria-selected') !== 'true' || canvasElement.ownerDocument.activeElement !== tabs[0]) throw new Error('Tabs wrapping contract failed');
  },
};
