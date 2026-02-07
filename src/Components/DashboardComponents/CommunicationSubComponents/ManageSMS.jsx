import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GoArrowUp } from "react-icons/go";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { ToastContainer, toast } from "react-toastify";
import Table from "./Table";

const ManageSMS = () => {
  const { credentials } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false)
  const [pageCount, setPageCount] = useState(0)
  const [pageNumber, setPageNumber] = useState(0)
  const [pageSize, setPageSize]= useState(10)

  const fetchIdRef = React.useRef(0);
  const fetchData = React.useCallback(({ pageSize, pageNumber }) => {
    const fetchId = ++fetchIdRef.current;
    setLoading(true);
    setTimeout(() => {
      if (fetchId === fetchIdRef.current) {
        axios(
          `Communication/members-sms?PageSize=${pageSize}&PageNumber=${pageNumber+1}`,
          {
            headers: {
              Authorization: `Bearer ${credentials.token}`,
            },
          }
        ).then((resp) => {
          if (resp.data.data.modelResult) {
            setMessages(resp.data.data.modelResult);
            setPageCount(Math.ceil(resp.data.data.totalCount / pageSize));
          }
        });
        setLoading(false);
      }
    }, 1000);
  }, [])
  useEffect(() => {
    fetchData({ pageSize, pageNumber });
  }, [fetchData, pageNumber, pageSize]);


  const column = [
    { Header: "Member ID", accessor: "customerID" },
    { Header: "Member Name", accessor: "name" },
    { Header: "Phone Number", accessor: "phoneNumber" },
    {
      Header: "SMS status",
      accessor: "smsStatus",
      Cell: ({ cell: { value } }) => {
        if (value === false) {
          return (
            <div className="suspended-status px-2" style={{width:'max-content'}}>
              <hr /> <span>Disabled</span>
            </div>
          );
        } else {
          return (
            <div className="active-status px-2 " style={{width:'max-content'}}>
              <hr />
              <span> Enabled</span>
            </div>
          );
        }
      },
    },
    {
      Header: "Action",
      accessor: "enable",
      Cell: (props) => {
        const customerId = props.row.original.customerID;
        const smsStatus = props.row.original.smsStatus;
        return (
          <div>
            {smsStatus === false ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const payload = {
                    customerId: String(customerId),
                    status: true,
                  };
                  axios.post("Communication/enable-member-sms", payload, {
                    headers: {
                      Authorization: `Bearer ${credentials.token}`,
                    },
                  }).then((resp) => {toast(resp.data.message), {
                    type: "success",
                    autoClose: 5000,
                    pauseOnHover: true,
                  }
                    fetchData({ pageSize: 10, pageNumber:0 })

                })
                  .catch((error) => toast(error.response.data.message), {
                    type: "error",
                    autoClose: false,
                    pauseOnHover: true,
                  });;
                }}
              >
                <button className="active-status border-0 px-3" type="submit">
                  Approve
                </button>
              </form>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const payload = {
                    customerId: String(customerId),
                    status: false,
                  };
                  axios
                    .post("Communication/enable-member-sms", payload, {
                      headers: {
                        Authorization: `Bearer ${credentials.token}`,
                      },
                    })
                    .then((resp) => {toast(resp.data.message), {
                      type: "success",
                      autoClose: 5000,
                      pauseOnHover: true,
                    }
                  })
                    .catch((error) => toast(error.response.data.message), {
                      type: "error",
                      autoClose: false,
                      pauseOnHover: true,
                    });
                }}
              >
                <button type="submit" className="suspended-status border-0 px-3">
                  Disapprove
                </button>
              </form>
            )}
          </div>
        );
      },
    },
  ];

  const columns = useMemo(() => column, []);

  return (
    <div className="card border-0 rounded-4 p-3">
      <h5 style={{fontSize:'16px'}}>Manage SMS</h5>
      <div className="p-1">
        <div className="p-3 bg-light align-items-center rounded-5 subscribers">
          <div>
            <p className="text-uppercase small-card-title fs-6">
              SMS subscribers
            </p>
            <div className="d-flex justify-content-between align-items-baseline">
              <b>12,426 </b>
              <span className="text-success">
                +36%
                <GoArrowUp />
              </span>
            </div>
          </div>
        </div>
      </div>
     
        <Table 
        pageCount={pageCount}
        data={messages}
        loading={loading}
        fetchData={fetchData}
        columns={columns}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        pageSize={pageSize}
        setPageSize={setPageSize}
        />
      <ToastContainer/>
    </div>
  );
};

export default ManageSMS;
