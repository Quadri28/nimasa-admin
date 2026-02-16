import React, { useContext, useEffect, useMemo, useState } from "react";

import { UserContext } from "../../../Components/AuthContext";
import axios from "../../axios";
import { Link } from "react-router-dom";
import { MdOutlineEdit } from "react-icons/md";
import Table from "../../DashboardComponents/CommunicationSubComponents/Table";

const GlobalRoleConfig = () => {
  const [data, setData] = useState([]);
  const { credentials } = useContext(UserContext);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery]= useState('')
  
  const fetchIdRef = React.useRef(0);

  const fetchData = React.useCallback(({ pageSize, pageNumber, search }) => {
    const fetchId = ++fetchIdRef.current;
    setLoading(true);
    setTimeout(() => {
      if (fetchId === fetchIdRef.current) {
        axios
          .get(
            `Admin/get-tenant-list?PageSize=${pageSize}&PageNumber=${
              pageNumber + 1}&Filter=${encodeURIComponent(search)}`,
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
      fetchData({ pageSize, pageNumber, search: searchQuery });
    }, 500);
  
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, pageNumber, pageSize, fetchData]);

  const column = [
    { Header: "Node ID", accessor: "node_id" },
    { Header: "Tenant", accessor: "tenant" },
    {
      Header: "Actions",
      accessor: "",
      Cell: ({ cell }) => {
        const id = cell.row.original.node_id;
        return (
          <div className="d-flex gap-4 align-items-center justify-content-center ">
            <Link to={`edit-role/${id}`} style={{ color: "#333" }}>
              <MdOutlineEdit className="action-icons" />
            </Link>
          </div>
        );
      },
    },
  ];

  const columns = useMemo(() => column, []);

  return (
    <div className="bg-white p-3 rounded-3">
      <h4 style={{ fontSize: "16px", color: "#1d1d1d" }}>
        Global role configuration
      </h4>
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
    </div>
  );
};
export default GlobalRoleConfig;
