import { Link } from '@material-ui/core'
import React from 'react'
import { Commit } from './project-dashboard'
import { useDate } from './use-date'

type Props = {
  lastUpdated: string
  lastSuccessfulCommit?: Commit
}

export const ProjectSubheader: React.FC<Props> = ({
  lastUpdated,
  lastSuccessfulCommit
}) => {
  return (
    <>
      {lastUpdated}; last deployment to production:{' '}
      <Link
        color="textPrimary"
        href={lastSuccessfulCommit?.commit.html_url}
        target={`commit-url-${lastSuccessfulCommit?.head_sha}`}
      >
        {lastSuccessfulCommit?.head_sha} by{' '}
        {lastSuccessfulCommit?.commit.commit.author.name} at{' '}
        {useDate(lastSuccessfulCommit?.completed_at)}
      </Link>
    </>
  )
}
