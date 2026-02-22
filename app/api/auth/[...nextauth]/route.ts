import NextAuth, { AuthOptions } from "next-auth"
import Google from "next-auth/providers/google"

export const authOptions: AuthOptions =  {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID ?? "",
            clientSecret: process.env.AUTH_GOOGLE_SECRET ?? ""
        })
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, account }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token
                token.sub = account.userId
            }
            return token
        }
    },
    secret: process.env.AUTH_SECRET
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST}