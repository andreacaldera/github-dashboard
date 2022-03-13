import { format, formatDistance } from 'date-fns'

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
): string => {
  return date
    ? `${config.prefix}${formatDistance(new Date(), new Date(date))} ago`
    : config.defaultMessage
}
