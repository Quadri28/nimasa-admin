import * as XLSX from 'xlsx';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"

const FinancialPositionNote = ({ startDate, endDate, financialPositionNoteReports }) => {

  // Export to Excel
  const exportToExcel = () => {
  const workbook = XLSX.utils.book_new();

  Object.keys(financialPositionNoteReports).forEach(itemDesc => {

    const data = financialPositionNoteReports[itemDesc].map(loan => ({
      'Item Code': loan.itemCode,
      [startDate]: loan.prevAmt,
      [endDate]: loan.currAmt,
      'Variance': loan.currAmt - loan.prevAmt
    }));

    const ws = XLSX.utils.json_to_sheet(data);

    // Sanitize sheet name
    const safeSheetName = itemDesc
      .replace(/[:\\\/\?\*\[\]]/g, "") // remove invalid characters
      .substring(0, 31);

    XLSX.utils.book_append_sheet(workbook, ws, safeSheetName);
  });

  XLSX.writeFile(workbook, `FinancialPositionNote_${startDate}_to_${endDate}.xlsx`);
};


  // Export to PDF
 const exportToPDF = () => {
  const doc = new jsPDF();

  Object.keys(financialPositionNoteReports).forEach((itemDesc, idx) => {
    if (idx !== 0) doc.addPage();

    doc.setFontSize(14);
    doc.text(itemDesc, 14, 20);

    const tableColumn = ["Item Code", startDate, endDate, "Variance"];
    const tableRows = financialPositionNoteReports[itemDesc].map((loan) => [
      loan.itemCode,
      loan.prevAmt.toFixed(2),
      loan.currAmt.toFixed(2),
      (loan.currAmt - loan.prevAmt).toFixed(2),
    ]);

    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
    });
  });

  doc.save(`FinancialPositionNote_${startDate}_to_${endDate}.pdf`);
};

  return (
    <div>
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

      <div className='table-responsive' id='customers'>
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Note</th>
              <th>{startDate}</th>
              <th>{endDate}</th>
              <th>Variance</th>
            </tr>
          </thead>
          {Object.keys(financialPositionNoteReports)?.map(itemDesc => (
            <tbody key={itemDesc}>
              <tr>
                <td colSpan="4" style={{ color: '#0452C8', backgroundColor: '#F5F9FF' }}>
                  {itemDesc}
                </td>
              </tr>
              {financialPositionNoteReports[itemDesc]?.map(loan => (
                <tr key={loan.sn}>
                  <td>{loan.itemCode}</td>
                  <td>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(loan.prevAmt)}</td>
                  <td>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(loan.currAmt)}</td>
                  <td>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(loan.currAmt - loan.prevAmt)}</td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
};

export default FinancialPositionNote;
