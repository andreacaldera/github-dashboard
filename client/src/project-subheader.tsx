import { Link } from '@material-ui/core'
import React from 'react'
import { ProjectCommit } from './project-status'
import { useRelativeDate } from './use-date'

type Props = {
  lastSuccessfulCommit?: ProjectCommit
}

export const ProjectSubheader: React.FC<Props> = ({ lastSuccessfulCommit }) => {
  return (
    <>
      Production code:{' '}
      <Link
        href={lastSuccessfulCommit?.htmlUrl}
        target={`commit-url-${lastSuccessfulCommit?.headSha}`}
      >
        {lastSuccessfulCommit?.commitMessage.substring(0, 50)}
      </Link>{' '}
      by{' '}
      <Link
        href={lastSuccessfulCommit?.author.htmlUrl}
        target={lastSuccessfulCommit?.author.htmlUrl}
      >
        {lastSuccessfulCommit?.author.name}
      </Link>{' '}
      {useRelativeDate(lastSuccessfulCommit?.completed_at)} ago
    </>
  )
}
