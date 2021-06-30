import { Commit, CommitData } from './project-dashboard'

export const useCommitData = (commitData?: CommitData) => {
  const getLastCommit = () => {
    return commitData ? commitData.commits[0] : null
  }

  const getLastSuccessfulCommit = () => {
    return commitData?.commits.reduce((acc, item) => {
      if (acc) {
        return acc
      }
      return item.conclusion === 'success' ? item : undefined
    }, undefined as Commit | undefined)
  }

  const getAverageCommitTime = () => {
    const completedCommits =
      commitData?.commits.filter(
        ({ started_at, completed_at }) => started_at && completed_at
      ) || []
    const totalTime = completedCommits.reduce((acc, item) => {
      const { completed_at, started_at } = item
      const time =
        new Date(completed_at!).getTime() - new Date(started_at!).getTime()
      return acc + time
    }, 0)
    return (totalTime / completedCommits.length / 1000 / 60).toFixed(0)
  }

  return {
    getLastCommit,
    getLastSuccessfulCommit,
    getAverageCommitTime
  }
}
