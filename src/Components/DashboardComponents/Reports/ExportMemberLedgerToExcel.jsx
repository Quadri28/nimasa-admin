import * as XLSX from "xlsx";
import { saveAs } from "file-saver"

export const  exportToExcel = (currentRecord) => {
    if (!currentRecord || currentRecord.length === 0) {
      alert("No data to export.");
      return;
    }
  
    const account = currentRecord[0]; // Assuming one account record
  
    // Define the structured data for Excel
    const sheetData = [
      ["Account Details"], // Header
      ["Account Name:", account.accountName.trim()],
      ["Account Number:", account.accountNumber],
      [],
      ["Summary Details"], // Header
      ["Branch:", account.branchName],
      ["Opening Balance:", account.openingBalance || 0],
      ["Closing Balance:", account.closingBalance || 0],
      ["Product Name:", account.productName || ""],
      [],
      ["Transactions"], // Transactions Table Header
      ["Date", "Transaction Details", "Reference", "Value Date", "Dr", "Cr", "Balance"],
      ...account.memberLedgers.map((ledger) => [
        ledger.date || "",
        ledger.transactionDetail || "",
        ledger.reference || "",
        ledger.valueDate || "",
        ledger.dr || 0,
        ledger.cr || 0,
        ledger.balance || 0,
      ]),
    ];
  
    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
  
    // Merge headers to span multiple columns
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // "Account Details" title
      { s: { r: 4, c: 0 }, e: { r: 4, c: 6 } }, // "Summary Detail" title
      { s: { r: 9, c: 0 }, e: { r: 9, c: 6 } }, // "Transactions" title
    ];
  
    // Set column widths for better visibility
    ws["!cols"] = [
      { wch: 15 }, // Date
      { wch: 40 }, // Transaction Details
      { wch: 15 }, // Reference
      { wch: 15 }, // Value Date
      { wch: 10 }, // Dr
      { wch: 10 }, // Cr
      { wch: 15 }, // Balance
    ];
  
    // Create workbook and export file
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Member Ledger");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `Member_Ledger_${account.accountNumber}.xlsx`);
  };
