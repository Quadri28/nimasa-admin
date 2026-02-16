import React, { useMemo, useState, useContext, useEffect } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import './GlobalTable.css'


const GlobalTable = ({ data, columns }) => {

    const tableInstance = useTable(
        {
          columns: columns,
          data: data,
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
      <div className="d-sm-flex justify-content-between align-items-center my-3">
            <form className="search-form my-2 w-100">
              <input
                type="text"
                name="search"
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search anything"
                className="p-2 search-inputs w-100"
              />
            </form>
          </div>
          <div className="table-responsive">
            <table {...getTableProps()} id="globalTable" className="table">
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                       
                        <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="d-flex justify-content-center gap-3 mt-2 align-items-center">
              <span>
                Page {""}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>
              </span>
              <button
                onClick={() => gotoPage(0)}
                className="btn btn-sm"
                disabled={!canPreviousPage}
              >
                {"<<"}
              </button>
              <button disabled={!canPreviousPage} className="btn btn-sm">
                {" "}
                <FaAngleLeft onClick={() => previousPage()} />{" "}
              </button>
              <button disabled={!canNextPage} className="btn btn-sm">
                <FaAngleRight onClick={() => nextPage()} />
              </button>
              <button
                onClick={() => gotoPage(pageCount - 1)}
                className="btn btn-sm"
                disabled={!canNextPage}
              >
                {">>"}
              </button>
            </div>
            </div>
    </>
  )
}

export default GlobalTable
