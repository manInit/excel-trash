import "./style.css";
import "./components/";
import { getExcelData } from "./getExcelData";
import { tableMain, tableExtra } from "./table";
import LocalStorage from "./localstorage";
import { saveExcel } from "./saveExcel";

const btnExcelBtn = document.getElementById("excel-load");
const inputTypeFile = document.getElementById("excel-file-input");
const inputExtraFile = document.getElementById("excel-extra-file-input");
const worksheetSelect = document.getElementById("worksheet-select");
const saveExcelBtn = document.getElementById("download-excel-btn");
const saveExtraBtn = document.getElementById("excel-extra-load");

const mainTabBtn = document.getElementById("main-tab");
const extraTabBtn = document.getElementById("extra-tab");
const table = document.getElementById("table");
const tableExtraEl = document.getElementById("table-extra");

let isExtra = false;
let worksheetsGlobal = null;

function showMainTable() {
  table.style.display = "block";
  tableExtraEl.style.display = "none";
  isExtra = false;
  updateSelectionOptions(worksheetsGlobal);
}

function showExtraTable() {
  table.style.display = "none";
  tableExtraEl.style.display = "block";
  isExtra = true;
  updateSelectionOptions(LocalStorage.getExtraWorkbook());
}

function loadDocument(worksheets) {
  worksheetsGlobal = worksheets;
  updateSelectionOptions(worksheets);
  if (LocalStorage.getCurrentWorksheet()) {
    const worksheetName = LocalStorage.getCurrentWorksheet();
    const firstWorksheet = worksheetsGlobal[worksheetName];
    worksheetSelect.value = worksheetName;
    tableMain.updateTable(firstWorksheet.headers, firstWorksheet.data);
  } else {
    const firstWorksheet = worksheetsGlobal[Object.keys(worksheets)[0]];
    LocalStorage.saveCurrentWorksheet(Object.keys(worksheets)[0]);
    tableMain.updateTable(firstWorksheet.headers, firstWorksheet.data);
  }
  const extraWorkbook = LocalStorage.getExtraWorkbook()
  if (extraWorkbook) {
    const firstWorksheet = extraWorkbook[Object.keys(extraWorkbook)[0]];
    tableExtra.updateTable(firstWorksheet.headers, firstWorksheet.data);
  }
}

btnExcelBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const worksheets = await getExcelData(inputTypeFile.files[0]);

  LocalStorage.saveWorkbook(worksheets);
  LocalStorage.deleteCurrentWorksheet();
  loadDocument(worksheets);
});

worksheetSelect.addEventListener("change", (e) => {
  if (worksheetsGlobal) {
    if (!isExtra) {
      const worksheet = worksheetsGlobal[e.target.value];
      LocalStorage.saveCurrentWorksheet(e.target.value);
      tableMain.updateTable(worksheet.headers, worksheet.data);
    } else {
      const worksheets = LocalStorage.getExtraWorkbook();
      const worksheet = worksheets[e.target.value];
      tableExtra.updateTable(worksheet.headers, worksheet.data);
    }
  }
});

function updateSelectionOptions(worksheets) {
  worksheetSelect.innerHTML = "";
  for (let name of Object.keys(worksheets)) {
    const option = document.createElement("option");
    option.value = name;
    option.innerText = name;
    worksheetSelect.append(option);
  }
  worksheetSelect.value = LocalStorage.getCurrentWorksheet()
}

window.addEventListener("load", () => {
  const worksheets = LocalStorage.getWorkbook();
  if (worksheets) {
    loadDocument(worksheets);
  }
});

saveExcelBtn.addEventListener("click", () => {
  saveExcel();
});

saveExtraBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const worksheets = await getExcelData(inputExtraFile.files[0]);
  LocalStorage.saveExtraWorkbook(worksheets);
  updateSelectionOptions(worksheets);
  const firstWorksheet = worksheets[Object.keys(worksheets)[0]];
  tableExtra.updateTable(firstWorksheet.headers, firstWorksheet.data);
});

mainTabBtn.addEventListener("click", (e) => {
  showMainTable();
});

extraTabBtn.addEventListener("click", (e) => {
  showExtraTable();
});
