const table = document.getElementById("table");
const tableHead = table.querySelector("thead");
const tableBody = table.querySelector("tbody");

const rgb2hex = (rgb) => `${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).toUpperCase().padStart(2, '0')).join('')}`

const CLASS_INPUT_CELL_EDIT = "input-cell-edit";
const SELECTOR_INPUT_CELL_EDIT = `.${CLASS_INPUT_CELL_EDIT}`;

document.addEventListener('click', (e) => {
  if (e.target.nodeName !== 'TEXTAREA' && e.target.nodeName !== 'TD') {
    for (const input of document.querySelectorAll(SELECTOR_INPUT_CELL_EDIT)) {
      const text = input.value;
      const parent = input.parentElement;
      input.remove();
      parent.innerText = text;
      delete parent.dataset.isEdit;
    }
  }
})

table.addEventListener("click", (e) => {
  if (e.target.nodeName === "TD" && !e.target.dataset.isEdit) {
    console.log("start");
    for (const input of document.querySelectorAll(SELECTOR_INPUT_CELL_EDIT)) {
      const text = input.value;
      const parent = input.parentElement;
      input.remove();
      parent.innerText = text;
      delete parent.dataset.isEdit;
    }
    const cellElement = e.target;
    const input = document.createElement("textarea");
    input.classList.add(CLASS_INPUT_CELL_EDIT);
    input.value = cellElement.innerText;
    const originalValue = cellElement.innerText;
    input.addEventListener("keydown", (e) => {
      if (e.code === "Enter") {
        const text = input.value;
        input.remove();
        cellElement.innerText = text;
        delete cellElement.dataset.isEdit;
      }
      if (e.code === 'Escape') {
        input.remove();
        cellElement.innerText = originalValue;
        delete cellElement.dataset.isEdit;
      }
    });
    cellElement.innerText = "";
    cellElement.append(input);
    input.focus();
    cellElement.dataset.isEdit = true;

    const colorPicker = document.createElement('color-picker');
    colorPicker.style.position = 'absolute'
    if (cellElement.style.backgroundColor) {
      colorPicker.setAttribute('value', rgb2hex((cellElement.style.backgroundColor)))
    }
    cellElement.append(colorPicker)
    colorPicker.style.top = -colorPicker.clientHeight + 30 + 'px';
    colorPicker.style.right =  -colorPicker.clientWidth - 10 + 'px';
    colorPicker.addEventListener('click', e => {
      e.stopPropagation()
    })
    colorPicker.addEventListener('change', (e) => {
      const choiceColor = e.detail
      cellElement.style.backgroundColor = '#' + choiceColor
      colorPicker.remove()
    })
  }
});

function updateTableHead(headers) {
  tableHead.innerHTML = "";
  const tr = document.createElement("tr");
  headers.map((header, index) => {
    const th = document.createElement("th");
    th.innerText = header.startsWith("_") ? "" : header;
    tr.append(th);
  });
  tableHead.append(tr);
}

function updateTableBody(data, headers) {
  tableBody.innerHTML = "";
  data.map((row, index) => {
    const tr = document.createElement("tr");
    headers.map((header) => {
      const td = document.createElement("td");
      td.innerText = row[header]?.value ?? "";
      td.style.backgroundColor = "#" + row[header]?.style.bg;
      tr.append(td);
    });
    tableBody.append(tr);
  });
}

function updateTable(headers, data) {
  updateTableHead(headers);
  updateTableBody(data, headers);
}

export { updateTable };
