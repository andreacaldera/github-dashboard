import { CssBaseline, ThemeProvider, Typography } from '@material-ui/core'
import { ProjectDashboard } from '../src/common/project-dashboard'
import theme from '../src/common/theme'
import styled from '@emotion/styled'
import { ActionDashboard } from '../src/common/action-dashboard'
import { Header } from '../src/common/components/header'
import { useSession } from 'next-auth/react'

const Container = styled.div`
  padding: 0 5rem;
`

const Home = () => {
  const { data: session } = useSession()
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container>
          <Header />
          {session?.user ? (
            <>
              <Typography variant="h3" component="h3">
                Github Dashboard
              </Typography>
              <ProjectDashboard
                organisation="andreacaldera"
                project="eastendcc-www"
              />
              <ProjectDashboard
                organisation="DigitalInnovation"
                project="onyx-nx"
              />
              <ActionDashboard
                organisation="DigitalInnovation"
                project="jaeger-release"
                action="release"
              />
            </>
          ) : (
            <p>Please login to access this page</p>
          )}
        </Container>
      </ThemeProvider>
    </>
  )
}

export default Home
