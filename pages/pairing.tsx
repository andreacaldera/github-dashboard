import styled from '@emotion/styled'

import {
  format,
  isMonday,
  isTuesday,
  nextMonday,
  nextWednesday,
} from 'date-fns'
import { useSession } from 'next-auth/react'

const names = [
  'Andrea',
  'Krzysztof',
  'Frank',
  'Dennis',
  'Prabhat',
  'Prince',
  'Farhan',
]

const startDate = new Date(2022, 2, 10)

type PairingList = ReadonlyArray<{ pairs: string[]; date: Date }>

const next = (date: Date) => {
  if (isMonday(date) || isTuesday(date)) {
    return nextWednesday(date)
  }
  return nextMonday(date)
}

const nextPairSwitch = (pairing: PairingList) => {
  if (pairing.length === 0) {
    return next(startDate)
  }
  const lastDate = pairing[pairing.length - 1].date
  return next(lastDate)
}

const indexes = [...new Array(names.length).keys()]
const nameLists = indexes.reduce((acc, index) => {
  return [
    ...acc,
    {
      pairs: [
        ...[...names].splice(index, names.length),
        ...[...names].splice(0, index),
      ],
      date: nextPairSwitch(acc),
    },
  ]
}, [] as PairingList)

const pairs = nameLists.map((n) => {
  return {
    date: n.date,
    pairs: n.pairs.reduce((acc, item, index) => {
      if (index % 2 === 1) {
        return acc
      }
      if (index < n.pairs.length) {
        const p = [item, n.pairs[index + 1]] as [string, string | undefined]
        return [...acc, p]
      }
      return acc
    }, [] as [string, string | undefined][]),
  }
})

const StyledPair = styled.span`
  display: inline-block;
  min-width: 15rem;
  &:not(:first-of-type)::before {
    margin-right: 2rem;
    content: '|';
  }
`

const StyledDate = styled.span`
  display: inline-block;
  min-width: 15rem;
  margin-right: 2rem;
`

const formatDate = (date: Date) => format(date, ' EEE dd/MMM/yyyy')

const Pair = ({
  pairs,
}: {
  pairs: ReadonlyArray<[string, string | undefined]>
}) => {
  return (
    <>
      {pairs.map((pair) => (
        <StyledPair key={pair.join(',')}>
          {pair[0]} - {pair[1] || 'No buddy'}
        </StyledPair>
      ))}
    </>
  )
}

const Pairing = () => {
  const { data: session } = useSession()
  if (!session?.user) {
    return <p>Please login to access this page</p>
  }
  return (
    <>
      <h1>Pairing</h1>
      <p>Starting: {formatDate(startDate)}</p>
      <ul>
        {pairs.map((l) => {
          return (
            <li key={l.toString()}>
              <StyledDate>{formatDate(l.date)}</StyledDate>
              <Pair pairs={l.pairs} />
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default Pairing
