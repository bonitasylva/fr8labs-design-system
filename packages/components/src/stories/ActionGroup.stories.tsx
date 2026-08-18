import type {Meta, StoryObj} from '@storybook/react-vite';
import {Icon} from 'sandbox-fds-icons';
import {ActionGroup} from '../components/ActionGroup';
import {Button} from '../components/Button';
import {IconButton} from '../components/IconButton';

const icon = (name: string) => <Icon name={name} />;

const meta = {
  title: 'Components/Actions/ActionGroup',
  component: ActionGroup,
  args: {
    align: 'end',
    children: <><Button tone="secondary">Cancel</Button><Button>Save changes</Button></>,
  },
  argTypes: {
    children: {control: false, description: 'Two or more related, independently operable actions.'},
    align: {control: 'inline-radio', options: ['start', 'end'], description: 'Inline alignment within the available width.', table: {defaultValue: {summary: 'end'}}},
  },
  parameters: {
    fds: {approved: true, status: 'approved'},
    layout: 'padded',
    docs: {description: {component: 'ActionGroup arranges related, independent actions with consistent spacing, wrapping, and alignment. It does not join buttons, manage selection, or add keyboard behavior.'}},
  },
} satisfies Meta<typeof ActionGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SupportingThenPrimary: Story = {};

export const StartAligned: Story = {
  args: {align: 'start', children: <><Button tone="secondary">Export</Button><Button>Update shipment</Button></>},
};

export const MixedActions: Story = {
  args: {
    children: <><IconButton aria-label="Download invoice" tone="secondary">{icon('download')}</IconButton><Button tone="secondary">Preview</Button><Button>Send invoice</Button></>,
  },
};

export const Wrapping: Story = {
  args: {children: <><Button tone="tertiary">Save draft</Button><Button tone="secondary">Preview invoice</Button><Button>Send for approval</Button></>},
  decorators: [(Story) => <div style={{maxWidth: 260}}><Story /></div>],
};
