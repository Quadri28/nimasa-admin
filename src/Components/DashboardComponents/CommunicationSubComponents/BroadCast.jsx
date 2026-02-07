import React, { useMemo, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "../../../Components/axios";
import { UserContext } from "../../../Components/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import Table from "./Table";
import { GrEdit } from "react-icons/gr";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import useScreenSize from "../../ScreenSizeHook";
import Modal from "react-modal";
import { Multiselect } from "react-widgets";
import ReactQuill from "react-quill";

const BroadCast = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState([]);
  const [receiverTypes, setReceiverTypes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [id, setId] = useState("");
  const [input, setInput] = useState({});
  const { credentials } = useContext(UserContext);
  const fetchIdRef = React.useRef(0);
  const [customers, setCustomers] = useState([]);
  const [customerIDs, setCustomerIDs] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fetchMembers = () => {
    axios("MemberManagement/account-enquiry-select", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setCustomers(resp.data.data));
  };

  const { width } = useScreenSize();
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      height: "65%",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "1rem",
      width: width > 900 ? "800px" : "320px",
      overFlowY: "scroll",
    },
  };
  //Function to open and close edit modal
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  //Functions to open and close view modal
  function openViewModal() {
    setOpen(true);
  }
  function closeViewModal() {
    setOpen(false);
  }
  const fetchAdmins = () => {
    axios("Communication/admins", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setAdmins(resp.data));
  };
  // Fetching channels
  const getChannels = () => {
    axios("Communication/message-channels", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setChannels(resp.data));
  };

  // Fetching Receivers Types
  const fetchReceiverTypes = () => {
    axios("Communication/receiver-type", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setReceiverTypes(resp.data));
  };
  useEffect(() => {
    getChannels();
    fetchReceiverTypes();
    fetchMembers();
    fetchAdmins();
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput({ ...input, [name]: value });
  };
  const handleDescriptionChange = (value) => {
    setInput((prev) => ({ ...prev, description: value }));
  };

  const handleReceiverChange = (value) => {
    setCustomerIDs(
      value.map((val) =>
        input?.receiver === 0 ? val.employeeId : val.customerId
      )
    );
  };

  const fetchData = React.useCallback(({ pageSize, pageNumber, search }) => {
    const fetchId = ++fetchIdRef.current;
    setLoading(true);
    setTimeout(() => {
      if (fetchId === fetchIdRef.current) {
        axios
          .get(
            `Communication/get-broad-casts?PageNumber=${
              pageNumber + 1
            }&PageSize=${pageSize}&Filter=${encodeURIComponent(search)}`,
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

  const getSelectedBroadCast = () => {
    axios(`Communication/get-broad-cast?id=${id}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setInput(resp.data.data));
  };

  useEffect(() => {
    getSelectedBroadCast();
  }, [id]);

  const deleteBroadCast = (id) => {
    const isConfirmed = window.confirm("Are you sure to delete the broadcast?");
    if (isConfirmed) {
      axios(`Communication/delete-broad-cast?id=${id}`, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
        .then((resp) => {
          toast(resp.data.message, { type: "success", autoClose: 5000 });
          fetchData({
            pageNumber: pageNumber,
            pageSize: pageSize,
            search: searchQuery,
          });
        })
        .catch((error) =>
          toast(error.response?.data?.message || "Error deleting broadcast", {
            type: "error",
            autoClose: false,
          })
        );
    }
  };

  const channelColors = {
    Sms: "#E3F2FD",
    Email: "#E8F5E9",
    Notification: "#F3E5F5",
  };

  const column = [
    {
      Header: "S/N",
      accessor: "",
      Cell: ({ cell }) => {
        const index = cell.row.index;
        return <span>{index + 1}</span>;
      },
    },
    { Header: "Notification title", accessor: "title" },
    { Header: "Sent to", accessor: "receiverEnumText" },
    {
      Header: "Date created",
      accessor: "dateCreated",
    },
    {
      Header: "Channel",
      accessor: "messageChanelNames",
      Cell: ({ value }) => {
        if (!Array.isArray(value)) return null;

        return (
          <div className="d-flex flex-wrap gap-1">
            {value.map((channel, index) => (
              <span
                key={index}
                style={{
                  backgroundColor:
                    channelColors[channel] || defaultChannelColor,
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: "500",
                  whiteSpace: "nowrap",
                }}
              >
                {channel}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      Header: "Actions",
      accessor: "",
      Cell: ({ cell }) => {
        const id = cell.row.original.id;
        return (
          <div className="d-flex justify-content-between align-items-center">
            <div style={{ position: "relative" }} className="status-icon">
              <span className="stat">View</span>
              <MdOutlineRemoveRedEye
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setId(id);
                  openViewModal();
                }}
              />
            </div>
            <div style={{ position: "relative" }} className="status-icon">
              <span className="stat">Edit</span>
              <GrEdit
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setId(id);
                  openModal();
                }}
              />
            </div>
            <div style={{ position: "relative" }} className="status-icon">
              <span className="stat">Delete</span>
              <RiDeleteBin6Line
                onClick={() => deleteBroadCast(id)}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
        );
      },
    },
  ];

  const selectAllReceivers = () => {
    if (input?.receiver === 0) {
      // Admins
      const allAdminIds = admins.map((admin) => admin.employeeId);
      setInput((prev) => ({ ...prev, employeeIds: allAdminIds }));
    } else {
      // Customers
      const allCustomerIds = customers.map((customer) => customer.customerId);
      setInput((prev) => ({ ...prev, employeeIds: allCustomerIds }));
    }
  };

  const columns = useMemo(() => column, []);
  const receivers =
    input?.receiver === 0
      ? admins.filter((admin) => input?.employeeIds?.includes(admin.employeeId))
      : customers.filter((customer) =>
          input?.employeeIds?.includes(customer.customerId)
        );

  const updateBroadcast = (e) => {
    e.preventDefault();
    const payload = {
      id: input.id,
      title: input.title,
      description: input.description,
      scheduleMessage: true,
      scheduleDate: input.scheduleDate,
      messageChanels: input.messageChanel,
      receiver: Number(input.receiver),
      employeeIds: customerIDs.length > 0 ? customerIDs : input?.employeeIds,
    };
    setLoading(true);
    axios
      .post("Communication/update-broad-cast", payload, {
        headers: { Authorization: `Bearer ${credentials.token}` },
      })
      .then((resp) => {
        toast(resp.data.message, { type: "success", autoClose: 5000 });
        setLoading(false);
        closeModal();
        setTimeout(() => {
          fetchData({ pageSize, pageNumber, search: searchQuery });
        }, 5000);
      })
      .catch((error) => {
        setLoading(false);
        toast(error.response.data.message, { type: "error", autoClose: false });
      });
  };
  return (
    <>
      <div className="card border-0 rounded-4 p-3">
        <div className="d-flex justify-content-between">
          <h4 className="fs-6">Broadcast </h4>
          <Link to="/admin-dashboard/communications/broadcast-message">
            <button
              className="btn btn-md continue"
              style={{
                backgroundColor: "var(--custom-color)",
                color: "#fff",
                fontSize: "12px",
                borderRadius: "1.2rem",
              }}
            >
              Create new message
            </button>
          </Link>
        </div>
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
        <ToastContainer />
      </div>
      {/* Modal for editing broadcast */}
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={customStyles}
      >
        <h5 className="text-center">Edit Broadcast</h5>
        <form onSubmit={updateBroadcast}>
          <div className="admin-task-forms">
            <div className="d-flex gap-1 flex-column">
              <label htmlFor="title">Title</label>
              <input
                name="title"
                value={input?.title}
                onChange={handleChange}
              />
            </div>
            <div className="d-flex gap-1 flex-column">
              <label htmlFor="messageChanel">Message Channel</label>

              <Multiselect
                data={channels}
                dataKey="value"
                textField="name"
                value={channels.filter((c) =>
                  input?.messageChanel?.includes(c.value)
                )}
                onChange={(selected) => {
                  const values = selected.map((item) => item.value);
                  setInput((prev) => ({
                    ...prev,
                    messageChanel: values,
                  }));
                }}
                className="w-100"
              />
            </div>
            <div className="d-flex gap-1 flex-column">
              <label htmlFor="receiver">Receiver Type</label>
              <select
                name="receiver"
                value={input?.receiver}
                onChange={handleChange}
              >
                {receiverTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="d-flex gap-1 flex-column">
            <div className="d-flex gap-3 align-items-center">
              <label htmlFor="">Receivers</label>
              <div>
                <button onClick={selectAllReceivers}>Select all</button>
              </div>
            </div>
            <Multiselect
              data={input?.receiver === 0 ? admins : customers}
              dataKey={input?.receiver === 0 ? "employeeId" : "customerId"}
              textField={
                input?.receiver === 0
                  ? "employeeFullName"
                  : "customerInfomation"
              }
              value={(input?.receiver === 0 ? admins : customers).filter(
                (item) =>
                  input?.employeeIds?.includes(
                    item[input?.receiver === 0 ? "employeeId" : "customerId"]
                  )
              )}
              onChange={(selectedItems) => {
                const ids = selectedItems.map((item) =>
                  input?.receiver === 0 ? item.employeeId : item.customerId
                );
                setInput((prev) => ({ ...prev, employeeIds: ids }));
              }}
              className="w-100"
              required
            />
          </div>
          <ReactQuill
            value={input?.description}
            onChange={handleDescriptionChange}
            className="mt-2"
          />
          <div className="d-flex justify-content-end mt-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-md member border-0"
            >
              {!loading ? "Update" : "Loading..."}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal to View Broadcast */}
      <Modal
        isOpen={open}
        onRequestClose={closeViewModal}
        style={customStyles}
        contentLabel="Broadcast Modal"
        ariaHideApp={false}
      >
        <h5 className="text-center">View Broadcast</h5>
        <form>
          <div className="admin-task-forms">
            <div className="d-flex gap-1 flex-column">
              <label htmlFor="title" style={{ fontWeight: "500" }}>
                Title:
              </label>
              <input name="title" value={input?.title} disabled />
            </div>
            <div className="d-flex gap-1 flex-column">
              <label htmlFor="messageChannel" style={{ fontWeight: "500" }}>
                Channel
              </label>
              <div className="d-flex flex-wrap gap-1">
                {input?.messageChanelNames?.map((channel, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: channelColors[channel] || "#ECEFF1",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "500",
                    }}
                  >
                    {channel}
                  </span>
                ))}
              </div>
            </div>
            <div className="d-flex gap-1 flex-column">
              <label htmlFor="receiver" style={{ fontWeight: "500" }}>
                {" "}
                Receiver Type:{" "}
              </label>
              <select name="receiver" value={input?.receiver} disabled>
                <option value="">Select</option>
                {receiverTypes.map((receiverType) => (
                  <option value={receiverType.value} key={receiverType.value}>
                    {receiverType.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="my-2">
            <label htmlFor="customers">
              {input?.receiver === 0 ? "Admins" : "Members"}
            </label>
            <div>
              <ul>
                {receivers.map((receiver) => (
                  <li style={{ fontSize: "12px", listStyle: "outside" }}>
                    {receiver.employeeFullName} {receiver.customerInfomation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="my-2">
            <label htmlFor="description">Description</label>
            <ReactQuill
              name="description"
              id="description"
              as="textarea"
              value={input?.description}
              className="w-100 p-2"
              disabled
              style={{
                borderRadius: "12px",
                border: "none",
                backgroundColor: "#f7f7f7",
              }}
              rows={7}
            />
          </div>
          <div />
        </form>
      </Modal>
    </>
  );
};

export default BroadCast;
