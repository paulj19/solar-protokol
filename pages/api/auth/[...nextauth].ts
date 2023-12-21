import NextAuth from 'next-auth'
import Okta from 'next-auth/providers/okta'

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        Okta({
            clientId: process.env.OKTA_OAUTH2_CLIENT_ID as string,
            clientSecret: process.env.OKTA_OAUTH2_CLIENT_SECRET as string,
            issuer: process.env.OKTA_OAUTH2_ISSUER as string,
        }),
    ],
    secret: process.env.SECRET as string,
    callbacks: {
        async jwt({ token, account }) {
            console.log("TOKENl", token)
            console.log("ACCOUNT", account)
            if (account) {
                // Save the access token and refresh token in the JWT on the initial login
                const xxx = {
                    access_token: account.id_token,
                    expires_at: Math.floor(Date.now() / 1000 + account.expires_at),
                    refresh_token: account.access_token,
                }
                console.log("jwt callback xxx: ", xxx)
                return xxx
            } else if (Date.now() < token.expires_at * 1000) {
                // If the access token has not expired yet, return it
                return token
            } else {
                // If the access token has expired, try to refresh it
                try {
                    // https://accounts.google.com/.well-known/openid-configuration
                    // We need the `token_endpoint`.
                    const response = await fetch("https://oauth2.googleapis.com/token", {
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: new URLSearchParams({
                            clientId: process.env.OKTA_OAUTH2_CLIENT_ID as string,
                            clientSecret: process.env.OKTA_OAUTH2_CLIENT_SECRET as string,
                            grant_type: "refresh_token",
                            refresh_token: token.access_token,
                        }),
                        method: "POST",
                    })
                    console.log("jwt callback response: ", response)

                    const tokens = await response.json()
                    console.log("jwt callback tokens: ", tokens)

                    if (!response.ok) throw tokens

                    return {
                        ...token, // Keep the previous token properties
                        access_token: tokens.access_token,
                        expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
                        // Fall back to old refresh token, but note that
                        // many providers may only allow using a refresh token once.
                        refresh_token: tokens.refresh_token ?? token.refresh_token,
                    }
                } catch (error) {
                    console.error("Error refreshing access token", error)
                    // The error property will be used client-side to handle the refresh token error
                    return { ...token, error: "RefreshAccessTokenError" as const }
                }
            }
        },
        async session({ session, token }) {
            session.error = token.error
            return session
        },
    },
}

// declare module "@auth/core/types" {
//     interface Session {
//         error?: "RefreshAccessTokenError"
//     }
// }
//
// declare module "@auth/core/jwt" {
//     interface JWT {
//         access_token: string
//         expires_at: number
//         refresh_token: string
//         error?: "RefreshAccessTokenError"
//     }
// }

export default NextAuth(authOptions)