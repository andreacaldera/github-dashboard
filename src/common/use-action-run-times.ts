import { ActionStatus } from './project-status'
import { isBefore, isAfter } from 'date-fns'
import { useDateDifference } from './use-date'

export const useActionRunTimes = (jobs: ActionStatus['jobs']['jobs']) => {
  const startDate = jobs.length
    ? jobs.reduce((acc, item) => {
        return isBefore(new Date(acc), new Date(item.started_at))
          ? acc
          : item.started_at
      }, jobs[0].started_at)
    : ''

  const completedDate = jobs.length
    ? jobs.reduce((acc, item) => {
        return isAfter(new Date(acc), new Date(item.completed_at))
          ? acc
          : item.completed_at
      }, jobs[0].completed_at)
    : ''
  return {
    elapsedTime:
      completedDate && startDate
        ? useDateDifference(startDate, completedDate)
        : '',
    startDate,
    completedDate,
  }
}
