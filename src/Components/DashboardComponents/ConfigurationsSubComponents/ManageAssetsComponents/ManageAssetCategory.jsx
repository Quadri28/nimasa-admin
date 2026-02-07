import React,{ useMemo, useContext, useState, useEffect} from "react";
import { UserContext } from "../../../AuthContext";
import {useTable,useSortBy,useGlobalFilter,usePagination,
} from "react-table";
import "./Table.css";
import GlobalFilter from "../GlobalFilter";
import { CiEdit } from "react-icons/ci";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "../../../axios";

const ManageAssetCategory = () => {
  const {credentials}= useContext(UserContext)
  const [categories, setCategories] = useState([])

  const fetchCategories =()=>{
    axios('AssetCategory/get-fixed-assets-categories', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>(
      setCategories(resp.data.data)
    ))
  }

  useEffect(()=>{
    fetchCategories()
  }, [])

      const column = [
        { Header: "Product Code", accessor: "categoryCode" },
        { Header: "Product Name", accessor: "categoryName" },
        { Header: "Product Status", accessor: "categoryStatus" },
        {
          Header: "Actions", accessor: 'actions', 
          Cell: (props)=>{
            const id = props.row.original.categoryCode
        return(
          <div className="d-flex gap-3 ">
            <div style={{ position: "relative" }} className="status-icon">
            <span className="stat">View</span>
                         <Link to={`view-asset-category/${id}`} className="text-dark">
                          <MdOutlineRemoveRedEye style={{cursor:'pointer'}}/> </Link> 
                          </div>
                          <div style={{ position: "relative" }} className="status-icon">
                           <span className="stat">Edit</span>
                          <Link to={`edit-asset-category/${id}`} className="text-dark">
                          <CiEdit style={{cursor:'pointer'}} onClick={()=>handleClick(id)}/>
                          </Link>
                          </div>
                        </div>
        )
          }
        }
      ];
      const columns = useMemo(() => column, []);
      // const data = useMemo(() => categories, []);
    
      const tableInstance = useTable(
        {
          columns: columns,
          data: categories,
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
    <Link to='add-asset-category' className="member border-0 btn-md" style={{textDecoration:'none'}}>
          Add new asset category
         </Link>
         </div>
         <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
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
          {categories.length > 0 && <tbody {...getTableBodyProps()}>
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
      {categories.length > 0? 
      <div className="d-flex justify-content-center gap-3 mt-2 align-items-center">
        <span>
          Page
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
      </div>: <div className="d-flex justify-content-center">No data yet!!!</div> }
    </>
  );
};

export default ManageAssetCategory;
