import { Commit, CommitData } from './project-dashboard'

export const useCommitData = () => {
  const getLastCommit = (commitData?: CommitData) => {
    return commitData ? commitData.commits[0] : null
  }

  const getLastSuccessfulCommit = (commitData?: CommitData) => {
    return commitData?.commits.reduce((acc, item) => {
      if (acc) {
        return acc
      }
      return item.conclusion === 'success' ? item : undefined
    }, undefined as Commit | undefined)
  }

  return {
    getLastCommit,
    getLastSuccessfulCommit
  }
}
