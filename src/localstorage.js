class LocalStorage {
  static getWorkbook() {
    return JSON.parse(localStorage.getItem("workbook"));
  }

  static saveWorkbook(workbook) {
    localStorage.setItem("workbook", JSON.stringify(workbook));
  }

  static saveExtraWorkbook(workbook) {
    localStorage.setItem("extra_workbook", JSON.stringify(workbook));
  }

  static getExtraWorkbook() {
    return JSON.parse(localStorage.getItem("extra_workbook"));
  }

  static saveCurrentWorksheet(worksheet) {
    localStorage.setItem("current_worksheet", worksheet);
  }

  static patchValue(worksheetName, idRow, header, newValue) {
    const workbook = LocalStorage.getWorkbook();
    const cellObject = workbook[worksheetName].data.find(
      (row) => row.id === idRow
    );
    if (cellObject[header]) {
      cellObject[header].value = newValue;
    } else {
      cellObject[header] = {
        value: newValue
      }
    }
    LocalStorage.saveWorkbook(workbook);
  }

  static patchColor(worksheetName, idRow, header, color) {
    const workbook = LocalStorage.getWorkbook();
    const cellObject = workbook[worksheetName].data.find(
      (row) => row.id === idRow
    );
    if (cellObject[header]) {
      cellObject[header].style = {
        bg: color
      };
    } else {
      cellObject[header] = {
        style: {
          bg: color
        }
      }
    }
    LocalStorage.saveWorkbook(workbook);
  }

  static setCurrentCell(idRow, columnName) {
    localStorage.setItem("current_row", idRow);
    localStorage.setItem("current_column", columnName);
  }

  static getCurrentCell() {
    const idRow = localStorage.getItem("current_row");
    const columnName = localStorage.getItem("current_column");
    return {
      idRow,
      columnName,
    };
  }

  static deleteCurrentWorksheet() {
    localStorage.setItem("current_worksheet", "");
  }

  static getCurrentWorksheet() {
    return localStorage.getItem("current_worksheet");
  }
}

export default LocalStorage;
