import { month } from './record.type';
import recordService from './record.service';
import { reportError } from '../errors/errors';
import { done } from './record.constants';

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
    console.info(done);
  } catch (e) {
    reportError(e);
  }
};

const recordController = {
  createReportAndSummary
};

export default recordController;
