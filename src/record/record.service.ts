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
  IMismatchedRecords,
  month
} from './record.type';
import { RECORD_CODE } from './record.enum';
import recordUtil from './record.util';

const getData = async (path: string, month: month): Promise<IBasicRecord[]> => {
  const fileContents = await recordRepository.getCSVFileContents(path);
  return recordUtil.filteredContentsByMonth(fileContents, month);
};

const getBankRecords = async (month: month): Promise<IBankRecord[]> => {
  try {
    const sourceFilePath = recordRepository.getFilePath(sourcePath);
    return getData(sourceFilePath, month);
  } catch (e) {
    console.error(e);
    throw new Error('Failed to get bank records');
  }
};

const getProxyRecords = async (month: month): Promise<IProxyRecord[]> => {
  try {
    const proxyFilePath = recordRepository.getFilePath(proxyPath);
    return getData(proxyFilePath, month);
  } catch (e) {
    console.error(e);
    throw new Error('Failed to get proxy records');
  }
};

const getBankProxyRecords = async (
  month: month
): Promise<[IBankRecord[], IProxyRecord[]]> => {
  console.info('> Getting source & proxy records...');
  return await Promise.all([getBankRecords(month), getProxyRecords(month)]);
};

const getMismatchedRecords = (
  bankStatement: IBankRecord[],
  userStatement: IProxyRecord[]
): IMismatchedRecords => {
  console.info('> Getting mismatched records...');
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
  const mismatchedRecords = {
    fromBank: rightUniqueEntries,
    fromProxy: leftUniqueEntries
  };
  if (
    _.isEmpty(mismatchedRecords.fromBank) &&
    _.isEmpty(mismatchedRecords.fromProxy)
  ) {
    console.info('> Source & proxy records has no mismatched record');
  }
  return mismatchedRecords;
};

const getUnreconciledRecords = (
  mismatchedRecords: IMismatchedRecords
): IUnreconciledRecord[] => {
  console.info('> Calculating mismatched records...');
  let unreconciledRecords: IUnreconciledRecord[] = [];
  const validator =
    mismatchedRecords.fromProxy.length >= mismatchedRecords.fromBank.length;
  const iterator: IBasicRecord[] = validator
    ? mismatchedRecords.fromProxy
    : mismatchedRecords.fromBank;
  const filter: IBasicRecord[] = validator
    ? mismatchedRecords.fromBank
    : mismatchedRecords.fromProxy;

  iterator.forEach(proxyRecord => {
    const bankRecord = filter.filter(
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
    console.info('> Failed to map unreconciled records');
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

const writeReports = async (
  bankRecords: IBankRecord[],
  proxyRecords: IProxyRecord[],
  unreconciledRecords: IUnreconciledRecord[],
  mismatchedRecords: IMismatchedRecords
) => {
  console.info('> Writing report & summary...');
  return Promise.all([
    writeReportStatement(unreconciledRecords),
    writeReportSummary(
      bankRecords,
      proxyRecords,
      unreconciledRecords,
      mismatchedRecords
    )
  ]);
};

const recordService = {
  getBankProxyRecords,
  getMismatchedRecords,
  getUnreconciledRecords,
  writeReports
};

export default recordService;
