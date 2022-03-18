import recordUtil from '../record.util';
import {
  mockRecordData,
  dateRange,
  mockUnreconciledData
} from '../__mocks__/record.data';
import { recordFormat, readFormat, RECORD_CODE } from '../record.enum';

describe('recordUtil', () => {
  beforeEach(() => expect.hasAssertions());

  describe('getFilePath', () => {
    it('should append string input as an output', () => {
      // Given
      const inputString = '';

      // When
      const outputString = recordUtil.getFilePath(inputString);

      // Then
      expect(outputString.length).not.toEqual(inputString);
    });
  });

  describe('validateData', () => {
    it('should pass validation if data has correct properties', () => {
      // Given
      const inputData = mockRecordData[0];

      // When
      const outputData = recordUtil.validateData(inputData);

      // Then
      expect(outputData).toEqual(inputData);
    });

    it('should return undefined if amount is not number', () => {
      // Given
      const inputData = { ...mockRecordData[0], amount: NaN };

      // When
      const outputData = recordUtil.validateData(inputData);

      // Then
      expect(outputData).toBe(undefined);
      expect(outputData).not.toEqual(inputData);
    });

    it('should return undefined if date is not a date', () => {
      // Given
      const inputData = { ...mockRecordData[0], date: 'abcde' };

      // When
      const outputData = recordUtil.validateData(inputData);

      // Then
      expect(outputData).toBe(undefined);
      expect(outputData).not.toEqual(inputData);
    });
  });

  describe('mapHeaders', () => {
    it('should output header string if amount format complies', () => {
      // Given
      const inputString = readFormat.am;

      // When
      const outputString = recordUtil.mapHeaders(inputString);

      // Then
      expect(outputString.length).not.toEqual(inputString);
      expect(outputString).toEqual(recordFormat.amount);
    });

    it('should output header string if description format complies ', () => {
      // Given
      const inputString = readFormat.descr;

      // When
      const outputString = recordUtil.mapHeaders(inputString);

      // Then
      expect(outputString.length).not.toEqual(inputString);
      expect(outputString).toEqual(recordFormat.description);
    });

    it('should output header string if date format complies ', () => {
      // Given
      const inputString = readFormat.date;

      // When
      const outputString = recordUtil.mapHeaders(inputString);

      // Then
      expect(outputString.length).not.toEqual(inputString);
      expect(outputString).toEqual(recordFormat.date);
    });

    it('should output header string if id format complies ', () => {
      // Given
      const inputString = readFormat.id;

      // When
      const outputString = recordUtil.mapHeaders(inputString);

      // Then
      expect(outputString.length).not.toEqual(inputString);
      expect(outputString).toEqual(recordFormat.id);
    });

    it('should output as input if read format not complies', () => {
      // Given
      const inputString = 'BCDSDAD';

      // When
      const outputString = recordUtil.mapHeaders(inputString);

      // Then
      expect(outputString).toEqual(inputString);
    });
  });

  describe('getMismatchedRecords', () => {
    it('should give empty fromBank & fromUser', () => {
      // When
      const mismatchRecords = recordUtil.getMismatchedRecords(
        mockRecordData,
        mockRecordData
      );

      // Then
      expect(mismatchRecords.fromBank.length).toEqual(0);
      expect(mismatchRecords.fromUser.length).toEqual(0);
    });

    it('should results in fromBank entries', () => {
      // Given
      const mockBankRecords = mockRecordData;
      const mockUserRecords = mockRecordData.slice(0, -1);

      // When
      const mismatchRecords = recordUtil.getMismatchedRecords(
        mockBankRecords,
        mockUserRecords
      );

      // Then
      expect(mismatchRecords.fromBank.length).toEqual(1);
      expect(mismatchRecords.fromUser.length).toEqual(0);
    });

    it('should results in fromUser entries', () => {
      // Given
      const mockBankRecords = mockRecordData.slice(0, -2);
      const mockUserRecords = mockRecordData;

      // When
      const mismatchRecords = recordUtil.getMismatchedRecords(
        mockBankRecords,
        mockUserRecords
      );

      // Then
      expect(mismatchRecords.fromBank.length).toEqual(0);
      expect(mismatchRecords.fromUser.length).toEqual(2);
    });

    it('should give results if 1 property has unique value', () => {
      // Given
      const mockBankRecords = [{ ...mockRecordData[0], amount: 11 }];
      const mockUserRecords = [{ ...mockRecordData[0], amount: 22 }];

      // When
      const mismatchRecords = recordUtil.getMismatchedRecords(
        mockBankRecords,
        mockUserRecords
      );

      // Then
      expect(mismatchRecords.fromBank.length).toEqual(1);
      expect(mismatchRecords.fromUser.length).toEqual(1);
    });
  });

  describe('getUnreconciledRecords', () => {
    it('should return unreconciled results', () => {
      // Given
      const data = mockRecordData[0];
      const unreconciledData = {
        fromBank: [data],
        fromUser: [{ ...data, description: 'd' }]
      };

      // When
      const result = recordUtil.getUnreconciledRecords(unreconciledData);

      // Then
      expect(result).toBeDefined();
      expect(result[0].discrepancyCode).toBeDefined();
      expect(result[0].remarks).toBeDefined();
    });

    it('should return result with id not found in bank code', () => {
      // Given
      const data = mockRecordData[0];
      const unreconciledData = {
        fromBank: [],
        fromUser: [data]
      };

      // When
      const result = recordUtil.getUnreconciledRecords(unreconciledData);

      // Then
      expect(result).toBeDefined();
      expect(result[0].discrepancyCode).toEqual(
        RECORD_CODE.ID_NOT_FOUND_IN_BANK
      );
      expect(result[0].remarks).toBeDefined();
    });

    it('should return result with id not found in user code', () => {
      // Given
      const data = mockRecordData[0];
      const unreconciledData = {
        fromBank: [data],
        fromUser: []
      };

      // When
      const result = recordUtil.getUnreconciledRecords(unreconciledData);

      // Then
      expect(result).toBeDefined();
      expect(result[0].discrepancyCode).toEqual(
        RECORD_CODE.ID_NOT_FOUND_IN_USER
      );
      expect(result[0].remarks).toBeDefined();
    });

    it('should return empty if bank & user data is empty', () => {
      // Given
      const unreconciledData = {
        fromBank: [],
        fromUser: []
      };

      // When
      const result = recordUtil.getUnreconciledRecords(unreconciledData);

      // Then
      expect(result).toBeDefined();
      expect(result[0]).toBeUndefined();
    });
  });

  describe('filteredContentsByMonth', () => {
    it('should give filtered data by month', () => {
      // Given
      const month = 7;

      // When
      const result = recordUtil.filteredContentsByMonth(mockRecordData, month);

      // Then
      expect(result).toEqual(mockRecordData);
    });

    it('should give empty array if data of that month dont exist', () => {
      // Given
      const month = 1;

      // When
      const result = recordUtil.filteredContentsByMonth(mockRecordData, month);

      // Then
      expect(result).toEqual([]);
    });

    it('should give empty array if data is empty', () => {
      // Given
      const month = 5;

      // When
      const result = recordUtil.filteredContentsByMonth([], month);

      // Then
      expect(result).toEqual([]);
    });
  });

  describe('getDateRange', () => {
    it('should give if records are empty', () => {
      // When
      const result = recordUtil.getDateRange([]);

      // Then
      expect(result).toEqual({ from: undefined, to: undefined });
    });

    it('should give if records are empty', () => {
      // Given
      const firstDate = new Date(mockRecordData[0].date);
      const lastDate = new Date(mockRecordData[3].date);

      // When
      const result = recordUtil.getDateRange(mockRecordData);

      // Then
      expect(result).toEqual({ from: firstDate, to: lastDate });
    });
  });

  describe('getText', () => {
    it('should return text with no errors if unreconciled errors are empty', () => {
      // Given
      const processedSource = 2;

      // When
      const text = recordUtil.getText(dateRange, processedSource, []);

      // Then
      expect(text).toContain('date:');
      expect(text).toContain('data:');
      expect(text).toContain('0 discrepancies');
    });

    it('should return text with errors if unreconciled has entries', () => {
      // Given
      const processedSource = 1;

      // When
      const text = recordUtil.getText(
        dateRange,
        processedSource,
        mockUnreconciledData
      );

      // Then
      expect(text).toContain('date:');
      expect(text).toContain('data:');
      expect(text).toContain(`${mockUnreconciledData.length} discrepancies`);
    });
  });
});
