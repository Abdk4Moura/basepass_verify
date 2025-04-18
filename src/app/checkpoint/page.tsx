"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CheckpointPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return null; // Render nothing, just redirect
}
