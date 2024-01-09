import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import React from 'react';

import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ClerkProvider } from '@clerk/nextjs';
import { theme } from '../theme';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';

export const metadata = {
  title: 'Automation Tools by Rollout',
  description: 'A directory of free tools build using Rollouts Embedded Integrations Platform',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <MantineProvider theme={theme}>
          <ClerkProvider>
            <Header />
            <div style={{ flexGrow: 1 }}>{children}</div>
            <Notifications />
            <Footer />
          </ClerkProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
