import LocalStorage from "./localstorage";
import Excel from "exceljs/dist/exceljs";

function saveExcel() {
  const workbookRawData = LocalStorage.getWorkbook();
  console.log(workbookRawData);
  const workbook = new Excel.Workbook();
  for (const worksheetName of Object.keys(workbookRawData)) {
    const sheet = workbook.addWorksheet(worksheetName);
    sheet.columns = workbookRawData[worksheetName].headers.map((header) => {
      let headerTitle = header;
      if (header.startsWith("_")) {
        headerTitle = "";
      }
      return {
        header: headerTitle,
        key: header,
        width: 32,
      };
    });
    for (const row of workbookRawData[worksheetName].data.reverse()) {
      let rowObject = {};
      for (const key of workbookRawData[worksheetName].headers) {
        if (key === "id") continue;
        if (row[key]?.value) {
          rowObject[key] = row[key].value;
        } else {
          rowObject[key] = ''
        }
      }
      const rowLast = sheet.insertRow(2, rowObject);
      rowLast.eachCell((cell, cellNumber) => {
        const color = row[cell._column._key]?.style?.bg
        if (!color) return
        cell.fill = {
          type: 'pattern',
          pattern:'solid',
          fgColor: {
            argb: 'FF' + color
          }
        }
      }) 
    }
  }



  workbook.xlsx
    .writeBuffer({
      base64: true,
    })
    .then(xls64 => {
      const a = document.createElement("a");
      const data = new Blob([xls64], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(data);
      a.href = url;
      a.download = "export.xlsx";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    });
}

export { saveExcel };
