import type { AppRouter } from '@t4/api/src/router'
import { createTRPCReact } from '@trpc/react-query'

/**
 * A wrapper for your app that provides the TRPC context.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { useState } from 'react'
import superjson from 'superjson'
import { getSessionToken } from '../auth/credentials'

/**
 * A set of typesafe hooks for consuming your API.
 */
export const trpc = createTRPCReact<AppRouter>()

const getApiUrl = () => {
  const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}`
  // Note: Uncomment to use localhost
  // Solution: https://discord.com/channels/1117289587472081016/1208826425902108703/1209067524944302150
  // return replaceLocalhost(apiUrl)
  // ! NOTE: Uncomment this for android
  return apiUrl
}

export const TRPCProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          async headers() {
            const token = getSessionToken()
            return {
              Authorization: token ? `Bearer ${token}` : undefined,
              'x-enable-tokens': 'true',
            }
          },
          url: `${getApiUrl()}/trpc`,
        }),
      ],
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
