
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

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

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
      headers: { Authorization: `Bearer ${credentials.token}` },
    }).then((resp) => setCustomers(resp.data.data));
  };

  const fetchAdmins = () => {
    axios("Communication/admins", {
      headers: { Authorization: `Bearer ${credentials.token}` },
    }).then((resp) => setAdmins(resp.data));
  };

  const getChannels = () => {
    axios("Communication/message-channels", {
      headers: { Authorization: `Bearer ${credentials.token}` },
    }).then((resp) => setChannels(resp.data));
  };

  const fetchReceiverTypes = () => {
    axios("Communication/receiver-type", {
      headers: { Authorization: `Bearer ${credentials.token}` },
    }).then((resp) => setReceiverTypes(resp.data));
  };

  useEffect(() => {
    getChannels();
    fetchReceiverTypes();
    fetchMembers();
    fetchAdmins();
  }, []);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fetchData = React.useCallback(({ pageSize, pageNumber, search }) => {
    const fetchId = ++fetchIdRef.current;
    setLoading(true);

    axios
      .get(
        `Communication/get-broad-casts?PageNumber=${
          pageNumber + 1
        }&PageSize=${pageSize}&Filter=${encodeURIComponent(search)}`,
        {
          headers: { Authorization: `Bearer ${credentials.token}` },
        }
      )
      .then((resp) => {
        if (fetchId === fetchIdRef.current) {
          setData(resp.data.data.modelResult || []);
          setPageCount(
            Math.ceil(resp.data.data.totalCount / pageSize)
          );
          setLoading(false);
        }
      }).catch(error=>setLoading(false));
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchData({ pageSize, pageNumber, search: searchQuery });
    }, 500);

    return () => clearTimeout(delay);
  }, [searchQuery, pageNumber, pageSize, fetchData]);

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
          setTimeout(() => {
            fetchData({
            pageNumber: pageNumber,
            pageSize: pageSize,
            search: searchQuery,
          });
          }, 3000);
          
        })
        .catch((error) =>
          toast(error.response?.data?.message || "Error deleting broadcast", {
            type: "error",
            autoClose: false,
          })
        );
    }
  };

  const getSelectedBroadCast = () => {
    if (!id) return;
    axios(`Communication/get-broad-cast?id=${id}`, {
      headers: { Authorization: `Bearer ${credentials.token}` },
    }).then((resp) => setInput(resp.data.data));
  };

  useEffect(() => {
    getSelectedBroadCast();
  }, [id]);

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
      employeeIds:
        customerIDs.length > 0 ? customerIDs : input?.employeeIds,
    };

    setLoading(true);
    axios
      .post("Communication/update-broad-cast", payload, {
        headers: { Authorization: `Bearer ${credentials.token}` },
      })
      .then((resp) => {
        toast(resp.data.message, { type: "success" });
        setLoading(false);
        setIsOpen(false);
        fetchData({ pageSize, pageNumber, search: searchQuery });
      })
      .catch((err) => {
        setLoading(false);
        toast(err.response?.data?.message, { type: "error" });
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "S/N",
        Cell: ({ row }) => row.index + 1,
      },
      { Header: "Title", accessor: "title" },
      { Header: "Sent To", accessor: "receiverEnumText" },
      { Header: "Date Created", accessor: "dateCreated" },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="d-flex gap-3">
            <MdOutlineRemoveRedEye
              onClick={() => {
                setId(row.original.id);
                setOpen(true);
              }}
              style={{ cursor: "pointer" }}
            />
            <GrEdit
              onClick={() => {
                setId(row.original.id);
                setIsOpen(true);
              }}
              style={{ cursor: "pointer" }}
            />
            <RiDeleteBin6Line style={{ cursor: "pointer" }} onClick={deleteBroadCast}/>
          </div>
        ),
      },
    ],
    []
  );

  const { width } = useScreenSize();

  const modalStyle = {
    content: {
      width: width > 900 ? "800px" : "95%",
      height: "50%",
      margin: "auto",
      borderRadius: "12px",
    },
  };

  return (
    <>
      <div className="card p-3 border-1 rounded-4">
        <div className="d-flex justify-content-between">
          <h5>Broadcast</h5>
          <Link to="/admin-dashboard/communications/broadcast-message">
            <button className="border-0 member btn-sm">
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
      </div>

      {/* EDIT MODAL */}
      <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} style={modalStyle} ariaHideApp={false}>
        <h5 className="text-center mb-2">Edit Broadcast</h5>
        <form onSubmit={updateBroadcast}>
          <input
            name="title"
            value={input?.title || ""}
            onChange={handleChange}
            className="form-control mb-2"
          />

          <CKEditor
            editor={ClassicEditor}
            data={input?.description || ""}
            onChange={(event, editor) => {
              const data = editor.getData();
              setInput((prev) => ({ ...prev, description: data }));
            }}
          />
        <div className="d-flex justify-content-end">
          <button className="btn-md member mt-3 border-0" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
          </div>
        </form>
      </Modal>

      {/* VIEW MODAL */}
      <Modal isOpen={open} onRequestClose={() => setOpen(false)} style={modalStyle} ariaHideApp={false}>
        <h5 className="m-2 text-center">View Broadcast</h5>
        <div
          dangerouslySetInnerHTML={{ __html: input?.description }}
          style={{
            padding: "10px",
            borderRadius: "8px",
          }}
        />
      </Modal>

      <ToastContainer />
    </>
  );
};

export default BroadCast;
