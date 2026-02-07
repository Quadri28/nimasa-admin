import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ListOfBalances = ({ groupedLoans }) => {
  // =======================
  // EXPORT TO PDF FUNCTION
  // =======================
  const exportToPDF = () => {
    const doc = new jsPDF("p", "pt"); // portrait, points

    doc.setFontSize(16);
    doc.text("List of Balances Report", 40, 40);

    // Convert data for PDF table
    const tableRows = [];

    Object.keys(groupedLoans).forEach((groupName) => {
      // Section header row
      tableRows.push([
        { content: groupName, colSpan: 4, styles: { halign: "left", fillColor: "#F5F9FF" } }
      ]);

      // Actual item rows
      groupedLoans[groupName].forEach((loan) => {
        tableRows.push([
          loan.sn,
          loan.description,
          new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(loan.cr),
          new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(loan.dr),
        ]);
      });
    });

    // AutoTable
    autoTable(doc, {
      startY: 60,
      head: [["S/N", "Description", "CR", "DR"]],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 5 },
      headStyles: { fillColor: "#0452C8", textColor: "#fff" },
    });

    doc.save("list_of_balances_report.pdf");
  };

   const exportToExcel = () => {
    const sheetData = [];
    sheetData.push(["List Of Balances"]);
    sheetData.push([]);
    sheetData.push(["S/N", "Description", "CR", "DR"]);

    Object.keys(groupedLoans || {}).forEach((reportName) => {
      sheetData.push([reportName]);
      sheetData.push(["S/N", "Description", "CR", "DR"]);

      (groupedLoans[reportName] || []).forEach((loan) => {
        sheetData.push([
          loan.sn ?? "",
          loan.description ?? "",
          Number(loan.cr || 0),
          Number(loan.dr || 0),
        ]);
      });

      sheetData.push([]);
    });

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    ws["!cols"] = [{ wch: 6 }, { wch: 40 }, { wch: 15 }, { wch: 15 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ListOfBalances");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), `List_Of_Balances.xlsx`);
  };

  // ================================
  // RENDERED TABLE + EXPORT BUTTON
  // ================================
  return (
    <div>
      {/* EXPORT BUTTON */}
      <div className="d-flex gap-2 mb-3 justify-content-end">
        <button 
         className="btn btn-md rounded-5 text-white px-4 fs-6"
            style={{ backgroundColor: "var(--custom-color)" }} onClick={exportToExcel}>
          Export Excel
        </button>
        <button className="btn btn-md rounded-5 px-4 fs-6 border" onClick={exportToPDF}>
          Export PDF
        </button>
      </div>

      {/* TABLE */}
      <div className="table-responsive" id="customers">
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>S/N</th>
              <th>Description</th>
              <th>CR</th>
              <th>DR</th>
            </tr>
          </thead>

          {Object.keys(groupedLoans).map((reportName) => (
            <tbody key={reportName}>
              <tr>
                <td
                  style={{ backgroundColor: "#F5F9FF", color: "#0452C8" }}
                  colSpan={4}
                >
                  {reportName}
                </td>
              </tr>

              {groupedLoans[reportName].map((loan) => (
                <tr key={loan.sn}>
                  <td>{loan.sn}</td>
                  <td>{loan.description}</td>
                  <td>
                    {new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(loan.cr)}
                  </td>
                  <td>
                    {new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(loan.dr)}
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
};

export default ListOfBalances;
