import { IDateRange, IUnreconciledRecord, IBasicRecord } from './record.type';
import { readFormat, recordFormat, RECORD_CODE } from './record.enum';

const mapHeaders = (header: string) => {
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
  return `date: ${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()} \nprocessed source data: ${processedSource} \ndicrepansies: ${
    unReconsiledRecords.length
  } records with errors ${getErrors(unReconsiledRecords)}`;
};

const getErrors = (records: IUnreconciledRecord[]) => {
  let errorString: string = '';
  records.forEach(record => {
    errorString += `\n - ${RECORD_CODE[record.discrepancyCode]}`;
  });
  return errorString;
};

const recordUtil = {
  mapHeaders,
  getDateRange,
  getText
};

export default recordUtil;