import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {Textarea} from '../components/Textarea';

const meta = {
  title: 'Components/Inputs/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    label: 'Handling instructions',
    value: '',
    onChange: () => {},
    description: 'Visible to the operations team.',
    placeholder: 'Add handling instructions',
  },
  parameters: {
    fds: {approved: true, status: 'approved'},
    docs: {
      description: {
        component: 'Textarea captures longer free-form input. Keep a visible label, use description for persistent guidance, and pass error when the owning form rejects the value.',
      },
    },
  },
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ControlledValue: Story = {
  render: () => {
    const [value, setValue] = useState('Keep cargo dry and call the consignee before delivery.');
    return <Textarea label="Handling instructions" value={value} onChange={setValue} description="Visible to the operations team." />;
  },
};

export const Validation: Story = {
  args: {
    label: 'Review note',
    isRequired: true,
    description: 'Explain why the shipment needs another review.',
    error: 'Enter a review note.',
  },
};

export const ReadOnlyAndDisabled: Story = {
  render: () => <div style={{display: 'grid', gap: 16, minWidth: 320}}><Textarea label="Source instructions" value="Copied from the master job." onChange={() => {}} readOnly description="Read-only source value." /><Textarea label="Inherited instructions" value="Keep cargo dry." onChange={() => {}} isDisabled description="Inherited from the shipment." /></div>,
};
