'use client';

import { queryClient } from '@/lib/QueryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Providers;
