import React, { useState, useContext, useEffect, useMemo } from "react";
import { UserContext } from "../../AuthContext";
import Table from "../CommunicationSubComponents/Table";
import axios from "../../axios";
import { FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";

const MemberContributionHistory = () => {
    const [searchQuery, setSearchQuery] = useState('')
  const [data, setData] = useState([]);
  const fetchIdRef = React.useRef(0);
  const { credentials } = useContext(UserContext);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false)

  const fetchData = React.useCallback(({ pageSize, pageNumber, search }) => {
    const fetchId = ++fetchIdRef.current;
    setLoading(true);
    setTimeout(() => {
      if (fetchId === fetchIdRef.current) {
        axios
          .get(
            `Reports/get-member-contribution-report-history?PageSize=${pageSize}&PageNumber=${
              pageNumber + 1
            }&Filter=${encodeURIComponent(search)}`,
            {
              headers: {
                Authorization: `Bearer ${credentials.token}`,
              },
            }
          )
          .then((resp) => {
            if (resp.data.data.modelResult) {
              setData(resp.data.data.modelResult);
              setPageCount(Math.ceil(resp.data.data.totalCount / pageSize));
            }
          });
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData({ pageSize, pageNumber, search:searchQuery });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, pageNumber, pageSize, fetchData]);


  const column = [
      {
        Header: "Member ID",
        accessor: "id",
      },
      { Header: "Name", accessor: "employeeName" },
      { Header: "Previous Amount", accessor: "oldAmount", Cell:(({value})=>{
        return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
      }) },
      { Header: "Current Amount", accessor: "newAmount", Cell:(({value})=>{
        return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
      }) },
      {
        Header: "Last Modified",
        accessor: "dateCreated",
        Cell:(({value})=>{
            return <span >
                {new Date(value).toLocaleDateString('en-US')}
            </span>
        })
      },
       {
        Header: "Action",
        accessor: "",
        Cell:((cell)=>{
            const id = cell.row.original.memberId
            return <Link to={`${id}`} style={{cursor:'pointer'}} className="d-flex justify-content-center text-dark">
                <FiEye/>
            </Link>
        })
      },
    ];
  
    const columns = useMemo(() => column, []);

  return <>
      <Table
          fetchData={fetchData}
          pageCount={pageCount}
          data={data}
          loading={loading}
          columns={columns}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          pageSize={pageSize}
          setPageSize={setPageSize}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

  </>;
};

export default MemberContributionHistory;
