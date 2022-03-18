import csvRepository from '../csv.repository';
import { ERROR_CODE } from '../../errors/errors.enum';
import {
  filePath,
  wrongExtFilepath,
  wrongValidator,
  wrongDataFilepath,
  mockData,
  mockHeader,
  writeDataFilepath
} from '../__mocks__/csv.data';

describe('csvRepository', () => {
  const mapHeaders = (header: string) => header;
  const validator = (data: any) => data;

  beforeEach(() => expect.hasAssertions());

  describe('getCSVFileContents', () => {
    it('should success reading csv file', async () => {
      // When
      const result = await csvRepository.getCSVFileContents(
        filePath,
        mapHeaders,
        validator
      );

      // Then
      expect(result).toBeDefined();
    });

    it('should throw error invalid extension if file is not csv', async () => {
      // Then
      await expect(
        csvRepository.getCSVFileContents(
          wrongExtFilepath,
          mapHeaders,
          validator
        )
      ).rejects.toThrowError(new Error(ERROR_CODE.INVALID_EXTENSION));
    });

    it('should throw error if data is not validated', async () => {
      // Then
      await expect(
        csvRepository.getCSVFileContents(
          wrongDataFilepath,
          mapHeaders,
          wrongValidator
        )
      ).rejects.toThrowError(new Error(ERROR_CODE.DIRTY_DATA));
    });
  });

  describe('writeCSVFileContents', () => {
    it('should success writing csv file', async () => {
      // When
      const result = await csvRepository.writeCSVFileContents(
        mockData,
        mockHeader,
        writeDataFilepath
      );

      // Then
      expect(result).toBeUndefined();
    });

    it('should throw error if failed writing csv file', async () => {
      // Then
      await expect(
        csvRepository.writeCSVFileContents([], [], '')
      ).rejects.toThrowError(new Error(ERROR_CODE.FAILED_TO_WRITE_CSV));
    });
  });
});
