import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

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
      async authorize(credentials, req) {
        if (
          credentials.username === 'andrea' &&
          credentials.password === 'test'
        ) {
          return { email: credentials.username }
        }
        return null
      },
    }),
  ],
  session: {
    maxAge: 60 * 10,
  },
})
