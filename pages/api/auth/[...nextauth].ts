import NextAuth from 'next-auth'
import Okta from 'next-auth/providers/okta'

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        Okta({
            clientId: process.env.OKTA_OAUTH2_CLIENT_ID as string,
            clientSecret: process.env.OKTA_OAUTH2_CLIENT_SECRET as string,
            issuer: process.env.OKTA_OAUTH2_ISSUER as string,
            authorization: { params: { scope: 'offline_access openid email profile' } },
        }),
    ],
    secret: process.env.SECRET as string,
    //all the refresh requests should hit here => it hsould diven that override exisits in next config, would redirect everyihgn to 
     callbacks: {
         async jwt(props) {
           const {token, account, profile} = props;

              if (account) {
                  // Save the access token and refresh token in the JWT on the initial login
                  return {
                      access_token: account.access_token,
                      expires_at: account.expires_at,
                      userprofile: profile,
                      id_token: account.id_token,
                      refresh_token: account.refresh_token,
                  }
              } else if (Date.now() < token.expires_at * 1000) {
                  // If the access token has not expired yet, return it
                  return token
              } 
              else {
                // If the access token has expired, try to refresh it
                 try {
                     const response = await fetch("https://dev-49057522.okta.com/oauth2/default/v1/token", {
                         headers: { "Content-Type": "application/x-www-form-urlencoded", 
                         },
                         body: new URLSearchParams({
                             grant_type: "refresh_token",
                             refresh_token: token.refresh_token,
                             scope: "offline_access openid email profile",
                             client_id: process.env.OKTA_OAUTH2_CLIENT_ID as string,
                             client_secret: process.env.OKTA_OAUTH2_CLIENT_SECRET as string,
                         }),
                         method: "POST",
                     })
                     const tokens = await response.json()

                     if (!response.ok) throw tokens

                     delete token?.error
                     return {
                         ...token, // Keep the previous token properties
                         access_token: tokens.access_token,
                         expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
                         id_token: tokens.id_token,
                         // Fall back to old refresh token, but note that
                         // many providers may only allow using a refresh token once.
                         refresh_token: tokens.refresh_token ?? token.refresh_token,
                     }
                 } catch (error) {
                     // console.error("Error refreshing access token", error)
                     // The error property will be used client-side to handle the refresh token error
                     return { ...token, error: "RefreshAccessTokenError" as const }
                 }
             }
         },
         async session({ session, token }) {
           if (token.error) {
             session.error = token.error
           }
           session.accessToken = token?.access_token
           session.refresh_token = token?.refresh_token 
           session.user.name = token?.userprofile?.name
           session.user.email = token?.userprofile?.email
           session.user.image = token?.userprofile?.email
           session.user.user_id = token?.userprofile?.user_id

           session.expires = token.expires_at
    
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
