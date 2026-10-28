import { useState } from 'react';
import { Modal, Button } from '@indigo-shared-lib/ui';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    enterFrom: {
      control: 'select',
      options: ['center', 'left', 'right', 'bottom'],
      description: 'Slide-in direction for the panel',
    },
    closePosition: {
      control: 'select',
      options: ['header-right', 'header-left', 'top-center'],
      description: 'Where the close (x) button is rendered',
    },
    closeOnOverlayClick: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
  },
};

export default meta;

const SAMPLE_AMENITIES = [
  { id: 'wifi', label: 'Free WiFi', icon: 'WiFi' },
  { id: 'breakfast', label: 'Free Breakfast', icon: 'Meal' },
  { id: 'parking', label: 'Free self-parking', icon: 'Park' },
  { id: 'ac', label: 'Air conditioning', icon: 'AC' },
  { id: 'tv', label: 'Smart TV', icon: 'TV' },
  { id: 'safe', label: 'In-room safe', icon: 'Safe' },
];

const SAMPLE_FACTS = ['21 sq m', 'Hill view', 'Sleep 2', '2 Single Beds OR 1 Double Bed'];

// ── Generic demo wrapper ────────────────────────────────────────────────────
function ModalDemo({ enterFrom, closePosition, size, title, children, footer }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={title ?? 'Example Modal'}
        enterFrom={enterFrom ?? 'center'}
        closePosition={closePosition ?? 'header-right'}
        size={size ?? 'md'}
        footer={footer}
      >
        {children ?? <p>This is the modal body content.</p>}
      </Modal>
    </>
  );
}

// ── Stories ─────────────────────────────────────────────────────────────────

export const Default = {
  render: () => (
    <ModalDemo
      footer={
        <>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </>
      }
    />
  ),
};

/** Slides in from the left edge — full-height drawer */
export const SlideFromLeft = {
  render: () => <ModalDemo title="Left Drawer" enterFrom="left" closePosition="header-left" />,
};

/** Slides in from the right edge — full-height drawer (matches mobile Figma pattern) */
export const SlideFromRight = {
  render: () => <ModalDemo title="Right Drawer" enterFrom="right" closePosition="header-left" />,
};

/** Close icon on the left side of the header */
export const CloseHeaderLeft = {
  render: () => <ModalDemo title="Close on Left" closePosition="header-left" />,
};

/** Close icon floats above and centred over the panel */
export const CloseTopCenter = {
  render: () => <ModalDemo title="Inclusions at Fariyas Resort" closePosition="top-center" />,
};

/** Mobile popover: bottom sheet + close icon above header */
export const MobileBottomPopover = {
  render: () => (
    <ModalDemo title="All Amenities" enterFrom="bottom" closePosition="top-center" size="md">
      <p>This is a bottom popover sheet for mobile layouts.</p>
      <p>Use this variant for slide-up interactions from the bottom edge.</p>
    </ModalDemo>
  ),
};
