export const filePath =
  '/Users/mohammed.ismail/Personal/tests/xen_csv/data/exampleProxy.csv';
export const wrongExtFilepath =
  '/Users/mohammed.ismail/Personal/tests/xen_csv/data/summary.txt';
export const wrongDataFilepath =
  '/Users/mohammed.ismail/Personal/tests/xen_csv/data/wrongExampleSource.csv';
export const writeDataFilepath =
  '/Users/mohammed.ismail/Personal/tests/xen_csv/data/newTest.csv';

export const wrongValidator = (data: any): any | undefined => {
  if (
    data.id &&
    data.amount &&
    data.description &&
    data.date &&
    !isNaN(data.amount) &&
    Date.parse(data.date)
  ) {
    data.amount = Number(data.amount);
    return data;
  }
  return;
};

export const mockData = [
  { date: '2021-07-01', id: 'zoap', amount: 69, description: 'C' },
  { date: '2021-07-04', id: 'zogn', amount: 86, description: 'E' },
  { date: '2021-07-07', id: 'zojm', amount: 76, description: 'F' },
  { date: '2021-07-31', id: 'zoml', amount: 62, description: 'G' },
  { date: '2021-07-06', id: 'zopk', amount: 66, description: 'H' },
  { date: '2021-07-10', id: 'zovi', amount: 73, description: 'J' }
];

export const mockHeader = [
  { id: 'a', title: 'a' },
  { id: 'b', title: 'b' },
  { id: 'c', title: 'c' },
  { id: 'd', title: 'd' },
  { id: 'e', title: 'e' }
];
