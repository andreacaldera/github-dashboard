import { Typography } from '@mui/material'
import { ActionsStatus } from '../project-status'
import { getJobStats } from '../../common/job-stats'

export const JobStats = ({
  actionStatus,
}: {
  actionStatus: ActionsStatus['data']
}) => {
  const jobsStats = getJobStats(actionStatus)
  return (
    <>
      <Typography variant="h4">Job summary</Typography>
      <ul>
        {jobsStats.map(({ name, time }) => {
          if (time > 0) {
            return (
              <li>
                {name}: {time} min(s)
              </li>
            )
          }
          return null
        })}
      </ul>
    </>
  )
}
