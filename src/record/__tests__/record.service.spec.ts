// import recordService from '../record.service';
// import recordRepository from '../record.repository';
// import { mockRecordData } from '../__mocks__/record.data';

// jest.mock('../record.repository');

// describe('recordService', () => {
//   beforeEach(() => {
//     expect.hasAssertions();
//     jest.resetAllMocks();
//   });
//   describe('getBankRecords', () => {
//     it('should get monthly bank data from file', async () => {
//       // Given
//       (recordRepository.getFilePath as jest.Mock).mockResolvedValue('');
//       (recordRepository.getCSVFileContents as jest.Mock).mockResolvedValue(
//         mockRecordData
//       );

//       // When
//       const result = await recordService.getBankRecords(7);

//       // Then
//       expect(result).toBeDefined();
//       expect(result[0]).toBeDefined();
//     });

//     it('should not get non exist monthly bank data from file', async () => {
//       // Given
//       (recordRepository.getFilePath as jest.Mock).mockResolvedValue('');
//       (recordRepository.getCSVFileContents as jest.Mock).mockResolvedValue([]);

//       // When
//       const result = await recordService.getBankRecords(1);

//       // Then
//       expect(result).toBeDefined();
//       expect(result[0]).toBeUndefined();
//     });

//     it('should get error if failed to read csv file', async () => {
//       // Given
//       (recordRepository.getFilePath as jest.Mock).mockResolvedValue('');
//       (recordRepository.getCSVFileContents as jest.Mock).mockRejectedValue(
//         new Error()
//       );

//       // When
//       const e = await recordService.getBankRecords(3).catch(e => e);

//       // Then
//       expect(e).toBeDefined();
//     });
//   });

//   describe('getProxyRecords', () => {
//     it('should get monthly proxy data from file', async () => {
//       // Given
//       (recordRepository.getFilePath as jest.Mock).mockResolvedValue('');
//       (recordRepository.getCSVFileContents as jest.Mock).mockResolvedValue(
//         mockRecordData
//       );

//       // When
//       const result = await recordService.getProxyRecords(7);

//       // Then
//       expect(result).toBeDefined();
//       expect(result[0]).toBeDefined();
//     });

//     it('should not get non exist monthly proxy data from file', async () => {
//       // Given
//       (recordRepository.getFilePath as jest.Mock).mockResolvedValue('');
//       (recordRepository.getCSVFileContents as jest.Mock).mockResolvedValue([]);

//       // When
//       const result = await recordService.getProxyRecords(1);

//       // Then
//       expect(result).toBeDefined();
//       expect(result[0]).toBeUndefined();
//     });

//     it('should get error if failed to read csv file', async () => {
//       // Given
//       (recordRepository.getFilePath as jest.Mock).mockResolvedValue('');
//       (recordRepository.getCSVFileContents as jest.Mock).mockRejectedValue(
//         new Error()
//       );

//       // When
//       const e = await recordService.getProxyRecords(3).catch(e => e);

//       // Then
//       expect(e).toBeDefined();
//     });
//   });

//   describe('getMismatchedRecords', () => {
//     it('should give unique data if input is not equal', () => {
//       // Given
//       const bankData = [mockRecordData[0]];
//       const proxyData = [{ ...bankData[0], description: 'd' }];

//       // When
//       const result = recordService.getMismatchedRecords(bankData, proxyData);

//       // Then
//       expect(result.fromBank[0]).toBeDefined();
//       expect(result.fromProxy[0]).toBeDefined();
//     });

//     it('should not give unique data if input is equal', () => {
//       // Given
//       const bankData = [mockRecordData[0]];
//       const proxyData = [{ ...bankData[0] }];

//       // When
//       const result = recordService.getMismatchedRecords(bankData, proxyData);

//       // Then
//       expect(result.fromBank[0]).toBeUndefined();
//       expect(result.fromProxy[0]).toBeUndefined();
//     });
//   });

//   describe('getUnreconciledRecords', () => {
//     it('should give unreconciled data', () => {
//       // Given
//       const data = mockRecordData[0];
//       const unreconciledData = {
//         fromBank: [data],
//         fromProxy: [{ ...data, description: 'd' }]
//       };

//       // When
//       const result = recordService.getUnreconciledRecords(unreconciledData);

//       // Then
//       expect(result).toBeDefined();
//       expect(result[0].discrepancyCode).toBeDefined();
//       expect(result[0].remarks).toBeDefined();
//     });

//     it('should give unreconciled data if similar id not found', () => {
//       // Given
//       const data = mockRecordData[0];
//       const unreconciledData = {
//         fromBank: [],
//         fromProxy: [data]
//       };

//       // When
//       const result = recordService.getUnreconciledRecords(unreconciledData);

//       // Then
//       expect(result).toBeDefined();
//       expect(result[0].discrepancyCode).toEqual('ID_NOT_FOUND');
//       expect(result[0].remarks).toBeDefined();
//     });
//   });

//   describe('writeReportStatement', () => {
//     it('should returns nothing if success write statement', async () => {
//       // Given
//       (recordRepository.getFilePath as jest.Mock).mockResolvedValue('');
//       (recordRepository.writeCSVFileContents as jest.Mock).mockResolvedValue(
//         null
//       );

//       // When
//       const result = await recordService.writeReportStatement([]);

//       // Then
//       expect(result).toBeUndefined();
//     });

//     it('should returns error if failed to write statement', async () => {
//       // Given
//       (recordRepository.getFilePath as jest.Mock).mockResolvedValue('');
//       (recordRepository.writeCSVFileContents as jest.Mock).mockRejectedValue(
//         new Error()
//       );

//       // When
//       const e = await recordService.writeReportStatement([]).catch(e => e);

//       // Then
//       expect(e).toBeDefined();
//     });
//   });

//   describe('writeReportSummary', () => {
//     it('should returns nothing if success write summary', async () => {
//       // Given
//       (recordRepository.getFilePath as jest.Mock).mockResolvedValue('');
//       (recordRepository.writeTextFileContents as jest.Mock).mockResolvedValue(
//         null
//       );

//       // When
//       const result = await recordService.writeReportSummary([], [], [], {
//         fromBank: [],
//         fromProxy: [mockRecordData[0]]
//       });

//       // Then
//       expect(result).toBeUndefined();
//     });

//     it('should returns error if failed to write summary', async () => {
//       // Given
//       (recordRepository.getFilePath as jest.Mock).mockResolvedValue('');
//       (recordRepository.writeTextFileContents as jest.Mock).mockRejectedValue(
//         new Error()
//       );

//       // When
//       const e = await recordService
//         .writeReportSummary([], [], [], {
//           fromBank: [],
//           fromProxy: [mockRecordData[0]]
//         })
//         .catch(e => e);

//       // Then
//       expect(e).toBeDefined();
//     });
//   });
// });
