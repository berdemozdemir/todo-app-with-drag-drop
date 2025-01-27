import type { Metadata } from 'next';
import './globals.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/QueryClient';

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'an example app with drag & drop',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
