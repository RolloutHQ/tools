'use client';

import React from 'react';
import Link from 'next/link';
import { Notification } from '@mantine/core';

export default function SignUpNotification() {
  const [showNotification, setShowNotification] = React.useState(true);

  const handleClose = () => {
    setShowNotification(false);
  };
  if (showNotification) {
    return (
      <Notification
        color="yellow"
        radius="xs"
        title="Don't lose your data"
        onClose={handleClose}
        style={{ overflow: 'visible' }}
      >
        Want to use this page for real? <Link href="/tools/sign-up">Sign up</Link> to save your automations
        so you can pick up where you left off
      </Notification>
    );
  }
  return <></>;
}
