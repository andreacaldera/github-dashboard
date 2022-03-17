import { differenceInMinutes } from 'date-fns'
import { ActionsStatus } from './project-status'

export const getJobStats = (actionStatus: ActionsStatus['data']) => {
  const jobs = actionStatus.map(({ jobs }) => jobs.jobs).flat()
  const jobStats = jobs.reduce((result, { name, started_at, completed_at }) => {
    if (result[name]) {
      return {
        ...result,
        [name]:
          result[name] +
          differenceInMinutes(new Date(completed_at), new Date(started_at)),
      }
    }
    return {
      ...result,
      [name]: differenceInMinutes(new Date(completed_at), new Date(started_at)),
    }
  }, {} as Record<string, number>)
  return Object.entries(jobStats)
    .map(([name, time]) => ({ name, time }))
    .sort((a, b) => (a.time > b.time ? -1 : 1))
}
