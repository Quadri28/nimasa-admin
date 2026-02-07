import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { CSVLink } from "react-csv";
import { LiaTimesCircle } from "react-icons/lia";

const UnpaginatedTable = ({ data, columns, filename }) => {
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
    <div>
      {data.length > 0 ? 
        <>
          <div className="d-sm-flex justify-content-between align-items-center my-3 gap-3">
            <form className="search-form my-2 w-100">
              <input
                type="text"
                name="search"
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search anything"
                className="px-2 py-3 search-inputs w-100"
              />
            </form>
            <CSVLink data={data} filename={filename}>
            <button
              className="btn btn-md text-white fz-6 px-4 rounded-4"
              style={{ backgroundColor: "var(--custom-color)" }}
            >
              Export
            </button>
            </CSVLink>
          </div>  </> : ''}
          
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
        <div className="d-flex flex-column justify-content-center mt-3">
           <LiaTimesCircle size={30} className="text-center mx-auto"/>
        <span className="text-center"> No record yet</span>
        </div>}
        </>
            {data.length > 0 &&
            <div className="d-flex justify-content-center gap-3 mt-2 align-items-center">
             
              <button
                onClick={() => gotoPage(0)}
                type="button"
                className="px-2 py-1 rounded-3 border-0 pagination-btn"
                disabled={!canPreviousPage}
              >
                {"<<"}
              </button>
              <button disabled={!canPreviousPage} 
                type="button"
               className="px-2 py-1 rounded-3 border-0 pagination-btn">
                {" "}
                <FaAngleLeft onClick={() => previousPage()} />{" "}
              </button>
              <span>
                Page {""}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>
              </span>
              <button disabled={!canNextPage} className="px-2 py-1 rounded-3 border-0 pagination-btn"
                type="button"
              >
                <FaAngleRight onClick={() => nextPage()} />
              </button>
              
              <button
                onClick={() => gotoPage(pageCount - 1)}
                className="px-2 py-1 rounded-3 border-0 pagination-btn"
                disabled={!canNextPage} type="button"
              >
                {">>"}
              </button>
            </div>}
          </div>
    </div>
  );
};

export default UnpaginatedTable;
