import { formatDate } from 'utils/helpers/date-format';
import { formatNia } from 'utils/services/user.service';

export const fnHandlebar = {
  date: (date: string) => {
    return formatDate(date);
  },
  upper: (val: string) => {
    return val.toUpperCase();
  },
  formatNia: (val: string) => {
    return formatNia(val);
  },
};
