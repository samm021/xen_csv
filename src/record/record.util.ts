import _ from 'lodash';
import * as path from 'path';
import {
  IDateRange,
  IUnreconciledRecord,
  IBasicRecord,
  IUserRecord,
  month,
  IErrorMapping,
  IMismatchedRecords,
  IBankRecord
} from './record.type';
import { readFormat, recordFormat, RECORD_CODE } from './record.enum';
import { RecordDiscrepanciesList } from './record.error';
import { srcDir, distDir } from './record.constants';

const getFilePath = (fileName: string): string => {
  const dirname = __dirname.replace(srcDir, '').replace(distDir, '');
  return path.resolve(dirname, `data/${fileName}`);
};

const validateData = (data: IBasicRecord): IBasicRecord | undefined => {
  if (
    data.id &&
    data.amount &&
    data.description &&
    data.date &&
    !isNaN(data.amount) &&
    Date.parse(data.date)
  ) {
    data.amount = Number(data.amount);
    return data;
  }
  return;
};

const mapHeaders = (header: string): string => {
  header.trim();
  const lowerCaseHeader = header.toLowerCase();
  switch (true) {
    case lowerCaseHeader.includes(readFormat.am):
      return recordFormat.amount;
    case lowerCaseHeader.includes(readFormat.descr):
      return recordFormat.description;
    case lowerCaseHeader.includes(readFormat.date):
      return recordFormat.date;
    case lowerCaseHeader.includes(readFormat.id):
      return recordFormat.id;
    default:
      return header;
  }
};

const getMismatchedRecords = (
  bankStatement: IBankRecord[],
  userStatement: IUserRecord[]
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
    fromUser: leftUniqueEntries
  };
};

const mapDiscrepansiesErrors = (
  records: IUnreconciledRecord[],
  userRecord: IUserRecord,
  code: RECORD_CODE
) => {
  records.push({
    ...userRecord,
    discrepancyCode: code,
    remarks: RecordDiscrepanciesList[code].message
  });
  return records;
};

const mapUserIdDiscrepancies = (
  mismatchUserRecords: IUserRecord[],
  mismatchBankRecords: IBankRecord[]
) => {
  let unreconciledRecords: IUnreconciledRecord[] = [];
  const mismatchIdsUser = mismatchUserRecords.filter(
    userRecord =>
      !mismatchBankRecords.some(bankRecord => userRecord.id == bankRecord.id)
  );
  if (!_.isEmpty(mismatchIdsUser)) {
    mismatchIdsUser.map(userRecord => {
      unreconciledRecords = mapDiscrepansiesErrors(
        unreconciledRecords,
        userRecord,
        RECORD_CODE.ID_NOT_FOUND_IN_BANK
      );
    });
  }
  return unreconciledRecords;
};

const mapBankIdDiscrepancies = (
  mismatchUserRecords: IUserRecord[],
  mismatchBankRecords: IBankRecord[]
) => {
  let unreconciledRecords: IUnreconciledRecord[] = [];
  const mismatchIdsBank = mismatchBankRecords.filter(
    userRecord =>
      !mismatchUserRecords.some(bankRecord => userRecord.id == bankRecord.id)
  );
  if (!_.isEmpty(mismatchIdsBank)) {
    mismatchIdsBank.map(bankRecord => {
      unreconciledRecords = mapDiscrepansiesErrors(
        unreconciledRecords,
        bankRecord,
        RECORD_CODE.ID_NOT_FOUND_IN_USER
      );
    });
  }
  return unreconciledRecords;
};

const mapIdDiscrepancies = (
  mismatchUserRecords: IUserRecord[],
  mismatchBankRecords: IBankRecord[]
) => {
  const userIdDiscrepancies = mapUserIdDiscrepancies(
    mismatchUserRecords,
    mismatchBankRecords
  );
  const bankIdDiscrepancies = mapBankIdDiscrepancies(
    mismatchUserRecords,
    mismatchBankRecords
  );
  return [...userIdDiscrepancies, ...bankIdDiscrepancies];
};

