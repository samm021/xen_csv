import recordController from '../record.controller';
import recordService from '../record.service';
import { ERROR_CODE } from '../../errors/errors.enum';

jest.mock('../record.service');

describe('recordController', () => {
  const month = 2;

  beforeEach(() => {
    expect.hasAssertions();
    jest.resetAllMocks();
  });

  describe('createReportAndSummary', () => {
    it('process should call createReportAndSummary in service', async () => {
      // Given
      (recordService.createReportAndSummary as jest.Mock).mockResolvedValueOnce(
        null
      );

      // When
      await recordController.createReportAndSummary(month, '', '');

      // Then
      expect(recordService.createReportAndSummary).toBeCalledTimes(1);
    });

    it('process catch error if createReportAndSummary service returns error', async () => {
      // Given
      (recordService.createReportAndSummary as jest.Mock).mockRejectedValueOnce(
        new Error(ERROR_CODE.DIRTY_DATA)
      );

      // When
      await recordController.createReportAndSummary(month, '', '').catch(e => {
        expect((e as Error).message).toContain(
          ERROR_CODE.DIRTY_DATA.toString()
        );
      });

      // Then
      expect(recordService.createReportAndSummary).toBeCalledTimes(1);
    });
  });
});
