import type {Meta, StoryObj} from '@storybook/react-vite';
import {Metric} from '../components/Metric';

const meta = {
  title: 'Components/Data display/Metric',
  component: Metric,
  tags: ['autodocs'],
  parameters: {fds: {approved: true, status: 'approved'}, docs: {description: {component: 'Metric presents one labelled value with optional context and change using native description-list semantics. Use compact in dense summaries. Loading is visible and marks the metric busy; unavailable is an explicit terminal state. Change direction describes movement, while favorable or unfavorable tone describes business meaning. Include that meaning in the visible change text instead of relying on color. Pages that need an async completion announcement should own one aggregate status rather than making every metric live.'}}},
  decorators: [(Story) => <div style={{minWidth: '12rem'}}><Story /></div>],
} satisfies Meta<typeof Metric>;
export default meta;
type Story = StoryObj<typeof meta>;

export const LabelAndValue: Story = {args: {label: 'Total charges', value: 'USD 12,480.00'}};
export const SecondaryDescription: Story = {args: {label: 'Outstanding balance', value: 'USD 4,220.00', description: 'Across three open supplier invoices.'}};
export const MovementAndBusinessMeaning: Story = {args: {label: 'Revenue', value: 'USD 28,400'}, render: () => <div style={{display: 'flex', gap: '2rem', flexWrap: 'wrap'}}><Metric label="Revenue" value="USD 28,400" change={{direction: 'up', tone: 'favorable', value: '8.4% favorable this month'}} /><Metric label="Accrued cost" value="USD 12,480" change={{direction: 'up', tone: 'unfavorable', value: '2.3% over quoted cost'}} /></div>};
export const LoadingOrUnavailable: Story = {args: {label: 'Accrued cost'}, render: () => <div style={{display: 'flex', gap: '2rem', flexWrap: 'wrap'}}><Metric label="Accrued cost" isLoading /><Metric label="Carrier rate" isUnavailable /></div>};
export const CompactFreightAccounting: Story = {args: {label: 'Ocean freight', value: 'USD 12,480.00', description: 'AP · OFR-LCL · CARRIER-2026-7842', change: {direction: 'up', tone: 'unfavorable', value: '2.3% over quoted cost'}, density: 'compact'}};
