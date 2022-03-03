import _ from 'lodash';

import recordRepository from './record.repository';
import {
  sourcePath,
  proxyPath,
  writeHeaders,
  reportPath,
  summaryPath
} from './record.constants';
import {
  IBasicRecord,
  IBankRecord,
  IProxyRecord,
  IUnreconciledRecord,
  IMismatchedRecords
} from './record.type';
import { RecordDiscrepanciesList } from './record.error';
import { RECORD_CODE } from './record.enum';
import recordUtil from './record.util';

const getData = async (path: string): Promise<IBasicRecord[]> => {
  const fileContents = await recordRepository.getCSVFileContents(path);
  return fileContents;
};

const getBankRecords = async (): Promise<IBankRecord[]> => {
  try {
    const sourceFilePath = recordRepository.getFilePath(sourcePath);
    return getData(sourceFilePath);
  } catch (e) {
    console.log(e);
    throw new Error('Failed to get bank records');
  }
};

const getProxyRecords = async (): Promise<IProxyRecord[]> => {
  try {
    const proxyFilePath = recordRepository.getFilePath(proxyPath);
    return getData(proxyFilePath);
  } catch (e) {
    console.log(e);
    throw new Error('Failed to get proxy records');
  }
};

const getMismatchedRecords = (
  bankStatement: IBankRecord[],
  userStatement: IProxyRecord[]
): IMismatchedRecords => {
  const rightUniqueEntries = _.differenceWith(
    bankStatement,
    userStatement,
    _.isEqual
  );
  const leftUniqueEntries = _.differenceWith(
    userStatement,
    bankStatement,
    _.isEqual
  );
  return {
    fromBank: rightUniqueEntries,
    fromProxy: leftUniqueEntries
  };
};

const getUnreconciledRecords = (
  mismatchedRecords: IMismatchedRecords
): IUnreconciledRecord[] => {
  const unreconciledRecords: IUnreconciledRecord[] = [];

  mismatchedRecords.fromProxy.forEach(proxyRecord => {
    const bankRecord = mismatchedRecords.fromBank.filter(
      bankRecord => bankRecord.id == proxyRecord.id
    )[0];
    if (!bankRecord) {
      unreconciledRecords.push({
        ...proxyRecord,
        discrepancyCode: RECORD_CODE.ID_NOT_FOUND,
        remarks: RecordDiscrepanciesList[RECORD_CODE.ID_NOT_FOUND].message
      });
      return;
    }
    if (
      bankRecord.id == proxyRecord.id &&
      bankRecord.amount != proxyRecord.amount
    ) {
      unreconciledRecords.push({
        ...proxyRecord,
        discrepancyCode: RECORD_CODE.AMOUNT_NOT_MATCHED,
        remarks: RecordDiscrepanciesList[RECORD_CODE.AMOUNT_NOT_MATCHED].message
      });
    }
    if (
      bankRecord.id == proxyRecord.id &&
      bankRecord.date != proxyRecord.date
    ) {
      unreconciledRecords.push({
        ...proxyRecord,
        discrepancyCode: RECORD_CODE.DATE_NOT_MATCHED,
        remarks: RecordDiscrepanciesList[RECORD_CODE.DATE_NOT_MATCHED].message
      });
    }
    if (
      bankRecord.id == proxyRecord.id &&
      bankRecord.description != proxyRecord.description
    ) {
      unreconciledRecords.push({
        ...proxyRecord,
        discrepancyCode: RECORD_CODE.DESCRIPTION_NOT_MATCHED,
        remarks:
          RecordDiscrepanciesList[RECORD_CODE.DESCRIPTION_NOT_MATCHED].message
      });
    }
  });
  if (unreconciledRecords.length === 0) {
    throw new Error('Failed to get unreconciled records');
  }
  return unreconciledRecords;
};

const writeReportStatement = async (
  records: IUnreconciledRecord[]
): Promise<void> => {
  try {
    const reportFilePath = recordRepository.getFilePath(reportPath);
    await recordRepository.writeCSVFileContents(
      records,
      writeHeaders,
      reportFilePath
    );
  } catch (e) {
    console.log(e);
    throw new Error('Failed to write report statement');
  }
};

const writeReportSummary = async (
  bankRecords: IBankRecord[],
  proxyRecords: IProxyRecord[],
  unReconsiledRecords: IUnreconciledRecord[],
  mismatchedRecords: IMismatchedRecords
) => {
  try {
    const dateRange = recordUtil.getDateRange([
      ...bankRecords,
      ...proxyRecords
    ]);
    const numberSourceProcessed =
      bankRecords.length - mismatchedRecords.fromBank.length;
    const summaryFilepath = recordRepository.getFilePath(summaryPath);
    await recordRepository.writeTextFileContents(
      summaryFilepath,
      dateRange,
      numberSourceProcessed,
      unReconsiledRecords
    );
  } catch (e) {
    console.log(e);
    throw new Error('Failed to write report summary');
  }
};

const recordService = {
  getBankRecords,
  getProxyRecords,
  getMismatchedRecords,
  getUnreconciledRecords,
  writeReportStatement,
  writeReportSummary
};

export default recordService;
