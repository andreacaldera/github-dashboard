import { Link } from '@material-ui/core'
import React from 'react'
import { Commit } from './project-dashboard'
import { useRelativeDate } from './use-date'

type Props = {
  lastSuccessfulCommit?: Commit
}

export const ProjectSubheader: React.FC<Props> = ({ lastSuccessfulCommit }) => {
  return (
    <>
      Production code:{' '}
      <Link
        href={lastSuccessfulCommit?.commit.html_url}
        target={`commit-url-${lastSuccessfulCommit?.head_sha}`}
      >
        {lastSuccessfulCommit?.commit.commit.message.substring(0, 50)}
      </Link>{' '}
      by{' '}
      <Link
        href={lastSuccessfulCommit?.commit.author.html_url}
        target={lastSuccessfulCommit?.commit.author.html_url}
      >
        {lastSuccessfulCommit?.commit.commit.author.name}
      </Link>{' '}
      {useRelativeDate(lastSuccessfulCommit?.completed_at)} ago
    </>
  )
}
