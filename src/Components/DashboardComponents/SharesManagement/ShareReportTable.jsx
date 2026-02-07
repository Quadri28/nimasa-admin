import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import {
    useTable,
    useSortBy,
    usePagination,
    useGlobalFilter,
  } from "react-table";

const ShareReportTable = ({ 
    columns,
    data,
    pageCount: controlledPageCount,
    pageNumber,
    setPageNumber, 
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
            setGlobalFilter,
            previousPage,
            setPageSize,
            state: {  pageSize, globalFilter, pageIndex },
          } = useTable(
            {
              columns,
              data,
              // initialState: { pageNumber: 1 },
              manualPagination: true,
              pageCount: controlledPageCount,
            },
            useGlobalFilter,
            usePagination
          );

  return (
    <>
      {data.length > 0 && 
      <div className="d-flex align-items-center my-3">
        <form className="search-form my-2 w-100">
          <input
            type="text"
            title="search"
            // value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search anything"
            className="p-2 search-inputs w-100"
          />
        </form>
      </div>}
      
      <div className="table-responsive">
        <table {...getTableProps()} id="customers" className="table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {data.length > 0 && <tbody {...getTableBodyProps()}>
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
          </tbody>}
        </table>
      </div>
      {data.length > 0 ? <div className="d-flex justify-content-center gap-3 mt-2 align-items-center">
                   
                    <button
                      onClick={() => gotoPage(0)}
                      
                      className="px-2 py-1 rounded-3 border-0 pagination-btn"
                      disabled={!canPreviousPage}
                    >
                      {"<<"}
                    </button>
                    <button disabled={!canPreviousPage} className="px-2 py-1 rounded-3 border-0 pagination-btn">
                      {" "}
                      <FaAngleLeft onClick={() => previousPage()} />{" "}
                    </button>
                    <span>
                      Page {""}
                      <strong>
                        {pageIndex + 1} of {pageOptions.length}
                      </strong>
                    </span>
                    <button disabled={!canNextPage} className="px-2 py-1 rounded-3 border-0 pagination-btn">
                      <FaAngleRight onClick={() => nextPage()} />
                    </button>
                    <button
                      onClick={() => gotoPage(pageCount - 1)}
                      className="px-2 py-1 rounded-3 border-0 pagination-btn"
                      disabled={!canNextPage}
                    >
                      {">>"}
                    </button>
                  </div> : <p className="text-center">No data entry yet</p>}
        
    </>
  )
}

export default ShareReportTable
