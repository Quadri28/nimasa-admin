import React, { useContext, useEffect, useMemo, useState } from "react";
import { GrEdit } from "react-icons/gr";
import axios from "../../axios";
import Table from "../CommunicationSubComponents/Table";
import { UserContext } from "../../AuthContext";
import { Link } from "react-router-dom"

const Configuration = () => {
  const [data, setData]= useState([])
  const{credentials}= useContext(UserContext)
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading]= useState(false)
   const [searchQuery, setSearchQuery] = useState('')
  const fetchIdRef = React.useRef(0);

  const fetchData = React.useCallback(({ pageSize, pageNumber, search }) => {
    const fetchId = ++fetchIdRef.current;
    setLoading(true);
    setTimeout(() => {
      if (fetchId === fetchIdRef.current) {
        axios
          .get(
            `ShareManagement/share-types?PageSize=${pageSize}&PageNumber=${pageNumber +1}&Filter=${encodeURIComponent(search)}`,
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

  
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData({ pageSize, pageNumber, search: searchQuery });
    }, 500);
  
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, pageNumber, pageSize, fetchData]);


  const column = [
    { Header: "Share Code", accessor: "shareCode" },
    {Header:'Share Product Name', accessor:'shareProductName'},
    {Header:'Shares Available', accessor:'numberOfSharesAvailable'},
    { Header: "Date created", accessor: "createdOn", Cell:(({value})=>{
      return <span>{new Date(value).toLocaleDateString('en-US')}</span>
    }) },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ cell }) => {
        const id = cell.row.original.id
        return (
          <div className="d-flex gap-3 fs-4 justify-content-center">
            <Link to={`update-share/${id}`}>
            <GrEdit size={14} style={{cursor:'pointer'}} />
            </Link>
          </div>
        );
      },
    },
  ];

  const columns = useMemo(() => column, []);

  return (
    <>
     <div className="mt-4 card border-0 px-3 py-3 rounded-4">
     <div className="d-flex justify-content-between mt-4">
          <h4 className="fs-6">Shares Configuration</h4>
          <Link to='add-new-type'
            className="btn btn-md continue"
            style={{
              backgroundColor: "var(--custom-color)",
              color: "#fff",
              fontSize: "12px",
              borderRadius: "1.2rem",
            }}
          >
            Add Share Type
          </Link>
        </div>
        <Table
       fetchData={fetchData}
       pageCount={pageCount}
       columns={columns}
       data={data}
       pageNumber={pageNumber}
       setPageNumber={setPageNumber}
       setPageSize={setPageSize}
       pageSize={pageSize}
       searchQuery={searchQuery}
       setSearchQuery={setSearchQuery}
       loading={loading}
       />
      </div>
    </>
  )
}

export default Configuration
