const xlsx = require('xlsx');

const workbook = xlsx.readFile('src/data/DATA KEPEGAWAIAN.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 }); // read as array of arrays

console.log('Rows 4 to 10:');
for (let i = 3; i < 10; i++) {
  console.log(data[i]);
}
