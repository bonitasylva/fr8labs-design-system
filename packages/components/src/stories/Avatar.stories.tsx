import type {Meta, StoryObj} from '@storybook/react-vite';
import {Avatar} from '../components/Avatar';

const portrait = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23023c9b'/%3E%3Ccircle cx='32' cy='24' r='12' fill='%23f6f8fb'/%3E%3Cpath d='M12 64c2-16 10-24 20-24s18 8 20 24' fill='%23f6f8fb'/%3E%3C/svg%3E";

const meta = {
  title: 'Components/Data display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {fds: {approved: true, status: 'approved'}, docs: {description: {component: 'Avatar identifies one person with a circular image or initials. `name` supplies the accessible name; the nested image is decorative. Use small in dense rows and medium elsewhere. Empty names and failed images fall back safely. Organization shapes, stacks, presence, and upload behavior are outside this component.'}}},
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ImageAndInitials: Story = {
  args: {name: 'Sample Operator'},
  render: () => <div style={{display: 'flex', alignItems: 'center', gap: 12}}><Avatar name="Sample Operator" src={portrait} /><Avatar name="Demo Reviewer" /><span>Image and initials preserve the person name.</span></div>,
};

export const SizesAndFallbacks: Story = {
  args: {name: 'Sample Operator'},
  render: () => <div style={{display: 'flex', alignItems: 'center', gap: 12}}><Avatar name="Sample Operator" size="small" /><Avatar name="Broken image" src="/missing-avatar.png" /><Avatar name="   " /><span>Small, failed-image, and missing-name boundaries.</span></div>,
};
