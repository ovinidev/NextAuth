import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../styles/theme';
import { AuthProvider } from '../hook/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default MyApp;
