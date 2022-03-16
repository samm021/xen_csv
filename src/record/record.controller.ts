import _ from 'lodash';

import recordService from './record.service';
import { month } from './record.type';

const createReportAndSummary = async (month: month) => {
  try {
    const [bankRecords, proxyRecords] = await recordService.getBankProxyRecords(
      month
    );

    const mismatchedRecords = recordService.getMismatchedRecords(
      bankRecords,
      proxyRecords
    );

    const unreconciledRecords = await recordService.getUnreconciledRecords(
      mismatchedRecords
    );

    await recordService.writeReports(
      bankRecords,
      proxyRecords,
      unreconciledRecords,
      mismatchedRecords
    );
    console.info('> Done processing data!');
  } catch (e) {
    console.error(e);
    console.info('> Getting errors when processing data, exiting...');
  }
};

const recordController = { createReportAndSummary };

export default recordController;
