import { FC } from 'react'
import { ArrowUpward, ArrowDownward } from '@material-ui/icons'
import { HorizontalRule } from '@mui/icons-material'

export const TrendIndicator: FC<{
  score: number
  previousScore: number
}> = ({ score, previousScore }) => {
  const style = {
    marginRight: '0.5rem',
    height: '1.3rem',
  }
  if (previousScore === undefined || previousScore === score) {
    return <HorizontalRule style={{ ...style }} />
  }
  return previousScore > score ? (
    <ArrowDownward style={{ fill: 'red', ...style }} />
  ) : (
    <ArrowUpward style={{ fill: 'green', ...style }} />
  )
}
