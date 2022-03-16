import { recordFormat, writeFormat, RECORD_CODE } from './record.enum';

export type month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export interface IBasicRecord {
  id: string;
  description: string;
  amount: number;
  date: string;
}

export interface IBankRecord extends IBasicRecord {}

export interface IUserRecord extends IBasicRecord {}

export interface IUnreconciledRecord extends IBasicRecord {
  remarks: string;
  discrepancyCode: RECORD_CODE;
}

export interface IMismatchedRecords {
  fromBank: IBankRecord[];
  fromUser: IUserRecord[];
}

export interface IWriteHeader {
  id: recordFormat;
  title: writeFormat;
}

export interface IDateRange {
  from: Date;
  to: Date;
}

export interface IErrorMapping {
  discrepancyCode: RECORD_CODE;
  amount: number;
  ids: string[];
}
