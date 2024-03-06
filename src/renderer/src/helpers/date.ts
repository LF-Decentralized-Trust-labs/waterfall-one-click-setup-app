import dayjs from 'dayjs'

export const getDateTime = (date: string | Date) => dayjs(date).format('YYYY-MM-DD HH:mm')
