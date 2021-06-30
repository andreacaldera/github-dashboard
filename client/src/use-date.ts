import { format, formatDistance } from 'date-fns'

export const useDate = (date?: string, prefix = ''): string => {
  return date
    ? `${prefix} ${format(new Date(date), `yyyy-MM-dd HH:mm:ss`)}`
    : ''
}

export const useRelativeDate = (date?: string): string => {
  return date ? formatDistance(new Date(), new Date(date)) : ''
}
