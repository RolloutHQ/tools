'use client';

import { useSearchParams } from 'next/navigation';

import { SignIn } from '@clerk/nextjs';

export default function Page() {
  const searchParams = useSearchParams();
  const referringPath = searchParams.get('referringPath');

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '3rem',
      }}
    >
      <SignIn redirectUrl={referringPath} />
    </div>
  );
}
