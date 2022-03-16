import fs from 'fs';

const writeTextFileContents = (path: string, data: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, e => {
      if (e) {
        reject(e);
        return;
      }
      resolve();
    });
  });
};

const textRepository = {
  writeTextFileContents
};

export default textRepository;
