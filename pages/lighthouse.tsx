import { useSession } from 'next-auth/react'
import { LighthouseDashboard } from '../src/common/lighthouse-dashboard'

const Lighthouse = () => {
  const { data: session } = useSession()
  if (!session?.user) {
    return <p>Please login to access this page</p>
  }

  return (
    <LighthouseDashboard organisation="DigitalInnovation" project="onyx-nx" />
  )
}

export default Lighthouse
