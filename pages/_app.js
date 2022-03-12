import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'

function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session} refetchInterval={60}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default App
