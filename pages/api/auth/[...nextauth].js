import NextAuth from "next-auth"
import TraktProvider from "next-auth/providers/trakt"

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        TraktProvider({
            clientId: process.env.TRAKT_ID,
            clientSecret: process.env.TRAKT_SECRET,
        }),
    ],
    callbacks: {
        async jwt({ token, user, account, profile, isNewUser }) {
            // console.log('jwt')
            // console.log(token)
            // console.log(user)
            // console.log(account)
            // console.log(profile)
            // console.log(isNewUser)
            // if (user) {
            //     token.accessToken = user.access_token
            // }
            if (profile) {
                token.username = profile.username
            }
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, user, token }) {
            // console.log('session')
            // console.log(session)
            // console.log(user)
            // console.log(token)
            if (token) {
                session.user.name = token.username
            }
            return session
        }
    },
    debug: true
}

export default NextAuth(authOptions)