import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const ONE_MONTH = 30 * 24 * 60 * 60

const users = process.env.USERS!.split(';').reduce((result, user) => {
  return { ...result, [user.split('|')[0]]: user.split('|')[1] }
}, {})

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'Email' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Password',
        },
      },
      async authorize(credentials: any, req) {
        if ((users as any)[credentials.username] === credentials?.password) {
          return { email: credentials.username }
        }
        return null
      },
    }),
  ],
  session: {
    maxAge: ONE_MONTH,
  },
  callbacks: {
    async jwt({ token }) {
      token.userRole = 'admin'
      return token
    },
  },
})
