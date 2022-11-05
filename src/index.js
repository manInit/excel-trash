import "./style.css";
import "./components/";
import { getExcelData } from "./getExcelData";
import { updateTable } from "./table";
import LocalStorage from "../localstorage";

const btnExcelBtn = document.getElementById("excel-load");
const inputTypeFile = document.getElementById("excel-file-input");
const worksheetSelect = document.getElementById("worksheet-select");

let worksheetsGlobal = null;

function loadDocument(worksheets) {
  worksheetsGlobal = worksheets;
  updateSelectionOptions(worksheets);
  if (LocalStorage.getCurrentWorksheet()) {
    const worksheetName = LocalStorage.getCurrentWorksheet();
    const firstWorksheet = worksheetsGlobal[worksheetName];
    worksheetSelect.value = worksheetName;
    updateTable(firstWorksheet.headers, firstWorksheet.data);
  } else {
    const firstWorksheet = worksheetsGlobal[Object.keys(worksheets)[0]];
    LocalStorage.saveCurrentWorksheet(Object.keys(worksheets)[0]);
    updateTable(firstWorksheet.headers, firstWorksheet.data);
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
    const worksheet = worksheetsGlobal[e.target.value];
    LocalStorage.saveCurrentWorksheet(e.target.value);
    updateTable(worksheet.headers, worksheet.data);
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
}

window.addEventListener("load", () => {
  const worksheets = LocalStorage.getWorkbook();
  if (worksheets) {
    loadDocument(worksheets);
  }
});
