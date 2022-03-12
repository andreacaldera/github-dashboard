import styled from '@emotion/styled'
import { TableRow } from '@mui/material'

export const StatusRow = styled(TableRow)<{
  conclusion: 'success' | 'failure' | 'skipped'
  runningStatus?: string
}>`
  ${({ conclusion, runningStatus }) => {
    if (runningStatus === 'completed') {
      return conclusion === 'success'
        ? `background: #4caf50;`
        : `background: #f44336;`
    }
  }}
`
