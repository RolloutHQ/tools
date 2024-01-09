'use client';

import { Group, ActionIcon, rem, Text } from '@mantine/core';
import { IconBrandX, IconBrandYoutube, IconBrandGithub } from '@tabler/icons-react';

import Link from 'next/link';
import Image from 'next/image';
import classes from './Footer.module.css';

const links = [
  { link: 'https://docs.rollout.com/security-and-legal/privacy-policy', label: 'Privacy' },
  { link: 'https://docs.rollout.com/security-and-legal/terms-of-service', label: 'Terms' },
];

export function Footer() {
  const items = links.map((link) => (
    <Link href={link.link} key={link.label}>
      <Text c="dimmed" lh={1} size="sm">
        {link.label}
      </Text>
    </Link>
  ));

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        <Link href="https://rollout.com/">
          <Image
            width={85}
            height={20}
            src="/tools/rollout-logo.svg"
            alt="Rollout - Embedded Integrations Platform"
          />
        </Link>

        <Group className={classes.links}>{items}</Group>

        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <Link href="https://github.com/RolloutHQ" key="github">
            <ActionIcon size="lg" variant="default" radius="xl">
              <IconBrandGithub style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
            </ActionIcon>
          </Link>
          <Link href="https://twitter.com/rollouthq" key="x">
            <ActionIcon size="lg" variant="default" radius="xl" key="x">
              <IconBrandX style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
            </ActionIcon>
          </Link>
          <Link href="https://youtube.com/@Rollout-Integrations" key="youtube">
            <ActionIcon size="lg" variant="default" radius="xl">
              <IconBrandYoutube style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
            </ActionIcon>
          </Link>
        </Group>
      </div>
    </div>
  );
}
