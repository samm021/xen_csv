import { errorsList, ERROR_CODE } from './errors.enum';

const reportError = (e: Error) => {
  if (Object.keys(ERROR_CODE).some(code => code === e.message)) {
    console.error(`${errorsList[e.message as ERROR_CODE].message}...
    \n${e.stack}`);
    return;
  }
  console.error(`${e.message}...
  \n${e.stack}`);
  return;
};

export { reportError };
