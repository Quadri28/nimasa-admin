import React,{useState, useEffect, useMemo, useContext} from "react";
import { UserContext } from "../../../AuthContext";
import {useTable,useSortBy,useGlobalFilter,usePagination,
} from "react-table";
import "./Table.css";
import GlobalFilter from "../GlobalFilter";
import { CiEdit } from "react-icons/ci";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import axios from "../../../axios";
import { Link } from "react-router-dom";

const ManageAssetClass = () => {

  const [classes, setClasses]=useState([])
  const [pageSize, setPageSize]= useState(10)
  const [pageNumber, setPageNumber]= useState(1)
  const {credentials} = useContext(UserContext)

  const getClasses =()=>{
    axios(`AssetsClass/get-assets-classes?PageSize=${pageSize}&PageNumber=${pageNumber}`, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setClasses(resp.data.data.modelResult))
  }
  useEffect(()=>{
getClasses()
  },[])
      const column = [
        { Header: "Class Name", accessor: "assetClassName" },
        { Header: "Asset Code", accessor: "id" },
        { Header: "Category Name", accessor: "categoryName" },
        { Header: "Status", accessor: "status" },
        {
          Header: "Actions", accessor: 'actions', 
          Cell: (props)=>{
            const id = props.row.original.id;
        return(
          <div className="d-flex gap-3">
            <div style={{ position: "relative" }} className="status-icon">
            <span className="stat">View</span>
                         <Link to={`view-asset-class/${id}`} className="text-dark">
                           <MdOutlineRemoveRedEye style={{cursor:'pointer'}}/> </Link>
                           </div>
                           <div style={{ position: "relative" }} className="status-icon">
               <span className="stat">Edit</span>
                           <Link to={`edit-asset-class/${id}`} className="text-dark">
                          <CiEdit style={{cursor:'pointer'}} />
                          </Link>
                          </div>
                        </div>
        )
          }
        }
      ];
      const columns = useMemo(() => column, []);
    
      const tableInstance = useTable(
        {
          columns: columns,
          data: classes,
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
        <div className="d-flex justify-content-end mb-2">
        <Link to='add-asset-class' className="member border-0 btn-md" style={{textDecoration:'none'}}>
          Add new asset class
         </Link>
        </div>
         <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <div className="table-responsive mt-2">
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
          {classes.length && <tbody {...getTableBodyProps()}>
            {page.map((row) => {
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
          </tbody> }
        </table>
      </div>
      {classes.length ? <div className="d-flex justify-content-center gap-3 mt-2 align-items-center">
        <span>
          page {""}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="btn">
          {"<<"}
        </button>
        <button disabled={!canPreviousPage} className="btn">
          <FaAngleLeft onClick={() => previousPage()} />
        </button>
        <button disabled={!canNextPage} className="btn">
          <FaAngleRight onClick={() => nextPage()} />
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="btn">
          {">>"}
        </button>
      </div>: <div className="d-flex justify-content-center"> No data yet...</div>}
    </>
  );
};

export default ManageAssetClass
