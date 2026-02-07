import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ComprehensiveIncome = ({ startDate, endDate, financialPositionReports }) => {
  let totalPrevIncome = 0;
  let totalCurrIncome = 0;
  let totalPrevOtherIncome = 0;
  let totalCurrOtherIncome = 0;
  let totalPrevExpenses = 0;
  let totalCurrExpenses = 0;

  // Calculate totals for the Gross Surplus / Loss row
  Object.values(financialPositionReports).forEach((items) => {
    items.forEach((item) => {
      const categoryCode = item.reportCategoryCode;

      if (categoryCode === "1") {
        totalPrevIncome += Number(item.prevAmt || 0);
        totalCurrIncome += Number(item.currAmt || 0);
      } else if (categoryCode === "2") {
        totalPrevOtherIncome += Number(item.prevAmt || 0);
        totalCurrOtherIncome += Number(item.currAmt || 0);
      } else if (categoryCode === "3") {
        totalPrevExpenses += Number(item.prevAmt || 0);
        totalCurrExpenses += Number(item.currAmt || 0);
      }
    });
  });

  const prevGross = totalPrevIncome + totalPrevOtherIncome - totalPrevExpenses;
  const currGross = totalCurrIncome + totalCurrOtherIncome - totalCurrExpenses;
  const varianceGross = currGross - prevGross;

  // -------------------------------------------------------
  // 📌 EXPORT TO PDF
  // -------------------------------------------------------
  const exportPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");

    doc.text("Comprehensive Income Report", 40, 30);

    const tableData = [];
    const tableHeaders = ["S/N", "Description", "Note", startDate, endDate, "Variance"];

    Object.keys(financialPositionReports).forEach((category) => {
      tableData.push([category, "", "", "", "", ""]);

      financialPositionReports[category].forEach((item) => {
        tableData.push([
          item.sn,
          item.description,
          item.note,
          Number(item.prevAmt).toLocaleString(),
          Number(item.currAmt).toLocaleString(),
          (item.currAmt - item.prevAmt).toLocaleString(),
        ]);
      });

      const totalPrevAmt = financialPositionReports[category].reduce(
        (sum, x) => sum + Number(x.prevAmt || 0),
        0
      );

      const totalCurrAmt = financialPositionReports[category].reduce(
        (sum, x) => sum + Number(x.currAmt || 0),
        0
      );

      tableData.push([
        "",
        `Total ${category}`,
        "",
        totalPrevAmt.toLocaleString(),
        totalCurrAmt.toLocaleString(),
        (totalCurrAmt - totalPrevAmt).toLocaleString(),
      ]);
    });

    tableData.push([
      "",
      "Gross Surplus / Loss",
      "",
      prevGross.toLocaleString(),
      currGross.toLocaleString(),
      varianceGross.toLocaleString(),
    ]);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 50,
    });

    doc.save("Comprehensive_Income_Report.pdf");
  };

  // -------------------------------------------------------
  // 📌 EXPORT TO EXCEL
  // -------------------------------------------------------
  const exportExcel = () => {
    const rows = [];

    Object.keys(financialPositionReports).forEach((category) => {
      rows.push({ Category: category });

      financialPositionReports[category].forEach((item) => {
        rows.push({
          SN: item.sn,
          Description: item.description,
          Note: item.note,
          [startDate]: item.prevAmt,
          [endDate]: item.currAmt,
          Variance: item.currAmt - item.prevAmt,
        });
      });

      const totalPrevAmt = financialPositionReports[category].reduce(
        (sum, x) => sum + Number(x.prevAmt || 0),
        0
      );

      const totalCurrAmt = financialPositionReports[category].reduce(
        (sum, x) => sum + Number(x.currAmt || 0),
        0
      );

      rows.push({
        SN: "",
        Description: `Total ${category}`,
        Note: "",
        [startDate]: totalPrevAmt,
        [endDate]: totalCurrAmt,
        Variance: totalCurrAmt - totalPrevAmt,
      });
    });

    rows.push({
      SN: "",
      Description: "Gross Surplus / Loss",
      Note: "",
      [startDate]: prevGross,
      [endDate]: currGross,
      Variance: varianceGross,
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "Comprehensive_Income_Report.xlsx");
  };

  return (
    <div>
      <div className="d-flex gap-2 mb-3 justify-content-end">
        <button 
         className="btn btn-md rounded-4 text-white px-4 fs-6"
            style={{ backgroundColor: "#033E96" }} onClick={exportExcel}>
          Export Excel
        </button>
        <button className="btn btn-md rounded-4 px-4 fs-6 border" onClick={exportPDF}>
          Export PDF
        </button>
      </div>

      <div className="table-responsive" id="customers">
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>S/N</th>
              <th>Description</th>
              <th>Note</th>
              <th>{startDate}</th>
              <th>{endDate}</th>
              <th>Variance</th>
            </tr>
          </thead>

          {Object.keys(financialPositionReports).map((reportCategory) => {
            const items = financialPositionReports[reportCategory];

            const totalPrevAmt = items.reduce((sum, item) => sum + Number(item.prevAmt || 0), 0);
            const totalCurrAmt = items.reduce((sum, item) => sum + Number(item.currAmt || 0), 0);
            const totalVariance = totalCurrAmt - totalPrevAmt;

            return (
              <tbody key={reportCategory}>
                <tr>
                  <td colSpan="6" style={{ color: "#0452C8", backgroundColor: "#F5F9FF" }}>
                    {reportCategory}
                  </td>
                </tr>

                {items.map((loan) => (
                  <tr key={loan.sn}>
                    <td>{loan.sn}</td>
                    <td>{loan.description}</td>
                    <td>{loan.note}</td>
                    <td>{Number(loan.prevAmt).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td>{Number(loan.currAmt).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td>{(loan.currAmt - loan.prevAmt).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}

                <tr style={{ fontWeight: "bold", backgroundColor: "#eaf2ff" }}>
                  <td colSpan="3">Total {reportCategory}</td>
                  <td>{totalPrevAmt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td>{totalCurrAmt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td>{totalVariance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            );
          })}

          {/* GROSS SURPLUS ROW */}
          <tbody>
            <tr style={{ fontWeight: "bold", backgroundColor: "#FFF8DC" }}>
              <td colSpan="3" className="text-danger">Gross Surplus / Loss</td>
              <td className="text-danger">{prevGross.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td className="text-danger">{currGross.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td className="text-danger">{varianceGross.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComprehensiveIncome;
