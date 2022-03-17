import { format, formatDistance, differenceInMinutes } from 'date-fns'

export const useDate = (date?: string, prefix = ''): string => {
  return date
    ? `${prefix} ${format(new Date(date), `yyyy-MM-dd HH:mm:ss`)}`
    : ''
}

type Config = { defaultMessage?: string; prefix?: string }

const defaultConfig: Config = {
  defaultMessage: '',
  prefix: '',
}

export const useRelativeDate = (
  date?: string,
  config: Config = defaultConfig
): string | undefined => {
  return date
    ? `${config.prefix}${formatDistance(new Date(), new Date(date))} ago`
    : config.defaultMessage
}

export const useDateDifference = (fromDate?: string, toDate?: string) => {
  if (!fromDate || !toDate) {
    return 'N/A'
  }
  return differenceInMinutes(new Date(toDate), new Date(fromDate))
}

export const useElapsedTime = ({
  started_at,
  completed_at,
}: {
  started_at: string
  completed_at: string
}) => {
  if (!started_at || !completed_at) {
    return 'N/A'
  }
  return differenceInMinutes(new Date(completed_at), new Date(started_at))
}
