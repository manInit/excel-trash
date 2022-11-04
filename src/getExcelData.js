import Excel from "exceljs/dist/exceljs";

function prepareValue(value) {
  if (!value) value = "";
  else if (value.formula) {
    value = value.result ? value.result : 0;
  } else if (value.sharedFormula) {
    value = value.result ? value.result : 0;
  } else if (value.text) {
    value = value.text;
  }
  if (Number(value)) {
    value = Math.round(Number(value) * 100) / 100;
  }
  return value;
}

export async function getExcelData(file) {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  const arrayBuffer = await new Promise((resolve, reject) => {
    reader.onload = () => {
      resolve(reader.result);
    };
  });

  const workbook = new Excel.Workbook();
  await workbook.xlsx.load(arrayBuffer);
  const worksheetsData = {};
  workbook.eachSheet((worksheet, sheetId) => {
    worksheetsData[worksheet.name] = {
      data: [],
      headers: []
    }
    
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        worksheetsData[worksheet.name].headers = row.values.splice(1);
        for (let i = 0; i < worksheetsData[worksheet.name].headers.length; i++) {
          if (!worksheetsData[worksheet.name].headers[i]) worksheetsData[worksheet.name].headers[i] = "_" + i;
        }
      } else {
        const cellData = { id: rowNumber };
        row.eachCell((cell, cellNumber) => {
          cellData[worksheetsData[worksheet.name].headers[cellNumber - 1].toString()] = {
            value: prepareValue(cell.value),
            style: {
              bg: cell.fill?.fgColor?.argb?.slice(2)
            }
          };
        });
        worksheetsData[worksheet.name].data.push(cellData);
      }
    });
  });
  return worksheetsData;
}
