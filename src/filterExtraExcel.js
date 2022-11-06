import LocalStorage from "./localstorage";

export function filterExtraExcel(name) {
  const extraExcel = LocalStorage.getExtraWorkbook();
  for (const sheet of Object.keys(extraExcel)) {
    extraExcel[sheet].data = extraExcel[sheet].data.filter((row) => {
      if (!row["Фамилия"]?.value) return false;
      return row["Фамилия"].value === name;
    });
    if (extraExcel[sheet].data.length === 0) {
      delete extraExcel[sheet];
    }
  }
  return extraExcel;
}
