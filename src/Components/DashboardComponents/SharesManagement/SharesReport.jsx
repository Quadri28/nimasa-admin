import React, { useMemo, useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import { UserContext } from '../../../Components/AuthContext';
import Table from "../CommunicationSubComponents/Table";
import axios from "../../axios";

const SharesReport = () => {
  const [data, setData] = useState([]);
  const { credentials } = useContext(UserContext);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize]= useState(10)
  const [loading, setLoading] = useState(false);
  const fetchIdRef = React.useRef(0);
  const [shareTypes, setShareTypes] = useState([]);
  const [searchQuery, setSearchQuery]= useState('')
  
  const [input, setInput] = useState({
    share: "",
    date: "",
    shareStatus: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox values separately
    const newValue = type === "checkbox" ? (checked ? value : "") : value;
    
    setInput({
      ...input,
      [name]: newValue
    });
  };

  const getShareTypes = () => {
    axios('ShareManagement/share-types-slim', {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      }
    }).then(resp => setShareTypes(resp.data.data));
  };

  // Fetch Share Types when the component mounts
  useEffect(() => {
    getShareTypes();
  }, []);

  // Function to fetch the data from the API
  const fetchData = useCallback(({pageSize, pageNumber, search}) => {
    const fetchId = ++fetchIdRef.current;
    setLoading(true);
    
    axios
      .get(`ShareManagement/shares?StartDate=${input.startDate}&EndDate=${input.endDate}&Active=${input.shareStatus}&ShareType=${input.share}&PageSize=${pageSize}&PageNumber=${pageNumber + 1}&Filter=${encodeURIComponent(search)}`, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }) 
      .then((resp) => {
        if (fetchId === fetchIdRef.current) {
          if (resp.data.data.modelResult) {
            setData(resp.data.data.modelResult);
            setPageCount(Math.ceil(resp.data.data.totalCount / 10)); // Assuming PageSize is 10
          }
        }
      })
      .finally(() => setLoading(false));
  }, [input, pageNumber, credentials.token]);

  // Fetch data when input changes or pageNumber changes
 useEffect(() => {
  const delayDebounce = setTimeout(() => {
    fetchData({ pageSize, pageNumber, search: searchQuery });
  }, 500);

  return () => clearTimeout(delayDebounce);
}, [searchQuery, pageNumber, pageSize, fetchData]);

  // Table columns
  const column = [

    { Header: "Member ID", accessor: "memberId" },
    { Header: "Member Name", accessor: "memberName" },
    {
      Header: "Date created",
      accessor: "createdOn",
      Cell: ({ value }) => {
        return <span>{new Date(value).toLocaleDateString('en-US')}</span>;
      },
    },
    { Header: "Shares Type", accessor: "shareTypeName" },
    { Header: "Unit Purchased", accessor: "purchaseUnit", Cell:(({value})=>{
      return <span className="d-flex justify-content-center">{value}</span>
    }) },
    {
      Header: "Amount",
      accessor: "purchasingAmount",
      Cell: ({ value }) => {
        return <span>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(value)}</span>;
      },
    },
  ];

  const columns = useMemo(() => column, []);

  return (
    <div className="mt-4 bg-white px-3 py-4 rounded-4">
      <div className="mt-2 mb-3">
        <span className="active-selector">Shares Report</span>
      </div>
      <div style={{ border: "solid .2px #fafafa", borderRadius: "15px 15px 0 0" }} className="rounded-4">
        <div
          className="py-3 px-4 justify-content-between align-items-center d-flex"
          style={{ backgroundColor: "#f4fAfd", borderRadius: "10px 10px 0 0" }}
        >
          <h6 style={{ fontWeight: "500" }}>
            <BsArrowLeft onClick={() => navigate(-1)} style={{cursor:'pointer'}}/>Shares report
          </h6>
        </div>
        <form>
          <div className="admin-task-forms px-3">
            <div className="d-flex flex-column gap-1">
              <label htmlFor="share" style={{ fontWeight: "500" }}>
                Select Shares<sup className="text-danger">*</sup>
              </label>
              <select
                name="share"
                id="share"
                onChange={handleChange}
              >
                <option value="">Select</option>
                {shareTypes.map(type => (
                  <option value={type.id} key={type.id}>{type.shareProductName}</option>
                ))}
              </select>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="startDate" style={{ fontWeight: "500" }}>
                Start Date
              </label>
              <input name="startDate"  type="date" onChange={handleChange} />
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="startDate" style={{ fontWeight: "500" }}>
                End Date
              </label>
              <input name="endDate"  type="date" onChange={handleChange} />
            </div>
            </div>
            <div className="d-flex gap-3 p-3">
            <div className="d-flex flex-column gap-1">
              <label htmlFor="shareStatus" style={{ fontWeight: "500" }}>
                Select Share Status
              </label>
              <div className="d-flex gap-3">
                <label>
                  <input
                    name="shareStatus"
                    type="radio"
                    value="2"
                    onChange={handleChange}
                  />
                  Withdrawn share
                </label>
                <label>
                  <input
                    name="shareStatus"
                    type="radio"
                    value="1"
                    onChange={handleChange}
                  />
                  Active share
                </label>
              </div>
            </div>
          </div>
        </form>
        <div className="p-3">
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
      </div>
    </div>
  );
};

export default SharesReport;
