import { TableCell } from '@mui/material'
import { Scores } from './lighthouse-type'
import { TrendIndicator } from './trend-indicator'

const getColour = (score: number): string => {
  if (score > 90) {
    return 'green'
  }
  if (score > 60) {
    return 'orange'
  }

  return 'red'
}

export const LighthouseScore = ({
  data,
  previousData,
}: {
  data: Scores
  previousData?: Scores
}) => {
  return (
    <TableCell align="left">
      <img
        src={`https://img.shields.io/badge/Accessibility-${
          data.accessibility
        }-${getColour(data.accessibility)}?style=flat-square`}
      />
      <TrendIndicator
        score={data.accessibility}
        previousScore={previousData?.accessibility}
      />
      <img
        src={`https://img.shields.io/badge/Performance-${
          data.performance
        }-${getColour(data.performance)}?style=flat-square`}
      />
      <TrendIndicator
        score={data.performance}
        previousScore={previousData?.performance}
      />
      <img
        src={`https://img.shields.io/badge/SEO-${data.seo}-${getColour(
          data.seo
        )}?style=flat-square`}
      />
      <TrendIndicator score={data.seo} previousScore={previousData?.seo} />
      <img
        src={`https://img.shields.io/badge/Best%20Practices-${
          data.bestPractices
        }-${getColour(data.bestPractices)}?style=flat-square`}
      />
      <TrendIndicator
        score={data.bestPractices}
        previousScore={previousData?.bestPractices}
      />
    </TableCell>
  )
}
