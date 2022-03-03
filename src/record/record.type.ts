import { recordFormat, writeFormat, RECORD_CODE } from './record.enum';

export interface IBasicRecord {
  id: string;
  description: string;
  amount: number;
  date: string;
}

export interface IBankRecord extends IBasicRecord {}

export interface IProxyRecord extends IBasicRecord {}

export interface IUnreconciledRecord extends IBasicRecord {
  remarks: string;
  discrepancyCode: RECORD_CODE;
}

export interface IMismatchedRecords {
  fromBank: IBankRecord[];
  fromProxy: IProxyRecord[];
}

export interface IWriteHeader {
  id: recordFormat;
  title: writeFormat;
}

export interface IDateRange {
  from: Date;
  to: Date;
}
