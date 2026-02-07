import React from "react";

const ExportToExcel = ({ fileName, customName, data }) => {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, customName);

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, fileName);
  };
  return (
    <div>
      <button
        className="btn btn-md text-white"
        style={{ backgroundColor: "#033E96" }}
        onClick={exportToExcel}
      >
        Export
      </button>
    </div>
  );
};

export default ExportToExcel;
