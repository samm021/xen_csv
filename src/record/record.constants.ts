import { recordFormat, writeFormat } from './record.enum';

export const sourcePath = 'data/source.csv';

export const proxyPath = 'data/proxy.csv';

export const reportPath = 'data/report.csv';

export const summaryPath = 'data/summary.txt';

export const writeHeaders = [
  { id: recordFormat.amount, title: writeFormat.Amt },
  { id: recordFormat.description, title: writeFormat.Descr },
  { id: recordFormat.date, title: writeFormat.Date },
  { id: recordFormat.id, title: writeFormat.ID },
  { id: recordFormat.remarks, title: writeFormat.Remarks }
];

export const distDir = '/dist/record';
export const srcDir = '/src/record';
