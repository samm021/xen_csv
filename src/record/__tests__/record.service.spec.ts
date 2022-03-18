import recordService from '../record.service';
import recordUtil from '../record.util';
import { mockRecordData, mockUnreconciledData } from '../__mocks__/record.data';
import csvRepository from '../../csv/csv.repository';
import textRepository from '../../text/text.repository';
import { ERROR_CODE } from '../../errors/errors.enum';

jest.mock('../../csv/csv.repository');
jest.mock('../../text/text.repository');
jest.mock('../record.util');

describe('recordService', () => {
  beforeEach(() => {
    expect.hasAssertions();
    jest.resetAllMocks();
  });

  describe('createReportAndSummary', () => {
    it('should give failed to get bank record error', async () => {
      // Given
      (recordUtil.getFilePath as jest.Mock).mockImplementation(() => '');
      (csvRepository.getCSVFileContents as jest.Mock).mockResolvedValue(
        mockRecordData
      );
      (recordUtil.filteredContentsByMonth as jest.Mock).mockRejectedValueOnce(
        new Error(ERROR_CODE.FAILED_TO_GET_BANK_RECORDS)
      );

      // When
      const e = await recordService
        .createReportAndSummary(7, '', '')
        .catch(e => e);

      // Then
      expect(e).toBeDefined();
      expect(e.toString()).toContain(ERROR_CODE.FAILED_TO_GET_BANK_RECORDS);
      expect(csvRepository.getCSVFileContents).toBeCalledTimes(2);
    });

    it('should give failed to get user record error', async () => {
      // Given
      (recordUtil.getFilePath as jest.Mock).mockImplementation(() => '');
      (csvRepository.getCSVFileContents as jest.Mock).mockResolvedValue(
        mockRecordData
      );
      (recordUtil.filteredContentsByMonth as jest.Mock).mockRejectedValueOnce(
        new Error(ERROR_CODE.FAILED_TO_GET_USER_RECORDS)
      );

      // When
      const e = await recordService
        .createReportAndSummary(7, '', '')
        .catch(e => e);

      // Then
      expect(e).toBeDefined();
      expect(e.toString()).toContain(ERROR_CODE.FAILED_TO_GET_USER_RECORDS);
      expect(csvRepository.getCSVFileContents).toBeCalledTimes(2);
    });

    it('should return early with no result/error if month records is not found', async () => {
      // Given
      (recordUtil.getFilePath as jest.Mock).mockImplementation(() => '');
      (csvRepository.getCSVFileContents as jest.Mock).mockResolvedValue([]);
      (recordUtil.filteredContentsByMonth as jest.Mock).mockImplementation(
        () => []
      );

      // When
      const e = await recordService
        .createReportAndSummary(7, '', '')
        .catch(e => e);

      // Then
      expect(e).toBeUndefined();
      expect(csvRepository.getCSVFileContents).toBeCalledTimes(2);
      expect(recordUtil.getMismatchedRecords).not.toBeCalled();
      expect(recordUtil.getUnreconciledRecords).not.toBeCalled();
      expect(csvRepository.writeCSVFileContents).not.toBeCalled();
      expect(textRepository.writeTextFileContents).not.toBeCalled();
    });

    it('should give failed to get user write statement error', async () => {
      // Given
      (recordUtil.getFilePath as jest.Mock).mockImplementation(() => '');
      (csvRepository.getCSVFileContents as jest.Mock).mockResolvedValue(
        mockRecordData
      );
      (recordUtil.filteredContentsByMonth as jest.Mock).mockImplementation(
        () => mockRecordData
      );
      (recordUtil.getMismatchedRecords as jest.Mock).mockImplementation(() => {
        return { fromBank: mockRecordData, fromUser: mockRecordData };
      });
      (recordUtil.getUnreconciledRecords as jest.Mock).mockImplementation(
        () => mockUnreconciledData
      );
      (csvRepository.writeCSVFileContents as jest.Mock).mockRejectedValueOnce(
        new Error()
      );
      (recordUtil.getText as jest.Mock).mockImplementation(() => '');
      (textRepository.writeTextFileContents as jest.Mock).mockResolvedValueOnce(
        null
      );

      // When
      const e = await recordService
        .createReportAndSummary(7, '', '')
        .catch(e => e);

      // Then
      expect(e).toBeDefined();
      expect(e.toString()).toContain(ERROR_CODE.FAILED_TO_WRITE_STATEMENT);
      expect(csvRepository.getCSVFileContents).toBeCalledTimes(2);
      expect(recordUtil.getMismatchedRecords).toBeCalledTimes(1);
      expect(recordUtil.getUnreconciledRecords).toBeCalledTimes(1);
      expect(csvRepository.writeCSVFileContents).toBeCalledTimes(1);
      expect(textRepository.writeTextFileContents).toBeCalledTimes(1);
    });

    it('should give failed to get user write summary error', async () => {
      // Given
      (recordUtil.getFilePath as jest.Mock).mockImplementation(() => '');
      (csvRepository.getCSVFileContents as jest.Mock).mockResolvedValue(
        mockRecordData
      );
      (recordUtil.filteredContentsByMonth as jest.Mock).mockImplementation(
        () => mockRecordData
      );
      (recordUtil.getMismatchedRecords as jest.Mock).mockImplementation(() => {
        return { fromBank: mockRecordData, fromUser: mockRecordData };
      });
      (recordUtil.getUnreconciledRecords as jest.Mock).mockImplementation(
        () => mockUnreconciledData
      );
      (csvRepository.writeCSVFileContents as jest.Mock).mockResolvedValueOnce(
        null
      );
      (recordUtil.getText as jest.Mock).mockImplementation(() => '');
      (textRepository.writeTextFileContents as jest.Mock).mockRejectedValueOnce(
        new Error()
      );

      // When
      const e = await recordService
        .createReportAndSummary(7, '', '')
        .catch(e => e);

      // Then
      expect(e).toBeDefined();
      expect(e.toString()).toContain(ERROR_CODE.FAILED_TO_WRITE_SUMMARY);
      expect(csvRepository.getCSVFileContents).toBeCalledTimes(2);
      expect(recordUtil.getMismatchedRecords).toBeCalledTimes(1);
      expect(recordUtil.getUnreconciledRecords).toBeCalledTimes(1);
      expect(csvRepository.writeCSVFileContents).toBeCalledTimes(1);
      expect(textRepository.writeTextFileContents).toBeCalledTimes(1);
    });

    it('should success writing only summary files', async () => {
      // Given
      (recordUtil.getFilePath as jest.Mock).mockImplementation(() => '');
      (csvRepository.getCSVFileContents as jest.Mock).mockResolvedValue(
        mockRecordData
      );
      (recordUtil.filteredContentsByMonth as jest.Mock).mockImplementation(
        () => mockRecordData
      );
      (recordUtil.getMismatchedRecords as jest.Mock).mockImplementation(() => {
        return { fromBank: [], fromUser: [] };
      });
      (recordUtil.getUnreconciledRecords as jest.Mock).mockImplementation(
        () => null
      );
      (recordUtil.getText as jest.Mock).mockImplementation(() => '');
      (textRepository.writeTextFileContents as jest.Mock).mockResolvedValueOnce(
        null
      );

      // When
      const e = await recordService
        .createReportAndSummary(7, '', '')
        .catch(e => e);

      // Then
      expect(e).toBeUndefined();
      expect(csvRepository.getCSVFileContents).toBeCalledTimes(2);
      expect(recordUtil.getMismatchedRecords).toBeCalledTimes(1);
      expect(recordUtil.getUnreconciledRecords).toBeCalledTimes(1);
      expect(csvRepository.writeCSVFileContents).not.toBeCalled();
      expect(textRepository.writeTextFileContents).toBeCalledTimes(1);
    });

    it('should success writing report and summary files', async () => {
      // Given
      (recordUtil.getFilePath as jest.Mock).mockImplementation(() => '');
      (csvRepository.getCSVFileContents as jest.Mock).mockResolvedValue(
        mockRecordData
      );
      (recordUtil.filteredContentsByMonth as jest.Mock).mockImplementation(
        () => mockRecordData
      );
      (recordUtil.getMismatchedRecords as jest.Mock).mockImplementation(() => {
        return { fromBank: mockRecordData, fromUser: mockRecordData };
      });
      (recordUtil.getUnreconciledRecords as jest.Mock).mockImplementation(
        () => mockUnreconciledData
      );
      (csvRepository.writeCSVFileContents as jest.Mock).mockResolvedValueOnce(
        null
      );
      (recordUtil.getText as jest.Mock).mockImplementation(() => '');
      (textRepository.writeTextFileContents as jest.Mock).mockResolvedValueOnce(
        null
      );

      // When
      const e = await recordService
        .createReportAndSummary(7, '', '')
        .catch(e => e);

      // Then
      expect(e).toBeUndefined();
      expect(csvRepository.getCSVFileContents).toBeCalledTimes(2);
      expect(recordUtil.getMismatchedRecords).toBeCalledTimes(1);
      expect(recordUtil.getUnreconciledRecords).toBeCalledTimes(1);
      expect(csvRepository.writeCSVFileContents).toBeCalledTimes(1);
      expect(textRepository.writeTextFileContents).toBeCalledTimes(1);
    });
  });
});
