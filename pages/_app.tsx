import { CssBaseline } from '@mui/material'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { Header } from '../src/common/components/header'
import '../styles/globals.css'
import styled from '@emotion/styled'

const Container = styled.div`
  padding: 0 5rem;
`

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <CssBaseline />
      <Container>
        <Header />
        <Component {...pageProps} />
      </Container>
    </SessionProvider>
  )
}
