import { ProjectDashboard } from '../src/common/project-dashboard'

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
      <Typography variant="h3" component="h3">
        Github Dashboard
      </Typography>
      {/* <ProjectDashboard
                organisation="andreacaldera"
                project="eastendcc-www"
              /> */}
      <ProjectDashboard organisation="DigitalInnovation" project="onyx-nx" />
      <ActionDashboard
        organisation="DigitalInnovation"
        project="jaeger-release"
        action="release"
      />
    </>
  )
}

export default Home
