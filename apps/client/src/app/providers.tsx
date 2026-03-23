'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/hooks/useAuth';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster 
          theme="dark" 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: '#0a0a0a',
              border: '1px solid rgba(158, 57, 141, 0.2)',
              color: 'white',
              fontFamily: 'var(--font-sans)',
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
