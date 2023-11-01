import excelJS from 'exceljs';
import {saveAs} from "file-saver";


export function getTableData(items) {
    const headerColumns = [];
      let rows = [];
    for (let i = 0; i < items.length; i++) {
        let contentRow = [];
        for (let j = 0; j < items[i].querySelectorAll("th").length; j++) {
          headerColumns.push({
            header: items[i].querySelectorAll("th")[j].innerText, 
            key: items[i].querySelectorAll("th")[j].innerText.toLowerCase(),
            width: 10
          });
        }
        for (let j = 0; j < items[i].querySelectorAll("td").length; j++) {
          contentRow.push(items[i].querySelectorAll("td")[j].innerText);
        }
        if(contentRow.length) {
          rows.push(contentRow);
        }
      }   
      return [headerColumns, rows];
}

export async function exportToExcelFile(name, headers, rows) {
    const workbook = new excelJS.Workbook();
    const workSheet = workbook.addWorksheet(name);
    workSheet.columns = headers;
    workSheet.addRows(rows);
    const buffer = await workbook.xlsx.writeBuffer();
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const fileExtension = '.xlsx';
    const blob = new Blob([buffer], {type: fileType});
    saveAs(blob, `${name.toLowerCase()}${fileExtension}`);
}