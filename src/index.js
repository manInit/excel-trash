import "./style.css";
import './components/';
import { getExcelData } from "./getExcelData";
import { updateTable } from "./table";

const btnExcelBtn = document.getElementById("excel-load");
const inputTypeFile = document.getElementById("excel-file-input");
const worksheetSelect = document.getElementById("worksheet-select");

let worksheetsGlobal = null;

function loadDocument(worksheets) {
  worksheetsGlobal = worksheets;
  updateSelectionOptions(worksheets);

  const firstWorksheet = worksheetsGlobal[Object.keys(worksheets)[0]];
  updateTable(firstWorksheet.headers, firstWorksheet.data);
}

btnExcelBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const worksheets = await getExcelData(inputTypeFile.files[0]);

  localStorage.setItem("worksheet", JSON.stringify(worksheets));

  loadDocument(worksheets)
});

worksheetSelect.addEventListener("change", (e) => {
  if (worksheetsGlobal) {
    const worksheet = worksheetsGlobal[e.target.value];
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

window.addEventListener('load', () => {
  const worksheets = localStorage.getItem('worksheet')
  if (worksheets) { 
    loadDocument(JSON.parse(worksheets))
  }
})