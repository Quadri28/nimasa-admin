import React from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const FinancialPosition = ({ financialPositionReports, startDate, endDate }) => {
  // ================================
  // EXPORT TO EXCEL
  // ================================
  const exportToExcel = () => {
    const rows = [];

    Object.keys(financialPositionReports).forEach((category) => {
      const items = financialPositionReports[category];

      rows.push({ Category: category });

      items.forEach((item) => {
        rows.push({
          SN: item.sn,
          Description: item.description,
          Note: item.note,
          [startDate]: item.prevAmt,
          [endDate]: item.currAmt,
          Variance: item.currAmt - item.prevAmt,
        });
      });

      const totalCurr = items.reduce((s, i) => s + Number(i.currAmt || 0), 0);
      const totalPrev = items.reduce((s, i) => s + Number(i.prevAmt || 0), 0);

      rows.push({
        SN: "",
        Description: `Total ${category}`,
        Note: "",
        [startDate]: totalPrev,
        [endDate]: totalCurr,
        Variance: totalCurr - totalPrev,
      });

      rows.push({});
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Financial Report");
    XLSX.writeFile(wb, "financial_position_report.xlsx");
  };

  // ================================
  // EXPORT TO PDF
  // ================================
   const exportToPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");

    doc.setFontSize(16);
    doc.text("Financial Position Report", 40, 40);

    Object.keys(financialPositionReports).forEach((reportCategory, index) => {
      const items = financialPositionReports[reportCategory];

      const body = items.map(item => [
        item.sn,
        item.description,
        item.note,
        new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(item.prevAmt),
        new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(item.currAmt),
        new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(item.currAmt - item.prevAmt),
      ]);

      // Calculate totals
      const totalPrevAmt = items.reduce((sum, i) => sum + Number(i.prevAmt || 0), 0);
      const totalCurrAmt = items.reduce((sum, i) => sum + Number(i.currAmt || 0), 0);
      const totalVariance = totalCurrAmt - totalPrevAmt;

      body.push([
        "",
        `Total ${reportCategory}`,
        "",
        new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(totalPrevAmt),
        new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(totalCurrAmt),
        new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(totalVariance),
      ]);

      autoTable(doc, {
        startY: 80 + index * 10,
        head: [[
          "S/N",
          "Description",
          "Note",
          startDate,
          endDate,
          "Variance"
        ]],
        body: body,
        theme: "grid",
        margin: { top: 60 },
        headStyles: {
          fillColor: [4, 82, 200],
        },
      });
    });

    doc.save("financial-position.pdf");
  };

  return (
    <>
      {/* Buttons */}
      <div className="d-flex gap-2 mb-3 justify-content-end">
        <button 
         className="btn btn-md rounded-4 text-white px-4 fs-6"
            style={{ backgroundColor: "#033E96" }} onClick={exportToExcel}>
          Export Excel
        </button>
        <button className="btn btn-md rounded-4 px-4 fs-6 border" onClick={exportToPDF}>
          Export PDF
        </button>
      </div>

      {/* Table */}
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

            const totalCurrAmt = items.reduce(
              (sum, item) => sum + Number(item.currAmt || 0),
              0
            );
            const totalPrevAmt = items.reduce(
              (sum, item) => sum + Number(item.prevAmt || 0),
              0
            );

            const totalVariance = totalCurrAmt - totalPrevAmt;

            return (
              <tbody key={reportCategory}>
                {/* Category Row */}
                <tr>
                  <td colSpan="6"
                      style={{
                        color: "#0452C8",
                        backgroundColor: "#F5F9FF",
                        fontWeight: "bold",
                      }}
                  >
                    {reportCategory}
                  </td>
                </tr>

                {/* Items */}
                {items.map((loan) => (
                  <tr key={loan.sn}>
                    <td>{loan.sn}</td>
                    <td>{loan.description}</td>
                    <td>{loan.note}</td>
                    <td>
                      {new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 2,
                      }).format(loan.prevAmt)}
                    </td>
                    <td>
                      {new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 2,
                      }).format(loan.currAmt)}
                    </td>
                    <td>
                      {new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 2,
                      }).format(loan.currAmt - loan.prevAmt)}
                    </td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr style={{ fontWeight: "bold", backgroundColor: "#eaf2ff" }}>
                  <td colSpan="3">Total {reportCategory}</td>
                  <td>
                    {new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                    }).format(totalPrevAmt)}
                  </td>
                  <td>
                    {new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                    }).format(totalCurrAmt)}
                  </td>
                  <td>
                    {new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                    }).format(totalVariance)}
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
    </>
  );
};

export default FinancialPosition;
