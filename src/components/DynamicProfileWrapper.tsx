'use client';

import dynamic from 'next/dynamic';

const ClientProfilePage = dynamic(() => import('./ClientProfilePage'), {
  ssr: false
});

export default function DynamicProfileWrapper() {
  return <ClientProfilePage />;
} 