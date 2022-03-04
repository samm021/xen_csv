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
import { RECORD_CODE } from './record.enum';
import recordUtil from './record.util';

const getData = async (
  path: string,
  month: number
): Promise<IBasicRecord[]> => {
  const fileContents = await recordRepository.getCSVFileContents(path);
  return recordUtil.filteredContentsByMonth(fileContents, month);
};

const getBankRecords = async (month: number): Promise<IBankRecord[]> => {
  try {
    const sourceFilePath = recordRepository.getFilePath(sourcePath);
    return getData(sourceFilePath, month);
  } catch (e) {
    console.error(e);
    throw new Error('Failed to get bank records');
  }
};

const getProxyRecords = async (month: number): Promise<IProxyRecord[]> => {
  try {
    const proxyFilePath = recordRepository.getFilePath(proxyPath);
    return getData(proxyFilePath, month);
  } catch (e) {
    console.error(e);
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
  let unreconciledRecords: IUnreconciledRecord[] = [];

  mismatchedRecords.fromProxy.forEach(proxyRecord => {
    const bankRecord = mismatchedRecords.fromBank.filter(
      bankRecord => bankRecord.id == proxyRecord.id
    )[0];
    if (!bankRecord) {
      unreconciledRecords = recordUtil.mapDiscrepansiesErrors(
        unreconciledRecords,
        proxyRecord,
        RECORD_CODE.ID_NOT_FOUND
      );
      return;
    }
    if (
      bankRecord.id == proxyRecord.id &&
      bankRecord.amount != proxyRecord.amount
    ) {
      unreconciledRecords = recordUtil.mapDiscrepansiesErrors(
        unreconciledRecords,
        proxyRecord,
        RECORD_CODE.AMOUNT_NOT_MATCHED
      );
    }
    if (
      bankRecord.id == proxyRecord.id &&
      bankRecord.date != proxyRecord.date
    ) {
      unreconciledRecords = recordUtil.mapDiscrepansiesErrors(
        unreconciledRecords,
        proxyRecord,
        RECORD_CODE.DATE_NOT_MATCHED
      );
    }
    if (
      bankRecord.id == proxyRecord.id &&
      bankRecord.description != proxyRecord.description
    ) {
      unreconciledRecords = recordUtil.mapDiscrepansiesErrors(
        unreconciledRecords,
        proxyRecord,
        RECORD_CODE.DESCRIPTION_NOT_MATCHED
      );
    }
  });
  if (_.isEmpty(unreconciledRecords)) {
    throw new Error('Failed to map unreconciled records');
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
    console.error(e);
    throw new Error('Failed to write report statement');
  }
};

const writeReportSummary = async (
  bankRecords: IBankRecord[],
  proxyRecords: IProxyRecord[],
  unReconsiledRecords: IUnreconciledRecord[],
  mismatchedRecords: IMismatchedRecords
): Promise<void> => {
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
    console.error(e);
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
