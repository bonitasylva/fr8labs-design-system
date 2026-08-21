import type {Meta, StoryObj} from '@storybook/react-vite';
import {ActionGroup} from '../components/ActionGroup';
import {Button} from '../components/Button';
import {PageHeader} from '../components/PageHeader';

const actions = <ActionGroup><Button tone="secondary">Export</Button><Button>Create shipment</Button></ActionGroup>;
const breadcrumbs = <ol style={{display: 'flex', gap: 'var(--fds-space-2)', margin: 0, padding: 0, listStyle: 'none'}}><li><a href="#operations">Operations</a></li><li aria-hidden="true">/</li><li aria-current="page">Shipment review</li></ol>;

const meta = {
  title: 'Components/Layout/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  args: {eyebrow: 'Operations', title: 'Shipment review', description: 'Find active shipments and resolve exceptions.'},
  argTypes: {actions: {control: false}, breadcrumbs: {control: false}},
  parameters: {
    fds: {approved: true, status: 'approved'},
    docs: {
      description: {
        component: 'PageHeader establishes the page title and optional context before page content. Keep one h1 per page, provide breadcrumbs as navigation, and place related actions in ActionGroup.',
      },
    },
  },
} satisfies Meta<typeof PageHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const TitleAndDescription: Story = {};
export const BreadcrumbsAndActions: Story = {args: {breadcrumbs, actions}};
export const NarrowWrapping: Story = {args: {actions}, decorators: [(Story) => <div style={{maxWidth: 320}}><Story /></div>]};
export const LongContent: Story = {args: {title: 'International multimodal shipment review and exception resolution', description: 'Review operational details, documents, and outstanding actions before the shipment can proceed.', actions}};
