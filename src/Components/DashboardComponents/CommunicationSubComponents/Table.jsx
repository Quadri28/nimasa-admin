import React from "react";
import {
  useTable,
  usePagination,
  useSortBy,
  useGlobalFilter,
} from "react-table";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import {LiaTimesCircle} from 'react-icons/lia'

const Table = ({
  columns,
  data,
  pageCount: controlledPageCount,
  pageNumber,
  setPageNumber,
  searchQuery,
  setSearchQuery,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    // setGlobalFilter,
    // setPageSize,
    state: {  pageSize, globalFilter },
  } = useTable(
    {
      columns,
      data,
      manualPagination: true, // ✅ Enable manual pagination
      pageCount: controlledPageCount, // ✅ Ensure pageCount comes from API
    },
    // useGlobalFilter,
    useSortBy,
    usePagination
  );

 
  return (
    <>
      {/* Search Input */}
      <div className="d-flex align-items-center my-3">
        <form className="search-form my-1 w-100">
          <input
            type="text"
            value={searchQuery}
          onChange={(e) => {
              setSearchQuery(e.target.value);
              setPageNumber(0); // reset to first page on new search
            }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setPageNumber(0); // Reset to first page on new search
          }
        }}
            placeholder="Search anything"
            className="w-100"
          />
        </form>
      </div>

      {/* Table */}
      <div className="table-responsive" style={{borderRadius:'10px 10px 0 0'}}>
        <table {...getTableProps()} id="customers" className="table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())} // 🔥 Enable sorting on click
                    style={{ cursor: "pointer", border:'solid 1px #e6e6e6', borderRadius:'5px 5px 0 0'}}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽" // Descending
                          : " 🔼" // Ascending
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* Table Body */}
          {data.length > 0 && (
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>

        {/* No Data Message */}
        {data.length < 1 && (
          <div className="d-flex flex-column justify-content-center">
            <LiaTimesCircle size={30} className="text-center mx-auto"/>
            <p className="text-center">No record yet</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {data.length > 0 && (
        <div className="d-flex justify-content-center gap-3 mt-2 align-items-center">
        <button onClick={() => setPageNumber(0)} disabled={pageNumber === 0}
         className="px-2 py-1 rounded-3 border-0 pagination-btn">
          {"<<"}
        </button>
        <button onClick={() => setPageNumber(prev => Math.max(prev - 1, 0))} 
          disabled={pageNumber === 0} className="px-2 py-1 rounded-3 border-0 pagination-btn"
        >
          {"<"}
        </button>
        <span>
          Page <strong>{pageNumber + 1} of {pageCount}</strong>
        </span>
        <button onClick={() => setPageNumber(prev => Math.min(prev + 1, controlledPageCount - 1))}
    disabled={pageNumber >= controlledPageCount - 1} className="px-2 py-1 rounded-3 border-0 pagination-btn">
          {">"}
        </button>
        <button  onClick={() => setPageNumber(controlledPageCount - 1)} 
    disabled={pageNumber >= controlledPageCount - 1} className="px-2 py-1 rounded-3 border-0 pagination-btn">
          {">>"}
        </button>

          <div>
          </div>
        </div>
      )}
    </>
  );
};

export default Table;
