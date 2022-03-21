import { Typography } from '@mui/material'
import { ActionDashboard } from '../src/common/action-dashboard'
import { useSession } from 'next-auth/react'

const Home = () => {
  const { data: session } = useSession()
  if (!session?.user) {
    return <p>Please login to access this page</p>
  }
  return (
    <>
      {/* <ProjectDashboard
                organisation="andreacaldera"
                project="eastendcc-www"
              /> */}
      <Typography variant="h3">Core components</Typography>
      <ActionDashboard
        organisation="DigitalInnovation"
        project="onyx-nx"
        action="Release"
        nxApp="core-components"
      />
      <Typography variant="h3">Jaeger</Typography>
      <ActionDashboard
        organisation="DigitalInnovation"
        project="onyx-nx"
        action="Release"
        nxApp="jaeger"
      />
      <ActionDashboard
        organisation="DigitalInnovation"
        project="jaeger-release"
        action="Release"
      />
      <Typography variant="h3">Browse</Typography>
      <ActionDashboard
        organisation="DigitalInnovation"
        project="onyx-nx"
        action="Release"
        nxApp="browse"
      />
      <ActionDashboard
        organisation="DigitalInnovation"
        project="browse-release"
        action="Release"
      />
    </>
  )
}

export default Home
