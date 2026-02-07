import React, { useContext, useEffect, useMemo, useState } from "react";
import { CSVLink } from "react-csv";
import "./Investment.css";
import { CiSquareCheck } from "react-icons/ci";
import { PiXSquareThin } from "react-icons/pi";
import { BsBagCheck } from "react-icons/bs";
import { Link } from "react-router-dom";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import Table from "../CommunicationSubComponents/Table";

const Investment = () => {
  const [data, setData]= useState([])
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
 const [pageNumber, setPageNumber] = useState(0)
 const [pageSize, setPageSize] = useState(10)
 const [searchQuery, setSearchQuery] = useState('')
 const [detail, setDetail]= useState({})

 const getInvestmentDetail=()=>{
  axios('Investment/investments-dashboard', {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>setDetail(resp.data.data))
 }
  const fetchIdRef = React.useRef(0);
  const{credentials}= useContext(UserContext)
  const fetchData = React.useCallback(({ pageSize, pageNumber, search }) => {
    const fetchId = ++fetchIdRef.current;
    setLoading(true);
    setTimeout(() => {
      if (fetchId === fetchIdRef.current) {
        axios
          .get(
            `Investment/get-all-investments?PageSize=${pageSize}&PageNumber=${pageNumber+1}&Filter=${encodeURIComponent(search)}`,
            {
              headers: {
                Authorization: `Bearer ${credentials.token}`,
              },}
          )
          .then((resp) => {
            if (resp.data.data.modelResult) {
              setData(resp.data.data.modelResult);
              setPageCount(
                Math.ceil(resp.data.data.totalCount / pageSize)
              );
            }
          });
        setLoading(false);
      }
    })
  }, []);

  useEffect(()=>{
    window.scrollTo(0, 0)
    getInvestmentDetail()
},[])
  

useEffect(() => {
  const delayDebounce = setTimeout(() => {
    fetchData({ pageSize, pageNumber, search: searchQuery });
  }, 500);

  return () => clearTimeout(delayDebounce);
}, [searchQuery, pageNumber, pageSize, fetchData]);

  const column = [
    { Header: "Issuer", accessor: "issuer" },
    { Header: "Amount", accessor: "amount", Cell:(({value})=>{
      return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
    }) },
    { Header: "Maturity Date", accessor: "matuarityDate", Cell:(({value})=>{
      return <span>{new Date(value).toLocaleDateString('en-Us')}</span>
    })
    },
    { Header: "Interest Rate", accessor: "interestRate", Cell:(({value})=>{
      return <span className="d-flex justify-content-center">{value}</span>
    }) },
    { Header: "Expected Return Amount", accessor: "expectedReturnAmount", Cell:(({value})=>{
      return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
    }) },
    { Header: "Date", accessor: "startDate", Cell:(({value})=>{
      return <span>{new Date(value).toLocaleDateString('en-Us')}</span>
    }) },
    { Header: "Liquidate", accessor: "liquidate", Cell:(({value})=>{
      return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)} </span> })},
  ];
  const columns = useMemo(() => column, []);

  return (
    <>
          <div className="investment-cards-container">
          <div className="p-1">
            <div className="p-3 bg-white align-items-center rounded-3 small-cards">
              <div>
                <p className="text-uppercase small-card-title">
                  Total No of Investment
                </p>
                <div className="d-flex justify-content-between align-items-baseline">
                  <span style={{fontWeight:'500'}}>
                    {new Intl.NumberFormat('en-US', {}).format(detail?.totalNumberOfInvestments)} </span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-1">
            <div className="p-3 bg-white align-items-center rounded-3 small-cards">
              <div>
                <p className="text-uppercase small-card-title">
                  Total Return on Investment
                </p>
                <div className="d-flex justify-content-between align-items-baseline">
                  <span style={{fontWeight:'500'}}>
                    {new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(detail?.totalReturnOnInvestments)} </span>
                </div>
              </div>
            </div>
          </div>
          <div className=" p-1">
            <div className="p-3 bg-white align-items-center rounded-3 small-cards">
              <div>
                <p className="text-uppercase small-card-title">Total Value of Investments</p>
                <div className="d-flex justify-content-between align-items-baseline">
                  <span style={{fontWeight:'500'}}>
                    {new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(detail?.totalValueOfInvestments)} </span>
                </div>
              </div>
            </div>
          </div>
          <div className=" p-1">
            <div className="p-3 bg-white align-items-center rounded-3 small-cards">
              <div>
                <p className="text-uppercase small-card-title">
                  Inactive investments
                </p>
                <div className="d-flex justify-content-between align-items-baseline">
                  <span style={{fontWeight:'500'}}>{detail?.inActiveInvestments}  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      <div className="card border-0 p-3 mt-3">
        <div className="d-flex justify-content-between">
          <h6>Investment</h6>
          <Link to='add-investment'
            className="btn btn-md text-white px-3"
            style={{ backgroundColor: "var(--custom-color)", borderRadius: "2rem" , fontSize:'14px'}}
          >
           + Add new investment
          </Link>
        </div>
       <Table 
       fetchData={fetchData}
       pageCount={pageCount}
       columns={columns}
       data={data}
       pageNumber={pageNumber}
       setPageNumber={setPageNumber}
       pageSize={pageSize}
       setPageSize={setPageSize}
       loading={loading}
       searchQuery={searchQuery}
       setSearchQuery={setSearchQuery}
       />
      </div>
    </>
  );
};

export default Investment;
