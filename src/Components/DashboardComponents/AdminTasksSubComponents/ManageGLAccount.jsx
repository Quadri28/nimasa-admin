import React, { useContext, useEffect, useMemo, useState } from 'react'
import axios from '../../axios'
import {UserContext} from '../../AuthContext'
import Table from '../CommunicationSubComponents/Table';
import { Link } from 'react-router-dom';

const ManageGLAccount = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
 const [pageNumber, setPageNumber] = useState(0)
 const [pageSize, setPageSize] = useState(10)
  const fetchIdRef = React.useRef(0);  
  const [searchQuery, setSearchQuery]= useState('')
  
  const { credentials } = useContext(UserContext);

  const fetchData = React.useCallback(({ pageSize, pageNumber, search }) => {
    const fetchId = ++fetchIdRef.current;
    setLoading(true);
    setTimeout(() => {
      if (fetchId === fetchIdRef.current) {
        axios
          .get(
            `GlAccount/get-gl-accounts?PageNumber=${pageNumber+1}&PageSize=${pageSize}&Filter=${encodeURIComponent(search)}`,
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

  const column = [
    { Header: "Account Number", accessor: "glAccountNumber" },
    { Header: "Account Name", accessor: "accountName" },
    { Header: "Book bal.", accessor: "bookbalance", Cell:(({value})=>{
      return <span>{new Intl.NumberFormat('en-US', {maximumFractionDigits:2}).format(value)}</span>
    }) },
    { Header: "GL Type", accessor: "glTypeName" },
    { Header: "GL class", accessor: "glClassName" },
    {
      Header: "Date Opened",
      accessor: "dateOpened",
      Cell: ({ cell: { value } }) => {
        return <span>{new Date(value).toLocaleDateString()}</span>;
      },
    },
    {Header:'Update', accessor:'', Cell:(({cell})=>{
      const id = cell.row.original.glAccountNumber
      return <div className="d-flex align-items-center">
       <Link to={`/admin-dashboard/admin-tasks/edit-gl-account/${id}`} className='border-0 btn-md member'
       style={{textDecoration:'none'}}>
        Update</Link>
        </div>
    })
    }
  ];

  const columns = useMemo(() => column, []);

   useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData({ pageSize, pageNumber, search: searchQuery });
    }, 500);
  
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, pageNumber, pageSize, fetchData]);

  return(
    <div className='bg-white p-3 rounded-4'>
      <div className="d-flex justify-content-between align-items-center mt-2 flex-wrap gap-2">
        <h3 style={{fontSize:'16px', fontWeight:'600'}}>Manage GL Account</h3>
        <Link to='/admin-dashboard/admin-tasks/add-gl-account' className='btn-md px-3 py-2 text-white border-0 rounded-4' 
        style={{backgroundColor:'var(--custom-color)', textDecoration:'none', fontSize:'14px'}}>+ Add new GL account</Link>
      </div>
       <Table 
      fetchData={fetchData}
      pageCount={pageCount}
      data={data}
      loading={loading}
      columns={columns}
      pageNumber={pageNumber}
      setPageNumber={setPageNumber}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      />

    </div>
  )
}

export default ManageGLAccount
