import type {Meta, StoryObj} from '@storybook/react-vite';
import {Icon} from 'sandbox-fds-icons';
import {Button} from '../components/Button';
import {EmptyState} from '../components/EmptyState';

const meta = {
  title: 'Components/Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {title: 'No shipments found', description: 'Try changing or clearing the active filters.'},
  parameters: {fds: {approved: true, status: 'approved'}, layout: 'centered', docs: {description: {component: 'EmptyState explains why content is missing and offers one direct next step when recovery is available. Its title is a level-2 heading by default; set headingLevel to match the surrounding section. Icons are decorative. Keep loading, errors, and permission failures in their own states.'}}},
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const NoMatches: Story = {args: {icon: <Icon name="search_off" />, action: <Button tone="tertiary">Clear filters</Button>}};
export const FirstRecord: Story = {args: {title: 'No shipments yet', description: 'Create the first shipment when the booking details are ready.', action: <Button>Create shipment</Button>}};