const mapOtherDiscrepancies = (
  mismatchUserRecords: IUserRecord[],
  mismatchBankRecords: IBankRecord[]
) => {
  let unreconciledRecords: IUnreconciledRecord[] = [];
  mismatchUserRecords.forEach(userRecord => {
    const bankRecord = mismatchBankRecords.filter(
      bankRecord => bankRecord.id == userRecord.id
    )[0];
    if (!bankRecord) {
      return;
    }
    if (bankRecord.id == userRecord.id) {
      if (bankRecord.amount != userRecord.amount) {
        unreconciledRecords = mapDiscrepansiesErrors(
          unreconciledRecords,
          userRecord,
          RECORD_CODE.AMOUNT_NOT_MATCHED
        );
      }
      if (bankRecord.date != userRecord.date) {
        unreconciledRecords = mapDiscrepansiesErrors(
          unreconciledRecords,
          userRecord,
          RECORD_CODE.DATE_NOT_MATCHED
        );
      }
      if (bankRecord.description != userRecord.description) {
        unreconciledRecords = mapDiscrepansiesErrors(
          unreconciledRecords,
          userRecord,
          RECORD_CODE.DESCRIPTION_NOT_MATCHED
        );
      }
    }
  });
  return unreconciledRecords;
};

const getUnreconciledRecords = (
  mismatchedRecords: IMismatchedRecords
): IUnreconciledRecord[] => {
  let unreconciledRecords: IUnreconciledRecord[] = [];

  if (
    _.isEmpty(mismatchedRecords.fromBank) &&
    _.isEmpty(mismatchedRecords.fromUser)
  ) {
    return unreconciledRecords;
  }

  unreconciledRecords.push(
    ...mapIdDiscrepancies(
      mismatchedRecords.fromUser,
      mismatchedRecords.fromBank
    )
  );
  unreconciledRecords.push(
    ...mapOtherDiscrepancies(
      mismatchedRecords.fromUser,
      mismatchedRecords.fromBank
    )
  );
  return unreconciledRecords;
};

const filteredContentsByMonth = (
  records: IBasicRecord[],
  month: month
): IBasicRecord[] => {
  return records.filter(
    record => new Date(record.date).getMonth() === month - 1
  );
};

const getDateRange = (records: IBasicRecord[]): IDateRange => {
  const dates: Date[] = [];
  records.forEach(record => {
    dates.push(new Date(record.date));
  });
  dates.sort((a, b) => a.getTime() - b.getTime());
  return {
    from: dates[0],
    to: dates[dates.length - 1]
  };
};

const getText = (
  dateRange: IDateRange,
  processedSource: number,
  unReconsiledRecords: IUnreconciledRecord[]
): string => {
  const summaryText = `date: ${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()} 
  \nprocessed source data: ${processedSource} 
  \ndicrepansies: ${unReconsiledRecords.length} discrepancies`;
  if (_.isEmpty(unReconsiledRecords)) {
    return summaryText;
  }
  return `${summaryText} ${getErrors(unReconsiledRecords)}`;
};

const getErrors = (records: IUnreconciledRecord[]) => {
  let errorString: string = '';

  const mappedRecords: IErrorMapping[] = _(records)
    .groupBy('discrepancyCode')
    .map(
      (v, k) =>
        ({
          discrepancyCode: k,
          amount: v.length,
          ids: [...v.map(data => data.id)]
        } as IErrorMapping)
    )
    .value();

  mappedRecords.forEach(record => {
    errorString += `\n - ${record.amount} ${
      RecordDiscrepanciesList[record.discrepancyCode].message
    } \n\t - ${record.ids.join('\n\t - ')}`;
  });

  return errorString;
};

const recordUtil = {
  getFilePath,
  validateData,
  mapHeaders,
  getMismatchedRecords,
  getUnreconciledRecords,
  filteredContentsByMonth,
  getDateRange,
  getText
};

export default recordUtil;
