import LocalStorage from "./localstorage";
import { rgb2hex } from "./utils";

const CLASS_INPUT_CELL_EDIT = "input-cell-edit";
const SELECTOR_INPUT_CELL_EDIT = `.${CLASS_INPUT_CELL_EDIT}`;

class TableComponent {
  constructor(tableSelector) {
    this.table = document.querySelector(tableSelector);
    this.tableHead = this.table.querySelector("thead");
    this.tableBody = this.table.querySelector("tbody");
    this.isEditCheckbox = document.getElementById("edit-toggle");

    this.table.addEventListener("click", (e) => {
      if (!this.isEditCheckbox.checked) return;
      if (e.target.nodeName === "TD" && !e.target.dataset.isEdit) {
        for (const input of document.querySelectorAll(SELECTOR_INPUT_CELL_EDIT)) {
          const text = input.value;
          const parent = input.parentElement;
          input.remove();
          parent.innerText = text;
          delete parent.dataset.isEdit;
        }
        const cellElement = e.target;
        const rowId = cellElement.dataset.idRow;
        const keyValue = cellElement.dataset.columnName;
        LocalStorage.setCurrentCell(rowId, keyValue);
    
        const input = document.createElement("textarea");
        input.classList.add(CLASS_INPUT_CELL_EDIT);
        input.value = cellElement.innerText;
        const originalValue = cellElement.innerText;
        input.addEventListener("keydown", (e) => {
          if (e.code === "Enter") {
            const { idRow, columnName } = LocalStorage.getCurrentCell();
            const text = input.value;
            LocalStorage.patchValue(
              LocalStorage.getCurrentWorksheet(),
              parseInt(idRow),
              columnName,
              text
            );
            input.remove();
            cellElement.innerText = text;
            delete cellElement.dataset.isEdit;
          }
          if (e.code === "Escape") {
            input.remove();
            cellElement.innerText = originalValue;
            delete cellElement.dataset.isEdit;
          }
        });
        cellElement.innerText = "";
        cellElement.append(input);
        input.focus();
        cellElement.dataset.isEdit = true;
    
        const colorPicker = document.createElement("color-picker");
        colorPicker.style.position = "absolute";
        if (cellElement.style.backgroundColor) {
          colorPicker.setAttribute(
            "value",
            rgb2hex(cellElement.style.backgroundColor)
          );
        }
        cellElement.append(colorPicker);
        colorPicker.style.top = -colorPicker.clientHeight + 30 + "px";
        colorPicker.style.right = -colorPicker.clientWidth - 10 + "px";
        colorPicker.addEventListener("click", (e) => {
          e.stopPropagation();
        });
        colorPicker.addEventListener("change", (e) => {
          const choiceColor = e.detail;
          cellElement.style.backgroundColor = "#" + choiceColor;
          const { idRow, columnName } = LocalStorage.getCurrentCell();
          LocalStorage.patchColor(
            LocalStorage.getCurrentWorksheet(),
            parseInt(idRow),
            columnName,
            choiceColor
          )
          colorPicker.remove();
        });
      }
    });
  }

  updateTable(headers, data) {
    console.log(this.table)
    this._updateTableHead(headers);
    this._updateTableBody(data, headers);
  }

  _updateTableBody(data, headers) {
    this.tableBody.innerHTML = "";
    data.map((row, index) => {
      const tr = document.createElement("tr");
      headers.map((header) => {
        const td = document.createElement("td");
        td.dataset.idRow = row.id;
        td.dataset.columnName = header;
        td.innerText = row[header]?.value ?? "";
        td.style.backgroundColor = "#" + row[header]?.style.bg;
        tr.append(td);
      });
      this.tableBody.append(tr);
    });
    console.log(this.tableBody)
  }

  _updateTableHead(headers) {
    this.tableHead.innerHTML = "";
    const tr = document.createElement("tr");
    headers.map((header, index) => {
      const th = document.createElement("th");
      th.innerText = header.startsWith("_") ? "" : header;
      tr.append(th);
    });
    this.tableHead.append(tr);
  }
}

export default TableComponent;