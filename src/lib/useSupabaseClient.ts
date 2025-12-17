import { useAuth } from '@clerk/nextjs'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { useMemo } from 'react'

// Singleton Supabase client for the browser.
// This avoids multiple GoTrueClient instances sharing the same storage key.
let browserSupabaseClient: SupabaseClient | null = null

export function useSupabaseClient() {
    const { getToken } = useAuth()

    return useMemo(() => {
        if (browserSupabaseClient) {
            return browserSupabaseClient
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

        browserSupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
            global: {
                fetch: async (url, options = {}) => {
                    try {
                        // Get Clerk JWT token for Supabase
                        const clerkToken = await getToken({ template: 'supabase' })

                        if (!clerkToken) {
                            console.error('❌ Clerk JWT token is null. Please ensure:')
                            console.error('1. You have created a JWT template named \"supabase\" in Clerk Dashboard')
                            console.error('2. The template is properly configured with Supabase issuer URL')
                            console.error('3. You are signed in to the application')
                            throw new Error('Clerk JWT token not available. Please configure the \"supabase\" JWT template in Clerk Dashboard.')
                        }

                        // Add token to request headers
                        const headers = new Headers(options?.headers)
                        headers.set('Authorization', `Bearer ${clerkToken}`)

                        return fetch(url, {
                            ...options,
                            headers,
                        })
                    } catch (error) {
                        console.error('Error in Supabase client fetch:', error)
                        throw error
                    }
                },
            },
        })

        return browserSupabaseClient
    }, [getToken])
}
