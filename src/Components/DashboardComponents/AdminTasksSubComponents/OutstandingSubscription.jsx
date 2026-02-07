import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { UserContext } from "../../../Components/AuthContext";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import axios from "../../axios";
import { MdOutlinePayment } from "react-icons/md";
import { Link } from "react-router-dom";
import { LiaTimesCircle } from "react-icons/lia";

const OutstandingSubscription = () => {
  const [subscriptions, setSubscriptions]= useState([])
  const{credentials}= useContext(UserContext)

  const getSubscriptions=()=>{
    axios(`Admin/list-outstanding-subscription/${credentials.logInfo.nodeId}`, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      if (resp.data.data) {
        setSubscriptions(resp.data.data)
      }
    })
  }
  useEffect(()=>{
    getSubscriptions()
  }, [])
 

  const column = [
    {Header:'S/N', Cell:(({cell})=>{
      return <span>{cell.row.index +1}</span>
    })},
    { Header: "Amount due", accessor: "amount_Due", Cell:(({value})=>{
      return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
    }) },
    { Header: "Paying", accessor: "amount_Paying", Cell:(({value})=>{
      return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
    })  },
    { Header: "Total due", accessor: "totalAmtPaying", Cell:(({value})=>{
      return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
    })  },
    { Header: "Trans. ID", accessor: "transactionId" },
    { Header: "Payment ref.", accessor: "paymentRef" },
    { Header: "Trans. date", accessor: "transaction_date" },
    { Header: "Description", accessor: "description" },
    { Header: "Next pay due", accessor: "next_Subscription_Due" },
    {
      Header: "Action",
      accessor: "",
      Cell: (({cell})=>{
        const status = cell.row.original.status
        return (
          <div>
            {status=== 'P' ? <button className="btn btn-md btn-success" style={{fontSize:'14px'}}> <MdOutlinePayment />Paid </button> :
          <Link to='payment-details' className="btn btn-md btn-success" style={{fontSize:'14px'}}
           >
            <MdOutlinePayment /> {status === 'ND' ? 'Pay subscription due': 'Pay outstanding'}
          </Link>}
          </div>
        )
      }) 
    },
  ];

  const columns = useMemo(() => column, []);
  // const datas = useMemo(() => data, []);

  const tableInstance = useTable(
    {
      columns: columns,
      data: subscriptions,
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
    <div className="bg-white p-3 rounded-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 style={{ fontSize: "16px", color: "#1d1d1d" }}>Outstanding subscription</h4>
      </div>
      <form className="search-form mb-4">
        <input
          type="text"
          placeholder="Search anything"
          className="w-100 "
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </form>
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
          {subscriptions.length > 0 && (
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
          ) }
        </table>
        {subscriptions.length ?
          <div className="d-flex justify-content-center gap-3 mt-2 align-items-center">
       
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
        </div>: <div className="d-flex justify-content-center flex-column">
                      <LiaTimesCircle className='mx-auto' size={30}/>
                      <p className="text-center">No record yet</p>
                      </div> }
      </div>
    </div>
  );
};

export default OutstandingSubscription;
