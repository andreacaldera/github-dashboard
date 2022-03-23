import { useEffect, useState } from 'react'
import { ActionsStatus } from './project-status'

const DATA_FETCH_INTERVAL = 60 * 1000

export const useActionDashboardApi = ({
  organisation,
  project,
  action,
  nxApp,
}: {
  organisation: string
  project: string
  action: string
  nxApp?: string
}) => {
  const [actionsData, setActionsData] = useState<ActionsStatus>()

  const fetchFromApi = async () => {
    const data = await fetch(
      `/api/action-summary?organisation=${organisation}&project=${project}&action=${action}${
        nxApp ? `&nxApp=${nxApp}` : ''
      }`
    )
    console.log('status', data.status)
    if (data.status >= 400) {
      console.error('Unable to retrieve data')
    }
    const body = await data.json()
    setActionsData(body)
  }

  useEffect(() => {
    void fetchFromApi()
    const dataFetch = setInterval(fetchFromApi, DATA_FETCH_INTERVAL)
    return () => {
      clearTimeout(dataFetch)
    }
  }, [])

  return actionsData
}
