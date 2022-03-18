import fs from 'fs';

import csv from 'csv-parser';
import * as write from 'csv-writer';
import { ObjectStringifierHeader } from 'csv-writer/src/lib/record';
import { ERROR_CODE } from '../errors/errors.enum';

const getCSVFileContents = async (
  fileNamePath: string,
  mapHeaders: (header: string) => string,
  validator: (data: any) => any | undefined
): Promise<any[]> => {
  const fileExtension: string | undefined = fileNamePath.split('.').pop();
  if (fileExtension !== 'csv') {
    throw new Error(ERROR_CODE.INVALID_EXTENSION);
  }
  const results: any[] = [];
  return new Promise((resolve, reject) => {
    const readStream: fs.ReadStream = fs.createReadStream(fileNamePath);
    readStream.on('error', e => reject(e));
    readStream
      .pipe(
        csv({
          mapHeaders: ({ header }) => mapHeaders(header)
        })
      )
      .on('data', data => {
        const validatedData = validator(data);
        if (!validatedData) {
          reject(new Error(ERROR_CODE.DIRTY_DATA));
        }
        results.push(validatedData);
      })
      .on('end', () => resolve(results));
  });
};

const writeCSVFileContents = async (
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
      .catch(e => {
        console.error(e);
        reject(new Error(ERROR_CODE.FAILED_TO_WRITE_CSV));
      });
  });
};

const csvRepository = {
  getCSVFileContents,
  writeCSVFileContents
};

export default csvRepository;
