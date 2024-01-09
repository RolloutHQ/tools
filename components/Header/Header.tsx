'use client';

import Image from 'next/image';
import { Group, Button, Divider, Box, Burger, Drawer, ScrollArea, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useAuth } from '@clerk/nextjs';

import classes from './Header.module.css';
import SignUpNotification from '../SignUpNotification/SignUpNotification';

export function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  return (
    <>
      <Box>
        <header className={classes.header}>
          <Group justify="space-between" h="100%">
            <Link href="https://rollout.com/">
              <Image
                src="/tools/tools-logo.svg"
                alt="Rollout Logo"
                width={350}
                height={30}
                priority
              />
            </Link>

            <Group visibleFrom="sm">
              {!isSignedIn ? (
                <>
                  <Button
                    variant="default"
                    href={`/tools/sign-in?referringPath=${encodeURIComponent(pathname)}`}
                    component={Link}
                  >
                    Log in
                  </Button>
                  <Button
                    href={`/tools/sign-up?referringPath=${encodeURIComponent(pathname)}`}
                    component={Link}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <UserButton />
              )}
            </Group>

            <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
          </Group>
        </header>

        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          size="100%"
          padding="md"
          hiddenFrom="sm"
          zIndex={1000000}
          title={
            <Image
              src="/tools/tools-logo.svg"
              alt="Rollout Logo"
              width={350}
              height={30}
              priority
            />
          }
        >
          <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
            <Divider my="sm" />

            <Group justify="center" grow pb="xl" px="md">
              {!isSignedIn ? (
                <>
                  <Button
                    variant="default"
                    href={`/tools/sign-in?referringPath=${encodeURIComponent(pathname)}`}
                    component={Link}
                  >
                    Log in
                  </Button>
                  <Button
                    href={`/tools/sign-up?referringPath=${encodeURIComponent(pathname)}`}
                    component={Link}
                  >
                    Sign up
                  </Button>
                </>
              ) : (
                <UserButton afterSignOutUrl={pathname} />
              )}
            </Group>
          </ScrollArea>
        </Drawer>
      </Box>
      {!isSignedIn && <SignUpNotification />}
    </>
  );
}
