import { recordFormat, writeFormat } from './record.enum';

export const dataPath = 'data/';
export const reportPath = 'report.csv';
export const summaryPath = 'summary.txt';
export const distDir = '/dist/record';
export const srcDir = '/src/record';
export const done = '> Done processing data!';
export const notFound = '> No user & bank records found in month';

export const writeHeaders = [
  { id: recordFormat.amount, title: writeFormat.Amt },
  { id: recordFormat.description, title: writeFormat.Descr },
  { id: recordFormat.date, title: writeFormat.Date },
  { id: recordFormat.id, title: writeFormat.ID },
  { id: recordFormat.remarks, title: writeFormat.Remarks }
];
