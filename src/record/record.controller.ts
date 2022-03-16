import { month } from './record.type';
import recordService from './record.service';
import { reportError } from '../errors/errors';

const createReportAndSummary = async (
  month: month,
  bankFilename: string,
  userFilename: string
) => {
  try {
    await recordService.createReportAndSummary(
      month,
      bankFilename,
      userFilename
    );
    console.info('> Done processing data!');
  } catch (e) {
    reportError(e);
  }
};

const recordController = {
  createReportAndSummary
};

export default recordController;
