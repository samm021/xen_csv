export enum readFormat {
  am = 'am',
  descr = 'descr',
  date = 'date',
  id = 'id'
}

export enum recordFormat {
  amount = 'amount',
  description = 'description',
  date = 'date',
  id = 'id',
  remarks = 'remarks'
}

export enum writeFormat {
  Amt = 'Amt',
  Descr = 'Descr',
  Date = 'Date',
  ID = 'ID',
  Remarks = 'Remarks'
}

export enum RECORD_CODE {
  ID_NOT_FOUND_IN_USER = 'ID_NOT_FOUND_IN_USER',
  ID_NOT_FOUND_IN_BANK = 'ID_NOT_FOUND_IN_BANK',
  AMOUNT_NOT_MATCHED = 'AMOUNT_NOT_MATCHED',
  DATE_NOT_MATCHED = 'DATE_NOT_MATCHED',
  DESCRIPTION_NOT_MATCHED = 'DESCRIPTION_NOT_MATCHED'
}
