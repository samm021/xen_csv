import { RECORD_CODE } from './record.enum';

const RecordDiscrepanciesList = {
  [RECORD_CODE.ID_NOT_FOUND_IN_USER]: {
    message: 'ID not found in user statement'
  },
  [RECORD_CODE.ID_NOT_FOUND_IN_BANK]: {
    message: 'ID not found in bank statement'
  },
  [RECORD_CODE.AMOUNT_NOT_MATCHED]: {
    message: 'Amount not matched with bank statement record'
  },
  [RECORD_CODE.DATE_NOT_MATCHED]: {
    message: 'Date not matched with bank statement record'
  },
  [RECORD_CODE.DESCRIPTION_NOT_MATCHED]: {
    message: 'Description not matched with bank statement record'
  }
};

export { RecordDiscrepanciesList };
