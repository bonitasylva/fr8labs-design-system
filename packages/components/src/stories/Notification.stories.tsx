import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, fn, userEvent, within} from 'storybook/test';
import {Notification} from '../components/Notification';
import './Notification.stories.css';

const handleRetry = fn();

const meta = {
  title: 'Components/Feedback/Notification',
  component: Notification,
  tags: ['autodocs'],
  argTypes: {
    children: {control: false},
    title: {control: 'text'},
    description: {control: 'text'},
    list: {control: false},
    action: {control: false},
    onDismiss: {control: false},
  },
  decorators: [(Story) => <div className="fds-notification-preview"><Story /></div>],
  parameters: {
    fds: {approved: false, status: 'experimental'},
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Notification is a floating, non-modal message for a short update that is not tied to one visible part of the workflow. Use a short title by default so the outcome is easy to scan; omit it only when one brief message communicates the complete status. Embed destination links in the message text. The optional action always renders as the notification’s single default button and is reserved for an immediate command such as Retry upload or Undo. For two or three documents, link each filename in the list. For four or more, state the total and embed one View all documents link in the message. Notifications remain until dismissed and never move focus. Use InlineAlert when the message belongs beside the affected content.',
      },
    },
  },
} satisfies Meta<typeof Notification>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  args: {
    tone: 'success',
    title: 'Shipment invoice created',
    description: 'Quotation QTN-24071 was converted to',
    dismissIconAriaLabel: 'Dismiss notification',
  },
  render: ({description, ...args}) => <Notification {...args} description={<>{description} <a href="#shipment-invoice-INV-24018">shipment invoice INV-24018</a>.</>} />,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const notification = canvas.getByRole('status');
    const destinationLink = canvas.getByRole('link', {name: 'shipment invoice INV-24018'});
    await expect(getComputedStyle(notification.parentElement as HTMLElement).position).toBe('static');
    await expect(canvas.getByText('Shipment invoice created')).toBeInTheDocument();
    await expect(destinationLink).toHaveAttribute('href', '#shipment-invoice-INV-24018');
    await userEvent.tab();
    await expect(destinationLink).toHaveFocus();
    await expect(getComputedStyle(destinationLink).outlineStyle).toBe('solid');
    await userEvent.tab();
    await expect(canvas.getByRole('button', {name: 'Dismiss notification'})).toHaveFocus();
  },
};

export const Statuses: Story = {
  render: () => <div style={{display: 'grid', gap: 'var(--fds-space-4)', width: 'min(24rem, 100%)'}}>
    <Notification title="Carrier message received">A new carrier message is available for this shipment.</Notification>
    <Notification tone="success" title="Changes saved">Your changes were saved.</Notification>
    <Notification tone="warning" title="Connection interrupted">Updates will resume when the connection is restored.</Notification>
    <Notification tone="error" title="Upload failed">The commercial invoice could not be uploaded.</Notification>
  </div>,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('status')).toHaveLength(3);
    await expect(canvas.getByRole('alert')).toBeInTheDocument();
    await userEvent.click(canvas.getAllByRole('button', {name: 'Dismiss'})[0]);
    await expect(canvas.getAllByRole('status')).toHaveLength(2);
  },
};

export const Examples: Story = {
  render: () => <div style={{display: 'grid', gap: 'var(--fds-space-4)', width: 'min(24rem, 100%)'}}>
    <Notification tone="success" title="Shipment invoice created" description={<>Quotation QTN-24071 was converted to <a href="#shipment-invoice-INV-24018">shipment invoice INV-24018</a>.</>} />
    <Notification tone="success" title="3 files duplicated" description="The copies were added to shipment SHP-260081." list={[
      <a href="#document-commercial-invoice">Commercial invoice.pdf</a>,
      <a href="#document-packing-list">Packing list.pdf</a>,
      <a href="#document-bill-of-lading">Bill of lading.pdf</a>,
    ]} />
    <Notification tone="success" title="8 files duplicated" description={<>The copies were added to shipment SHP-260081. <a href="#shipment-documents-SHP-260081">View all 8 documents</a>.</>} />
    <Notification tone="error" title="Upload failed" description="The commercial invoice could not be uploaded." action={{label: 'Retry upload', onClick: handleRetry}} />
  </div>,
  parameters: {docs: {description: {story: 'Destination links are embedded in the message or item list. The only separate action style is the default notification button, used here for Retry upload. Dismissible demonstrates the optional-title exception.'}}},
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('link')).toHaveLength(5);
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3);
    await expect(canvas.getByRole('link', {name: 'View all 8 documents'})).toHaveAttribute('href', '#shipment-documents-SHP-260081');
    handleRetry.mockClear();
    await userEvent.click(canvas.getByRole('button', {name: 'Retry upload'}));
    await expect(handleRetry).toHaveBeenCalledOnce();
  },
};

export const Dismissible: Story = {
  args: {tone: 'success', children: 'Your changes were saved.', dismissIconAriaLabel: 'Dismiss notification'},
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {name: 'Dismiss notification'}));
    await expect(canvas.queryByRole('status')).not.toBeInTheDocument();
  },
};
