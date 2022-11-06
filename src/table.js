import LocalStorage from "./localstorage";
import TableComponent from './tableComponent';

const CLASS_INPUT_CELL_EDIT = "input-cell-edit";
const SELECTOR_INPUT_CELL_EDIT = `.${CLASS_INPUT_CELL_EDIT}`;

const isEditCheckbox = document.getElementById("edit-toggle");
document.addEventListener("click", (e) => {
  if (!isEditCheckbox.checked) return;
  if (e.target.nodeName !== "TEXTAREA" && e.target.nodeName !== "TD") {
    for (const input of document.querySelectorAll(SELECTOR_INPUT_CELL_EDIT)) {
      const { idRow, columnName } = LocalStorage.getCurrentCell();
      const text = input.value;
      LocalStorage.patchValue(
        LocalStorage.getCurrentWorksheet(),
        parseInt(idRow),
        columnName,
        text
      );
      const parent = input.parentElement;
      input.remove();
      parent.innerText = text;
      delete parent.dataset.isEdit;
    }
  }
});

export const tableMain = new TableComponent("#table");
export const tableExtra = new TableComponent("#table-extra");
