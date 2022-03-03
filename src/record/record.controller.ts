import recordService from './record.service';

const start = async () => {
  try {
    const bankRecords = await recordService.getBankRecords();
    const proxyRecords = await recordService.getProxyRecords();
    const mismatchedRecords = await recordService.getMismatchedRecords(
      bankRecords,
      proxyRecords
    );
    const unreconciledRecords = recordService.getUnreconciledRecords(
      mismatchedRecords
    );
    const writerReportStatement = recordService.writeReportStatement(
      unreconciledRecords
    );
    const writeReportSummary = recordService.writeReportSummary(
      bankRecords,
      proxyRecords,
      unreconciledRecords,
      mismatchedRecords
    );
    await Promise.all([writerReportStatement, writeReportSummary]);
  } catch (e) {
    console.log(e);
  } finally {
    console.log('> Done processing data');
  }
};

export default start;
