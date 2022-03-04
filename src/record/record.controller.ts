import _ from 'lodash';

import recordService from './record.service';

const start = async (month: number) => {
  try {
    console.info('> Getting source & proxy records...');
    const [bankRecords, proxyRecords] = await Promise.all([
      recordService.getBankRecords(month),
      recordService.getProxyRecords(month)
    ]);

    console.info('> Getting mismatched records...');
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

    console.info('> Calculating mismatched records...');
    const unreconciledRecords = recordService.getUnreconciledRecords(
      mismatchedRecords
    );

    console.info('> Writing report & summary...');
    await Promise.all([
      recordService.writeReportStatement(unreconciledRecords),
      recordService.writeReportSummary(
        bankRecords,
        proxyRecords,
        unreconciledRecords,
        mismatchedRecords
      )
    ]);

    console.info('> Done processing data!');
  } catch (e) {
    console.error(e);
    console.info('> Getting errors when processing data, exiting...');
  }
};

export default start;
