import React, { useContext, useEffect, useMemo, useState } from "react";
import Table from "./Table";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";

const SMSReports = () => {

  const [reports, setReports] = useState([])
  const [loading, setLoading]= useState('')
  const {credentials} = useContext(UserContext)


  const column = [
    { Header: "Member ID", accessor: "memberID" },
    { Header: "Purchased by", accessor: "customer_name" },
    { Header: "Amount", accessor: "unitCharges" },
    { Header: "Date", accessor: "dateOpened", Cell:({cell: {value}})=>{
      return <span>{new Date(value).toLocaleDateString()}</span>
    } },
    { Header: "Status", accessor: "status", Cell:({cell: {value}})=> {
      if (value === 'Unsuccessful') {
        return <div className='suspended-status px-2' style={{width:'fit-content'}}>
         <hr /> <span >{value}</span>
          </div>
      }else if (value === 'Successful') {
        return  <div className='active-status px-2' style={{width:'fit-content'}}>
         <hr /><span> {value}</span>
         </div>}} },

  ];

  const columns = useMemo(() => column, []);

  const [pageCount, setPageCount] = useState(0);
 const [pageNumber, setPageNumber] = useState(0)
 const [pageSize, setPageSize] = useState(10)

  const fetchIdRef = React.useRef(0);

  const fetchData = React.useCallback(({ pageSize, pageNumber }) => {
    const fetchId = ++fetchIdRef.current;

    setLoading(true);
    setTimeout(() => {
      if (fetchId === fetchIdRef.current) {
        axios(
          `Communication/members-sms-report?PageSize=${pageSize}&PageNumber=${pageNumber+1}`,
          {
            headers: {
              Authorization: `Bearer ${credentials.token}`,
            },
          }
        ).then((resp) => {
          if (resp.data.data.modelResult) {
            setReports(resp.data.data.modelResult);
        setPageCount(Math.ceil(resp.data.data.totalCount / pageSize));
          }
        });
        setLoading(false);
      }
    }, 1000);
  }, []);

  useEffect(() => {
      fetchData({ pageSize, pageNumber });
    }, [fetchData, pageNumber, pageSize])
  

  return (
    <div className="card p-3  border-0 rounded-4">
      <div className="d-flex justify-content-between mt-3">
        <h5 style={{fontSize:'16px'}}>SMS Reports</h5>
      
      </div>
      <div className="p-1 admin-task-forms my-2 ">
        <div className="p-3 bg-light align-items-center rounded-4 mt-2 sms">
          <div>
            <p className="text-uppercase small-card-title fs-7">
              Successful SMS
            </p>
            <div className="d-flex justify-content-between align-items-baseline">
              <b>20,345 units</b>
            </div>
          </div>
        </div>
        <div className="p-3 bg-light align-items-center rounded-4 mt-2 sms">
          <div>
            <p className="text-uppercase small-card-title fs-7">
              Unsuccessful SMS
            </p>
            <div className="d-flex justify-content-between align-items-baseline">
              <b>1,345 units</b>
            </div>
          </div>
        </div>
      </div>
      <Table 
       fetchData={fetchData}
       pageCount={pageCount}
       columns={columns}
       data={reports}
       pageNumber={pageNumber}
       setPageNumber={setPageNumber}
       pageSize={pageSize}
       setPageSize={setPageSize}
       /> 
    </div>
  );
};

export default SMSReports;
