import type {Meta, StoryObj} from '@storybook/react-vite';
import {Button} from '../components/Button';
import {InlineAlert} from '../components/InlineAlert';

const meta = {title: 'Components/Feedback/InlineAlert', component: InlineAlert, tags: ['autodocs'], parameters: {fds: {approved: true, status: 'approved'}, docs: {description: {component: 'InlineAlert keeps important feedback in the workflow. Error messages use an assertive alert; warning, info, and success messages are polite status updates. Use the optional action only for the direct recovery step.'}}}} satisfies Meta<typeof InlineAlert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Informational: Story = {args: {tone: 'info', children: 'The carrier changed the document cut-off to 16:00 WIB.'}};
export const Success: Story = {args: {tone: 'success', children: 'Invoice INV-24018 was approved and posted.'}};
export const Warning: Story = {args: {tone: 'warning', children: 'The supplier reference is missing from this charge.'}, play: async ({canvasElement}) => {if (canvasElement.querySelector('[role="alert"]') || !canvasElement.querySelector('[role="status"]')) throw new globalThis.Error('Routine warnings must use a polite status region');}};
export const Error: Story = {args: {tone: 'error', children: 'Ocean freight must be greater than zero before approval.'}};
export const TitleAndDescription: Story = {args: {tone: 'warning', title: 'Approval required', description: 'An accounting approver must review this invoice before it can be posted.'}};
export const OptionalAction: Story = {args: {tone: 'error', title: 'Posting blocked', description: 'Resolve the tax code mismatch to continue.', action: <Button size="small">Review charge</Button>}};
export const ConstrainedWidth: Story = {
  args: {tone: 'warning', title: 'Reference needs review', description: 'The supplier reference SUPPLIER-REFERENCE-2026-08-15-000184 cannot be matched.', action: <Button size="small">Review</Button>},
  parameters: {docs: {description: {story: 'Long operational references wrap without displacing the direct recovery action.'}}},
  decorators: [(Story) => <div style={{width: 320, maxWidth: '100%'}}><Story /></div>],
};
