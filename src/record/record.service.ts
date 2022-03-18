import _ from 'lodash';
import { writeHeaders, reportPath, summaryPath } from './record.constants';
import {
  IBasicRecord,
  IBankRecord,
  IUserRecord,
  IUnreconciledRecord,
  IMismatchedRecords,
  month
} from './record.type';
import recordUtil from './record.util';
import csvRepository from '../csv/csv.repository';
import textRepository from '../text/text.repository';
import { ERROR_CODE } from '../errors/errors.enum';

const getData = async (path: string, month: month): Promise<IBasicRecord[]> => {
  const fileContents = (await csvRepository.getCSVFileContents(
    path,
    recordUtil.mapHeaders,
    recordUtil.validateData
  )) as IBasicRecord[];
  return recordUtil.filteredContentsByMonth(fileContents, month);
};

const getBankRecords = async (
  month: month,
  bankFilename: string
): Promise<IBankRecord[]> => {
  try {
    const sourceFilePath = recordUtil.getFilePath(bankFilename);
    return getData(sourceFilePath, month);
  } catch (e) {
    throw new Error(ERROR_CODE.FAILED_TO_GET_BANK_RECORDS);
  }
};

const getUserRecords = async (
  month: month,
  userFilename: string
): Promise<IUserRecord[]> => {
  try {
    const userFilePath = recordUtil.getFilePath(userFilename);
    return getData(userFilePath, month);
  } catch (e) {
    throw new Error(ERROR_CODE.FAILED_TO_GET_USER_RECORDS);
  }
};

const writeUnreconciledStatement = async (
  records: IUnreconciledRecord[]
): Promise<void> => {
  if (_.isEmpty(records)) {
    return;
  }
  try {
    const reportFilePath = recordUtil.getFilePath(reportPath);
    await csvRepository.writeCSVFileContents(
      records,
      writeHeaders,
      reportFilePath
    );
  } catch (e) {
    throw new Error(ERROR_CODE.FAILED_TO_WRITE_STATEMENT);
  }
};

const writeReportSummary = async (
  bankRecords: IBankRecord[],
  userRecords: IUserRecord[],
  unreconciledRecords: IUnreconciledRecord[],
  mismatchedRecords: IMismatchedRecords
): Promise<void> => {
  if (_.isEmpty(bankRecords) && _.isEmpty(userRecords)) {
    throw new Error(ERROR_CODE.EMPTY_RECORDS);
  }

  try {
    const dateRange = recordUtil.getDateRange([...bankRecords, ...userRecords]);

    const numberSourceProcessed =
      bankRecords.length - mismatchedRecords.fromBank.length;

    const processedText = recordUtil.getText(
      dateRange,
      numberSourceProcessed,
      unreconciledRecords
    );

    const summaryFilepath = recordUtil.getFilePath(summaryPath);
    await textRepository.writeTextFileContents(summaryFilepath, processedText);
  } catch (e) {
    throw new Error(ERROR_CODE.FAILED_TO_WRITE_SUMMARY);
  }
};

const createReportAndSummary = async (
  month: month,
  bankFilename: string,
  userFilename: string
) => {
  const [bankRecords, userRecords] = await Promise.all([
    getBankRecords(month, bankFilename),
    getUserRecords(month, userFilename)
  ]);

  const mismatchedRecords = recordUtil.getMismatchedRecords(
    bankRecords,
    userRecords
  );

  const unreconciledRecords = recordUtil.getUnreconciledRecords(
    mismatchedRecords
  );

  await Promise.all([
    writeUnreconciledStatement(unreconciledRecords),
    writeReportSummary(
      bankRecords,
      userRecords,
      unreconciledRecords,
      mismatchedRecords
    )
  ]);
};

const recordService = {
  createReportAndSummary
};

export default recordService;
