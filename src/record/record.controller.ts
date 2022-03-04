import _ from 'lodash';

import recordService from './record.service';

const start = async (month: number) => {
  try {
    const [bankRecords, proxyRecords] = await Promise.all([
      recordService.getBankRecords(month),
      recordService.getProxyRecords(month)
    ]);
    console.log('> Getting source & proxy records...');

    const mismatchedRecords = recordService.getMismatchedRecords(
      bankRecords,
      proxyRecords
    );
    if (
      _.isEmpty(mismatchedRecords.fromBank) ||
      _.isEmpty(mismatchedRecords.fromProxy)
    ) {
      console.log(
        '> Source & proxy records has no mismatched record, exiting...'
      );
      return;
    }
    const unreconciledRecords = recordService.getUnreconciledRecords(
      mismatchedRecords
    );
    console.log('> Calculating mismatched records...');

    await Promise.all([
      recordService.writeReportStatement(unreconciledRecords),
      recordService.writeReportSummary(
        bankRecords,
        proxyRecords,
        unreconciledRecords,
        mismatchedRecords
      )
    ]);
    console.log('> Writing report & summary...');
    return;
  } catch (e) {
    console.log(e);
  } finally {
    console.log('> Done processing data!');
  }
};

export default start;
