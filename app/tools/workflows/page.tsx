'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Container, Title } from '@mantine/core';

import { WorkflowBuilder } from '@/components/workflows/WorkflowBuilder';

export default function WorkflowsPage() {
  const { isSignedIn, user } = useUser();

  const [userId, setUserId] = useState(crypto.randomUUID());
  useEffect(() => {
    if (isSignedIn) {
      setUserId(user.id);
    }
  }, [user?.id, isSignedIn]);

  return (
    <Container mt="3rem">
      <Title my="2rem">👋 Hi {isSignedIn ? user.firstName : 'there'}</Title>
      <WorkflowBuilder userId={userId} key={userId} />
    </Container>
  );
}
