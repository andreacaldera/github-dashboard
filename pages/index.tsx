import { Typography } from '@mui/material'
import { ActionDashboard } from '../src/common/action-dashboard'
import { useSession } from 'next-auth/react'
import styled from '@emotion/styled'

const Title = styled(Typography)`
  margin-top: 3rem;
`

const Home = () => {
  const { data: session } = useSession()
  if (!session?.user) {
    return <p>Please login to access this page</p>
  }
  return (
    <>
      <Title variant="h3">Core components</Title>
      <ActionDashboard
        organisation="DigitalInnovation"
        project="onyx-nx"
        action="Release"
        nxApp="core-components"
      />
      <Title variant="h3">Jaeger</Title>
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
      <Title variant="h3">Browse</Title>
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
      <Title variant="h3">Banking service</Title>
      <ActionDashboard
        organisation="DigitalInnovation"
        project="onyx-nx"
        action="Release"
        nxApp="banksrv"
      />
      <ActionDashboard
        organisation="DigitalInnovation"
        project="bankingserviceshub-release"
        action="Release"
      />
    </>
  )
}

export default Home
