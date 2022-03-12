import {
  CssBaseline,
  makeStyles,
  ThemeProvider,
  Typography,
} from '@material-ui/core'
import { ProjectDashboard } from '../src/common/project-dashboard'
import theme from '../src/common/theme'
import { useSession, signOut, signIn } from 'next-auth/react'
import styled from '@emotion/styled'
import { Button } from '@mui/material'
import { ActionDashboard } from '../src/common/action-dashboard'

const Container = styled.div`
  padding: 0 5rem;
`

export default function Home() {
  const { data: session } = useSession()

  return (
    <>
      {session ? (
        <>
          <p>Welcome back {session.user.email}</p>
          <Button onClick={() => signOut()}>Sign out</Button>
        </>
      ) : (
        <>
          <p>Not logged in</p>
          <Button onClick={() => signIn()}>Sign in</Button>
        </>
      )}

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container>
          <Typography variant="h3" component="h3">
            Github Dashboard
          </Typography>
          {/* <ProjectDashboard
           organisation="andreacaldera"
           project="eastendcc-www"
         />
         <ProjectDashboard
           organisation="andreacaldera"
           project="eastendcc-api"
         /> */}
          <ProjectDashboard
            organisation="DigitalInnovation"
            project="onyx-nx"
          />
          <ActionDashboard
            organisation="DigitalInnovation"
            project="jaeger-release"
            action="release"
          />
        </Container>
      </ThemeProvider>
    </>
  )
}
