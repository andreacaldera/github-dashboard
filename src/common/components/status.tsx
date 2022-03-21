import { Done, Error, Cancel } from '@mui/icons-material'
import { FC } from 'react'

export const Status: FC<{ conclusion: string }> = ({ conclusion }) => {
  if (conclusion === 'success') {
    return (
      <div title={conclusion}>
        <Done color="success" />
      </div>
    )
  }
  if (conclusion === 'failure') {
    return (
      <div title={conclusion}>
        <Error color="error" />
      </div>
    )
  }
  if (conclusion === 'cancelled') {
    return (
      <div title={conclusion}>
        <Cancel color="warning" />
      </div>
    )
  }
  return <>{conclusion}</>
}
