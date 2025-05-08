"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Icons } from '@/components/icons';

const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen">
        <Icons.loader className="h-16 w-16 animate-spin text-primary" />
    </div>
);

export default function SponsorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect while initial authentication check is loading
    if (isLoading) {
        return;
    }

    // If loading is finished and user is not authenticated, redirect to login
    if (!isAuthenticated) {
        console.log("SponsorLayout: Not authenticated, redirecting to login.");
        router.replace('/login'); // Use replace to prevent back button issues
    }
    // If authenticated, but role is not sponsor (or admin, if admins can access sponsor area), redirect
    else if (user && !(user.role === 'sponsor' || user.role === 'admin')) {
         console.log(`SponsorLayout: Wrong role (${user.role}), redirecting.`);
         router.replace('/login'); // Or redirect to an unauthorized page
    }
     // If authenticated and correct role, do nothing (allow rendering children)
     // else {
     //    console.log("SponsorLayout: Auth check passed.");
     // }

  }, [isAuthenticated, user, isLoading, router]);

  // Show loading indicator while checking auth status
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Render children only if authenticated and role check (implicitly) passed
  // The useEffect will redirect away if checks fail *after* loading is done.
  // We only want to render children if loading is done AND user is authenticated (and correct role)
  if (!isAuthenticated || !user || !(user.role === 'sponsor' || user.role === 'admin')) {
      // Render loading or null while redirecting to prevent brief flash of content
      return <LoadingSpinner />;
       // return null;
  }


  // If authenticated and correct role, render the actual layout/children
  return (
        <div>
            {/* Add Sponsor-specific layout elements here if needed, like a navbar */}
            {/* <h1>Sponsor Area</h1> */}
            {children}
        </div>
    );
}