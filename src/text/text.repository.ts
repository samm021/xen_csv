import fs from 'fs';
import { ERROR_CODE } from '../errors/errors.enum';

const writeTextFileContents = async (
  path: string,
  data: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, e => {
      if (e) {
        console.error(e);
        reject(new Error(ERROR_CODE.FAILED_TO_WRITE_TXT));
      }
      resolve();
    });
  });
};

const textRepository = {
  writeTextFileContents
};

export default textRepository;
