import textRepository from '../text.repository';
import { ERROR_CODE } from '../../errors/errors.enum';
import { writeTextFilepath, textString } from '../__mocks__/text.data';

describe('textRepository', () => {
  beforeEach(() => expect.hasAssertions());

  describe('writeTextFileContents', () => {
    it('should success writing txt file', async () => {
      // When
      const result = await textRepository.writeTextFileContents(
        writeTextFilepath,
        textString
      );

      // Then
      expect(result).toBeUndefined();
    });

    it('should throw error if failed writing txt file', async () => {
      // Then
      await expect(
        textRepository.writeTextFileContents('', '')
      ).rejects.toThrowError(new Error(ERROR_CODE.FAILED_TO_WRITE_TXT));
    });
  });
});
