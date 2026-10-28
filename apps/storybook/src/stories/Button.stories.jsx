import { Button } from '@indigo-shared-lib/ui';

const meta = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    fullWidth: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

export const Primary = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

export const Outline = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

export const Ghost = {
  args: {
    children: 'Ghost',
    variant: 'ghost',
  },
};

export const Danger = {
  args: {
    children: 'Delete',
    variant: 'danger',
  },
};

export const Loading = {
  args: {
    children: 'Loading...',
    isLoading: true,
  },
};

export const Small = {
  args: {
    children: 'Small',
    size: 'sm',
  },
};

export const Large = {
  args: {
    children: 'Large',
    size: 'lg',
  },
};
