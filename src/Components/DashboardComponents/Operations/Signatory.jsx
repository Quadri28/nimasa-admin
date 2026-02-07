import React, { useContext, useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import useScreenSize from "../../ScreenSizeHook";
import Table from "../CommunicationSubComponents/Table";
import { GrEdit } from "react-icons/gr";

const Signatory = () => {
  const [text, setText] = useState({});
  const [idTypes, setIdTypes] = useState([]);
  const [signatories, setSignatories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const fetchIdRef = React.useRef(0);
  const [pageCount, setPageCount] = useState(0);
  const [input, setInput]= useState({})
  const [selectedId, setSelectedId] = useState('')
  const [selectedSignatory, setSelectedSignatory] = useState('')
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState("");
  const [file, setFile] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { credentials } = useContext(UserContext);
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
      width: width > 900 ? "700px" : "320px",
      overFlowY: "scroll",
      padding: "0",
    },
  };

  const handleChange =(e)=>{
    const name = e.target.name;
    const value = e.target.value;
    setInput({...input, [name]:value})
  }

  const fetchData = React.useCallback(({ pageSize, pageNumber, search }) => {
    const fetchId = ++fetchIdRef.current;
    setLoading(true);
    setTimeout(() => {
      if (fetchId === fetchIdRef.current) {
        axios
          .get(
            `MemberManagement/get-cooperate-member-signatories-details?PageNumber=${
              pageNumber + 1
            }&PageSize=${pageSize}&CustomerId=${id}&Filter=${encodeURIComponent(search)}`,
            {
              headers: {
                Authorization: `Bearer ${credentials.token}`,
              },
            }
          )
          .then((resp) => {
            if (resp.data.data.modelResult) {
              setSignatories(resp.data.data.modelResult);
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

  const getIdTypes = () => {
    axios("MemberManagement/get-identity-card-types", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setIdTypes(resp.data.data));
  };

  useEffect(() => {
    getIdTypes();
  }, []);

  function handleOpen() {
    setIsOpen(true);
  }
  function handleClose() {
    setIsOpen(false);
  }

   function handleModalOpen() {
    setModalOpen(true);
  }
  function handleModalClose() {
    setModalOpen(false);
  }

  const changeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setText({ ...text, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = new FormData();
    payload.append("Name", text.corporateName);
    payload.append("Position", text.position);
    payload.append("Address", text.address);
    payload.append("PersonalInfoBvn", text.bvn);
    payload.append("PersonalInfoPhoneNumber", text.phoneNumber);
    payload.append("PersonalInfoEmail", text.email);
    payload.append("PassportPhotographUpload", file);
    payload.append("IDType", text.idType);
    payload.append("IDNumber", text.idNo);
    payload.append("IDCardUpload", text.idCard);
    payload.append("CustomerId", id);
    axios
      .post("MemberManagement/add-register-signatory", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) => {
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        });
        setTimeout(() => {
        setLoading(false);
        handleClose
            fetchData({ pageNumber: pageNumber, pageSize: pageSize, search: searchQuery })
        }, 5000);
      })
      .catch((error) => {
        toast(error.response.data.message, { type: "error", autoClose: false });
        setLoading(false);
      });
  };


//   Update Signatory
const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = new FormData();
    payload.append("Name", input.fullname);
    payload.append("Position", input.position);
    payload.append("Address", input.address);
    payload.append("PersonalInfoBvn", input.bvn);
    payload.append("PersonalInfoPhoneNumber", input.phoneNo);
    payload.append("PersonalInfoEmail", input.email);
    payload.append("PassportPhotographUpload", file);
    payload.append("IDType", input.iDtype);
    payload.append("IDNumber", input.idNo);
    payload.append("IDCardUpload", input.idCard);
    payload.append("id", selectedId);
    axios
      .post("MemberManagement/update-register-signatory", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) => {
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        });
        setTimeout(() => {
        setLoading(false);
        handleModalClose()
            fetchData({ pageNumber: pageNumber, pageSize: pageSize, search: searchQuery })
        }, 5000);
      })
      .catch((error) => {
        toast(error.response.data.message, { type: "error", autoClose: false });
        setLoading(false);
      });
  };

  const fetchSelectedSignatory= async()=>{
    await axios(`MemberManagement/get-register-signatory-by-id?id=${selectedId}`, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setInput(resp.data.data))
  }

  useEffect(()=>{
    fetchSelectedSignatory()
  }, [selectedId])

  const column = [
    { Header: "ID Number", accessor: "idNo" },
    { Header: "Full Name", accessor: "fullname" },
    { Header: "Position", accessor: "position" },
    {Header:'Email', accessor:'email'},
    {Header:'Action', accessor:'', Cell:(props)=>{
     const id = props.row.original.id;
        return <span className="d-flex justify-content-center">
            <GrEdit style={{cursor:'pointer'}} onClick={()=>{
                handleModalOpen()
                setSelectedId(id)
                }}/>
        </span>
    }}
  ];

  const columns = useMemo(() => column, []);

  return (
    <>
      <div className="d-flex justify-content-end">
        <button
          className="mb-3 border-0 btn-md rounded-4 member"
          onClick={handleOpen}
        >
          Add new signatory
        </button>
      </div>
      <Table
        pageCount={pageCount}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        data={signatories}
        columns={columns}
        filename="Signatories"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <Modal
        isOpen={isOpen}
        onRequestClose={handleClose}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <div
          className="card rounded-4"
          style={{ border: "solid .2px #F2F2F2" }}
        >
          <div
            className="d-flex gap-2 p-3  align-items-center"
            style={{
              backgroundColor: "#f4fAfd",
              borderRadius: "15px 15px 0 0",
              cursor: "pointer",
            }}
          >
            <span>Add Signatory</span>
          </div>
          <form
            style={{ border: "solid 1px #fafafa" }}
            className="rounded-4"
            onSubmit={handleSubmit}
          >
            <div className="admin-task-forms px-3">
              <div className="d-flex flex-column gap-1">
                <label htmlFor="corporateName">
                  Corporate Name<sup className="text-danger">*</sup>
                </label>
                <input name="corporateName" onChange={changeHandler} />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="position">
                  Position<sup className="text-danger">*</sup>
                </label>
                <select name="position" onChange={changeHandler}>
                  <option value="">Select</option>
                  <option value="President">President</option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Vice president">Vice president</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="phoneNumber">
                  Phone Number<sup className="text-danger">*</sup>
                </label>
                <input
                  name="phoneNumber"
                  required
                  onChange={changeHandler}
                  type="number"
                />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="email">Email</label>
                <input name="email" onChange={changeHandler} />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="bvn">B.V.N</label>
                <input name="bvn" onChange={changeHandler} type="number" />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="passport">Passport Photo Upload</label>
                <input
                  name="passport"
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="idType">ID Type</label>
                <select name="idType" onChange={changeHandler}>
                  <option value="">Select</option>
                  {idTypes.map((type) => (
                    <option value={type.idCardId} key={type.idCardId}>
                      {type.idCardName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="idNo">ID Card No</label>
                <input name="idNo" onChange={changeHandler} type="number" />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="idCard">ID Upload</label>
                <input
                  name="idCard"
                  type="file"
                  onChange={(e) => setCard(e.target.files[0])}
                />
              </div>
            </div>
            <div
              className="d-flex justify-content-end gap-3 p-3 mt-3"
              style={{
                backgroundColor: "#f2f2f2",
                borderRadius: "0 0 15px 15px",
              }}
            >
              <button type="reset" className="btn-md px-3 rounded-5 border-0" onClick={handleClose}>
                Discard
              </button>
              <button
                type="submit"
                className="border-0 member btn-md"
                disabled={loading}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal to edit signatory */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={handleModalClose}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <div
          className="card rounded-4"
          style={{ border: "solid .2px #F2F2F2" }}
        >
          <div
            className="d-flex gap-2 p-3  align-items-center"
            style={{
              backgroundColor: "#f4fAfd",
              borderRadius: "15px 15px 0 0",
              cursor: "pointer",
            }}
          >
            <span>Update Signatory</span>
          </div>
          <form
            style={{ border: "solid 1px #fafafa" }}
            className="rounded-4"
            onSubmit={onSubmit}
          >
            <div className="admin-task-forms px-3">
              <div className="d-flex flex-column gap-1">
                <label htmlFor="corporateName">
                  Corporate Name<sup className="text-danger">*</sup>
                </label>
                <input name="fullname" value={input?.fullname} onChange={handleChange} />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="position">
                  Position<sup className="text-danger">*</sup>
                </label>
                <select name="position" value={input?.position} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="President">President</option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Vice president">Vice president</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="phoneNo">
                  Phone Number<sup className="text-danger">*</sup>
                </label>
                <input
                  name="phoneNo"
                  value={input?.phoneNo}
                  onChange={handleChange}
                  type="number"
                />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="email">Email</label>
                <input name="email" onChange={handleChange} value={input?.email}/>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="bvn">B.V.N</label>
                <input name="bvn" onChange={handleChange} value={input?.bvn} type="number" />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="passport">Passport Photo Upload</label>
                <input
                  name="passport"
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="idType">ID Type</label>
                <select name="iDtype" onChange={handleChange} value={input?.iDtype}>
                  <option value="">Select</option>
                  {idTypes.map((type) => (
                    <option value={type.idCardId} key={type.idCardId}>
                      {type.idCardName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="idNo">ID Card No</label>
                <input name="idNo" onChange={handleChange} type="number" value={input?.idNo}/>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="idCard">ID Upload</label>
                <input
                  name="idCard"
                  type="file"
                  onChange={(e) => setCard(e.target.files[0])}
                />
              </div>
            </div>
            <div
              className="d-flex justify-content-end gap-3 p-3 mt-3"
              style={{
                backgroundColor: "#f2f2f2",
                borderRadius: "0 0 15px 15px",
              }}
            >
              <button type="reset" className="btn-md px-3 rounded-5 border-0" onClick={handleClose}>
                Discard
              </button>
              <button
                type="submit"
                className="border-0 member btn-md"
                disabled={loading}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default Signatory;
