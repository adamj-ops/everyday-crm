'use client';

import { ClerkProvider } from '@clerk/nextjs';

type ClerkWrapperProps = {
  children: React.ReactNode;
  locale: string;
};

export function ClerkWrapper({ children }: ClerkWrapperProps) {
  // Simplified Clerk configuration for debugging
  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  );
}
