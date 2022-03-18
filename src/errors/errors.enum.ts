enum ERROR_CODE {
  FAILED_TO_WRITE_CSV = 'FAILED_TO_WRITE_CSV',
  FAILED_TO_WRITE_TXT = 'FAILED_TO_WRITE_TXT',
  INVALID_EXTENSION = 'INVALID_EXTENSION',
  DIRTY_DATA = 'DIRTY_DATA',
  EMPTY_RECORDS = 'EMPTY_RECORDS',
  FAILED_TO_GET_BANK_RECORDS = 'FAILED_TO_GET_BANK_RECORDS',
  FAILED_TO_GET_USER_RECORDS = 'FAILED_TO_GET_USER_RECORDS',
  FAILED_TO_WRITE_STATEMENT = 'FAILED_TO_WRITE_STATEMENT',
  FAILED_TO_WRITE_SUMMARY = 'FAILED_TO_WRITE_SUMMARY'
}

const errorsList = {
  [ERROR_CODE.FAILED_TO_WRITE_CSV]: {
    message: 'Failed to write csv file'
  },
  [ERROR_CODE.FAILED_TO_WRITE_TXT]: {
    message: 'Failed to write text file'
  },
  [ERROR_CODE.INVALID_EXTENSION]: {
    message: 'Invalid file extension'
  },
  [ERROR_CODE.DIRTY_DATA]: {
    message: 'Getting dirty data'
  },
  [ERROR_CODE.EMPTY_RECORDS]: {
    message: 'No bank & user record in this month'
  },
  [ERROR_CODE.FAILED_TO_GET_BANK_RECORDS]: {
    message: 'Failed to get bank records'
  },
  [ERROR_CODE.FAILED_TO_GET_USER_RECORDS]: {
    message: 'Failed to get user records'
  },
  [ERROR_CODE.FAILED_TO_WRITE_STATEMENT]: {
    message: 'Failed to write report statement'
  },
  [ERROR_CODE.FAILED_TO_WRITE_SUMMARY]: {
    message: 'Failed to write report summary'
  }
};

export { ERROR_CODE, errorsList };
