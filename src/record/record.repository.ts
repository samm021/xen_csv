import fs from 'fs';
import * as path from 'path';

import csv from 'csv-parser';
import * as write from 'csv-writer';
import { ObjectStringifierHeader } from 'csv-writer/src/lib/record';

import { IBasicRecord, IDateRange, IUnreconciledRecord } from './record.type';
import recordUtil from './record.util';

const getFilePath = (pathName: string): string => {
  const dirname = __dirname
    .replace('/src/record', '')
    .replace('/dist/record', '');
  path;

  return path.resolve(dirname, pathName);
};

const getCSVFileContents = (fileNamePath: string): Promise<IBasicRecord[]> => {
  const fileExtension: string | undefined = fileNamePath.split('.').pop();
  if (fileExtension !== 'csv') {
    throw new Error('Invalid file extension');
  }
  const results: IBasicRecord[] = [];

  return new Promise((resolve, reject) => {
    const readStream: fs.ReadStream = fs.createReadStream(fileNamePath);
    readStream.on('error', e => reject(e));
    readStream
      .pipe(
        csv({
          mapHeaders: ({ header }) => recordUtil.mapHeaders(header)
        })
      )
      .on('data', data => {
        const record = data as IBasicRecord;
        if (!recordUtil.validateData(record)) {
          reject('> Getting dirty data...');
        }
        record.amount = Number(record.amount);
        results.push(record);
      })
      .on('end', () => resolve(results));
  });
};

const writeCSVFileContents = (
  data: any,
  header: ObjectStringifierHeader,
  path: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    write
      .createObjectCsvWriter({
        path,
        header
      })
      .writeRecords(data)
      .then(() => resolve())
      .catch(e => reject(e));
  });
};

const writeTextFileContents = (
  fileNamePath: string,
  dateRange: IDateRange,
  processedSource: number,
  unReconciledRecords: IUnreconciledRecord[]
): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      fileNamePath,
      recordUtil.getText(dateRange, processedSource, unReconciledRecords),
      e => {
        if (e) {
          reject(e);
          return;
        }
        resolve();
      }
    );
  });
};

const recordRepository = {
  getFilePath,
  getCSVFileContents,
  writeCSVFileContents,
  writeTextFileContents
};

export default recordRepository;
