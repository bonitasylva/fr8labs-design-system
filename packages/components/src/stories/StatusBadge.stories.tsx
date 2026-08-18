import type {Meta, StoryObj} from '@storybook/react-vite';
import {StatusBadge} from '../components/StatusBadge';

const meta = {title: 'Components/Feedback/StatusBadge', component: StatusBadge, tags: ['autodocs'], parameters: {fds: {approved: true, status: 'approved'}, layout: 'centered', docs: {description: {component: 'StatusBadge presents short, read-only workflow metadata. The status selects the FDS tone; label supplies the exact product-facing wording and casing. Do not use it as a live announcement or as the only explanation of a blocked action.'}}}} satisfies Meta<typeof StatusBadge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FreightStatuses: Story = {
  args: {status: 'draft'},
  parameters: {docs: {description: {story: 'Figma-inspired tones mapped to FDS freight semantics: draft is normal; approved and paid are success; pending and blocked are warning; rejected and overdue are danger.'}}},
  render: () => <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>{(['draft', 'approved', 'paid', 'pending', 'blocked', 'rejected', 'overdue'] as const).map((status) => <StatusBadge key={status} status={status} />)}</div>,
};

export const ProductFacingLabel: Story = {
  args: {status: 'approved', label: 'EDI ready'},
  parameters: {docs: {description: {story: 'Custom labels keep the exact product wording and casing supplied by the caller.'}}},
};
