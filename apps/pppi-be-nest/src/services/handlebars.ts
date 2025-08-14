import { formatDate } from 'utils/helpers/date-format';

export const fnHandlebar = {
  date: (date: string) => {
    return formatDate(date);
  },
  upper: (val: string) => {
    return val.toUpperCase();
  },
};
