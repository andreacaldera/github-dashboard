import { format } from 'date-fns'

export const useDate = (date?: string, prefix = ''): string => {
  return date
    ? `${prefix} ${format(new Date(date), `yyyy-MM-dd HH:mm:ss`)}`
    : ''
}
