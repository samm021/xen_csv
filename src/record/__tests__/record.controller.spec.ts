import recordController from '../record.controller';
import recordService from '../record.service';
import {
  mockRecordData,
  emptyMismatch,
  mockMismatchData,
  mockUnreconciledData
} from '../__mocks__/record.data';

jest.mock('../record.service');
jest.mock('../record.repository');

describe('recordController', () => {
  const mockBankData = [mockRecordData[0]];
  const mockProxyData = [mockRecordData[1]];
  beforeEach(() => {
    expect.hasAssertions();
    jest.resetAllMocks();
  });

  describe('start', () => {
    it('process should stop after get bank/proxy records return empty', async () => {
      // Given
      (recordService.getBankRecords as jest.Mock).mockResolvedValue([]);
      (recordService.getProxyRecords as jest.Mock).mockResolvedValue([]);

      // When
      await recordController.start(2);

      // Then
      expect(recordService.getBankRecords).toBeCalledTimes(1);
      expect(recordService.getProxyRecords).toBeCalledTimes(1);
      expect(recordService.getMismatchedRecords).not.toBeCalled();
      expect(recordService.getUnreconciledRecords).not.toBeCalled();
      expect(recordService.writeReportStatement).not.toBeCalled();
      expect(recordService.writeReportSummary).not.toBeCalled();
    });

    it('process should stop after get mismatched records return empty', async () => {
      // Given
      (recordService.getBankRecords as jest.Mock).mockResolvedValue(
        mockBankData
      );
      (recordService.getProxyRecords as jest.Mock).mockResolvedValue(
        mockProxyData
      );
      (recordService.getMismatchedRecords as jest.Mock).mockImplementation(
        () => emptyMismatch
      );

      // When
      await recordController.start(7);

      // Then
      expect(recordService.getBankRecords).toBeCalledTimes(1);
      expect(recordService.getProxyRecords).toBeCalledTimes(1);
      expect(recordService.getMismatchedRecords).toBeCalledTimes(1);
      expect(recordService.getUnreconciledRecords).not.toBeCalled();
      expect(recordService.writeReportStatement).not.toBeCalled();
      expect(recordService.writeReportSummary).not.toBeCalled();
    });

    it('process should stop after get unreconciled records throws error', async () => {
      // Given
      (recordService.getBankRecords as jest.Mock).mockResolvedValue(
        mockBankData
      );
      (recordService.getProxyRecords as jest.Mock).mockResolvedValue(
        mockProxyData
      );
      (recordService.getMismatchedRecords as jest.Mock).mockImplementation(
        () => mockMismatchData
      );

      (recordService.getUnreconciledRecords as jest.Mock).mockImplementation(
        () => new Error()
      );

      // When
      await recordController.start(4);

      // Then
      expect(recordService.getBankRecords).toBeCalledTimes(1);
      expect(recordService.getProxyRecords).toBeCalledTimes(1);
      expect(recordService.getMismatchedRecords).toBeCalledTimes(1);
      expect(recordService.getUnreconciledRecords).toBeCalledTimes(1);
      expect(recordService.writeReportStatement).not.toBeCalled();
      expect(recordService.writeReportSummary).not.toBeCalled();
    });

    it('process should stop after get write report/summary throws error', async () => {
      // Given
      (recordService.getBankRecords as jest.Mock).mockResolvedValue(
        mockBankData
      );
      (recordService.getProxyRecords as jest.Mock).mockResolvedValue(
        mockProxyData
      );
      (recordService.getMismatchedRecords as jest.Mock).mockImplementation(
        () => mockMismatchData
      );
      (recordService.getUnreconciledRecords as jest.Mock).mockImplementation(
        () => mockUnreconciledData
      );
      (recordService.writeReportStatement as jest.Mock).mockRejectedValue(
        new Error()
      );
      (recordService.writeReportSummary as jest.Mock).mockRejectedValue(
        new Error()
      );

      // When
      await recordController.start(4);

      // Then
      expect(recordService.getBankRecords).toBeCalledTimes(1);
      expect(recordService.getProxyRecords).toBeCalledTimes(1);
      expect(recordService.getMismatchedRecords).toBeCalledTimes(1);
      expect(recordService.writeReportStatement).toBeCalledTimes(1);
      expect(recordService.writeReportSummary).toBeCalledTimes(1);
    });

    it('process should success', async () => {
      // Given
      (recordService.getBankRecords as jest.Mock).mockResolvedValue(
        mockBankData
      );
      (recordService.getProxyRecords as jest.Mock).mockResolvedValue(
        mockProxyData
      );
      (recordService.getMismatchedRecords as jest.Mock).mockImplementation(
        () => mockMismatchData
      );
      (recordService.getUnreconciledRecords as jest.Mock).mockImplementation(
        () => mockUnreconciledData
      );
      (recordService.writeReportStatement as jest.Mock).mockRejectedValue(null);
      (recordService.writeReportSummary as jest.Mock).mockResolvedValue(null);

      // When
      await recordController.start(4);

      // Then
      expect(recordService.getBankRecords).toBeCalledTimes(1);
      expect(recordService.getProxyRecords).toBeCalledTimes(1);
      expect(recordService.getMismatchedRecords).toBeCalledTimes(1);
      expect(recordService.writeReportStatement).toBeCalledTimes(1);
      expect(recordService.writeReportSummary).toBeCalledTimes(1);
    });
  });
});
