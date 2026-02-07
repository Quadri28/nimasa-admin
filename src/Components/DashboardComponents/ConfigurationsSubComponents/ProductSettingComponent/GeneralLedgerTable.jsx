import React from 'react'
import {
    useTable,
    useSortBy,
    useGlobalFilter,
    usePagination,
  } from "react-table";
  import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const GeneralLedgerTable = ({ data, columns }) => {
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
  } = tableInstance;
  const { globalFilter, pageIndex } = state;
  return (
    <div> 
          <div className="table-responsive w-100">
            <table {...getTableProps()} id= "customers"className="table">
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
          {data.length > 0 ?
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
              </tbody> : null}
            </table>
          <> {data.length < 1 &&
        <div className="d-flex justify-content-center mt-3">
        <span className="text-center"> No data entry yet</span>
        </div>}
        </>
          </div>
    </div>
  );
};
export default GeneralLedgerTable
