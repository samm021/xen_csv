import recordService from './record.service';

const start = async () => {
  try {
    const [bankRecords, proxyRecords] = await Promise.all([
      recordService.getBankRecords(),
      recordService.getProxyRecords()
    ]);
    console.log('> Getting source & proxy records...');

    const mismatchedRecords = await recordService.getMismatchedRecords(
      bankRecords,
      proxyRecords
    );
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
  } catch (e) {
    console.log(e);
  } finally {
    console.log('> Done processing data!');
  }
};

export default start;
