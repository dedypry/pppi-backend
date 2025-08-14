import * as dayjs from 'dayjs';

export function customFormat(date: any, format = 'DDMMYYYY') {
  try {
    if (!date) return '-';
    return dayjs(date).format(format);
  } catch (error) {
    console.error('err', error, date);
    return date;
  }
}
export function formatDate(date: any, format = 'DD MMMM YYYY') {
  try {
    if (!date) return '-';
    return dayjs(date).format(format);
  } catch (error) {
    console.error('err', error, date);
    return date;
  }
}
export function toIsoString(date: any) {
  try {
    if (!date) return '-';
    return dayjs(date).toISOString();
  } catch (error) {
    console.error('err', error, date);
    return null;
  }
}

export function getYear(date: any) {
  try {
    if (!date) return '-';
    return dayjs(date).format('YY');
  } catch (error) {
    console.error('err', error, date);
    return date;
  }
}
