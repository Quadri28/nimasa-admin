import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { CSVLink } from "react-csv";
import { LiaTimesCircle } from "react-icons/lia";

const MemberReport = () => {
  const [reports, setReports] = useState([]);
  const { credentials } = useContext(UserContext);

  const getReports = () => {
    axios("Reports/member-details-report", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => {
      if (resp.data.data.memberDetails) {
        setReports(resp.data.data.memberDetails);
      }
    });
  };

  useEffect(() => {
    getReports();
  }, []);

  const column = [
    { Header: "Member ID", accessor: "employeeId" },
    { Header: "Surname", accessor: "surname" },
    { Header: "First Name", accessor: "firstName" },
    { Header: "Dob/RCNo", accessor: "dobrcNo" },
    { Header: "Gender", accessor: "gender" },
    { Header: "Email", accessor: "email" },
    { Header: "Bank", accessor: "bank" },
    { Header: "Account Name", accessor: "accountName" },
    { Header: "Account No", accessor: "accountNo" },
  ];
  const columns = useMemo(() => column, []);

  const tableInstance = useTable(
    {
      columns: columns,
      data: reports,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    page,
    prepareRow,
    headerGroups,
    state,
    setGlobalFilter,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
  } = tableInstance;
  const { globalFilter, pageIndex } = state;

  return (
    <>
      <div className="d-sm-flex gap-3 justify-content-between align-items-center my-3">
        <form className="search-form w-100 my-2">
          <input
            type="text"
            name="search"
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search anything"
            className="p-3 search-inputs w-100"
          />
        </form>
        <CSVLink data={reports} filename={"memberReports.csv"}>
          <button
            className="btn btn-md rounded-4 text-white px-4 fs-6"
            style={{ backgroundColor: "var(--custom-color)" }}
          >
            Export
          </button>
        </CSVLink>
      </div>
      <div className="table-responsive">
        <table {...getTableProps()} id="customers" className="table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {reports.length > 0 && (
            <tbody {...getTableBodyProps()}>
              {page.map((row, index) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
        {reports.length < 1 ? (
          <div className="d-flex justify-content-center flex-column">
            <LiaTimesCircle className="mx-auto" size={30} />
            <p className="text-center">No record yet</p>
          </div>
        ) : (
          <div className="d-flex justify-content-center gap-3 mt-2 align-items-center">
            <button
              onClick={() => gotoPage(0)}
              className="px-2 py-1 rounded-3 border-0 pagination-btn"
              disabled={!canPreviousPage}
            >
              {"<<"}
            </button>
            <button
              disabled={!canPreviousPage}
              className="px-2 py-1 rounded-3 border-0 pagination-btn"
            >
              {" "}
              <FaAngleLeft onClick={() => previousPage()} />{" "}
            </button>
            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
            </span>
            <button
              disabled={!canNextPage}
              className="px-2 py-1 rounded-3 border-0 pagination-btn"
            >
              <FaAngleRight onClick={() => nextPage()} />
            </button>
            <button
              onClick={() => gotoPage(pageCount - 1)}
              className="px-2 py-1 rounded-3 border-0 pagination-btn"
              disabled={!canNextPage}
            >
              {">>"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MemberReport;
