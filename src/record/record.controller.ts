import _ from 'lodash';

import recordService from './record.service';

const start = async (month: number) => {
  try {
    const [bankRecords, proxyRecords] = await Promise.all([
      recordService.getBankRecords(month),
      recordService.getProxyRecords(month)
    ]);
    console.info('> Getting source & proxy records...');

    const mismatchedRecords = recordService.getMismatchedRecords(
      bankRecords,
      proxyRecords
    );
    if (
      _.isEmpty(mismatchedRecords.fromBank) ||
      _.isEmpty(mismatchedRecords.fromProxy)
    ) {
      console.info(
        '> Source & proxy records has no mismatched record, exiting...'
      );
      return;
    }

    const unreconciledRecords = recordService.getUnreconciledRecords(
      mismatchedRecords
    );
    console.info('> Calculating mismatched records...');

    await Promise.all([
      recordService.writeReportStatement(unreconciledRecords),
      recordService.writeReportSummary(
        bankRecords,
        proxyRecords,
        unreconciledRecords,
        mismatchedRecords
      )
    ]);
    console.info('> Writing report & summary...');
  } catch (e) {
    console.error(e);
  } finally {
    console.info('> Done processing data!');
  }
};

export default start;
