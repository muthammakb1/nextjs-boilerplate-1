import { Input } from '@indigo-shared-lib/ui';

const meta = {
  title: 'Components/Input',
  component: Input,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

export const Default = {
  args: {
    placeholder: 'Enter text...',
    label: 'Label',
  },
};

export const WithHelperText = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    helperText: 'We will never share your email.',
  },
};

export const WithError = {
  args: {
    label: 'Password',
    type: 'password',
    error: 'Password must be at least 8 characters.',
  },
};

export const FullWidth = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter your full name',
    fullWidth: true,
  },
};
