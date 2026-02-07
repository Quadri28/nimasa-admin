import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { BsArrowLeft } from "react-icons/bs";

const EditGLAccount = () => {
  const [classes, setClasses] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [gl, setGl] = useState({});
  const { id } = useParams();
  const { credentials } = useContext(UserContext);

  const changeHandler = (event) => {
    const { name, type, value, checked } = event.target;
    setGl((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const getCurrencies = () => {
    axios("Common/get-currencies", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setCurrencies(resp.data));
  };
  useEffect(() => {
    getCurrencies();
  }, []);

  const getGlTypeClasses = () => {
    axios("GlAccount/gl-type-class-v2", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setClasses(resp.data.data));
  };
  useEffect(() => {
    getGlTypeClasses();
  }, []);

  const getGlDetails = () => {
    axios(`GlAccount/gl-number?AccountNumber=${id}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => {
      setGl(resp.data.data);
    });
  };

  useEffect(() => {
    getGlDetails();
  }, [id]);

  const navigate = useNavigate();

  const updateGlAccount = (e) => {
    e.preventDefault();
    const payload = {
      glTypeClassCode: gl.glClassCode,
      currencyCode: gl.currencyCode,
      accountName: gl.acctName,
      accountNumber: gl.glnumber,
      bookBalance: gl.bkbalance,
      pointing: Boolean(gl.pointing),
      status: gl.status,
      pointingType: gl.typep,
      populateGL: gl.populate,
      swing: gl.swing,
      isSystemPosting: gl.post,
    };
    axios
      .post("GlAccount/update-gl-account", payload, {
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
            navigate(-1)
        }, 5000);
      })
      .catch((error) =>
        toast(error.response.data.message, { type: "error", autoClose: false })
      );
  };
  return (
    <div className="bg-white p-3 rounded-4">
      <h4 style={{ fontSize: "18px", fontFamily: "General sans" }}>
        Edit GL account
      </h4>
      <form onSubmit={updateGlAccount}>
        <div
          className="bg-white mt-4"
          style={{ border: "solid 1px #fafafa", borderRadius: "15px" }}
        >
          <div
            className="p-3 d-flex align-items-center gap-2"
            style={{
              backgroundColor: "#F5F9FF",
              borderRadius: "15px 15px 0 0",
              cursor: "pointer",
            }}
          >
            <BsArrowLeft onClick={() => navigate(-1)}/>{" "}
            <span style={{ fontSize: "14px", color: "#4D4D4D" }} >
              {" "}
              Edit GL account{" "}
            </span>
          </div>
          <div className="admin-task-forms px-3">
            <div className="d-flex flex-column">
              <label htmlFor="glClassCode">
                GL Type Class<sup className="text-danger">*</sup>
              </label>
              <select
                type="text"
                name="glClassCode"
                onChange={changeHandler}
                value={gl?.glClassCode}
              >
                <option value="">Select</option>
                {classes?.map((cla) => (
                  <option value={cla.gl_ClassCode} key={cla.gl_ClassCode}>
                    {cla.gl_ClassName}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="glnumber">
                GL Account Number<sup className="text-danger">*</sup>
              </label>
              <input
                type="text"
                name="glnumber"
                disabled
                value={gl?.glnumber}
              />
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="acctName">
                GL Account Description<sup className="text-danger">*</sup>
              </label>
              <input
                type="text"
                name="acctName"
                onChange={changeHandler}
                value={gl?.acctName}
              />
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="bkbalance">
                Book Balance<sup className="text-danger">*</sup>
              </label>
              <input
                type="number"
                disabled
                name="bkbalance"
                value={gl?.bkbalance}
              />
            </div>
            <div className="d-flex align-items-center gap-1">
              <label htmlFor="pointing">Pointing?</label>
              <span
                
                style={{ fontSize: "14px" }}
              >
                
                <input
                  name="pointing"
                  type="checkbox"
                  checked={gl?.pointing}
                  onChange={changeHandler}
                />
              </span>
            
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="status">
                Status <sup className="text-danger">*</sup>
              </label>
              <select
                type="text"
                name="status"
                onChange={changeHandler}
                value={gl?.status}
              >
                <option value="">Select</option>
            <option value={0}>Newly created</option>
            <option value={1}>Available</option>
            <option value={2}>Closed</option>
              </select>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="typep">
                Pointing Type <sup className="text-danger">*</sup>
              </label>
              <select
                name="typep"
                value={gl.typep}
                onChange={changeHandler}
              >
                <option value="">Select</option>
                <option value="D">Dr</option>
                <option value="C">Cr</option>
              </select>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="currencyCode">
                Currency <sup className="text-danger">*</sup>
              </label>
              <select
                type="text"
                name="currencyCode"
                value={gl?.currencyCode}
                onChange={changeHandler}
              >
                <option value="">Select</option>
                {currencies.map((currency) => (
                  <option
                    value={currency.countryCode}
                    key={currency.countryCode}
                  >
                    {currency.currencyName}
                  </option>
                ))}
              </select>
            </div>
            {/* <div className="d-flex flex-column gap-1">
              <label htmlFor="populate">Populate GL?</label>
              <span
                className="d-flex align-items-center gap-1"
                style={{ fontSize: "14px" }}
              >
                Yes, populate GL
                <input
                  name="populate"
                  type="checkbox"
                  checked={gl?.populate}
                  onChange={changeHandler}
                />
              </span>
            </div> */}
  </div>
<div className="statutory-list px-3 my-3">
            <div className="d-flex flex-column gap-1">
              <label htmlFor="swing">Swing?</label>
              <span
                className="d-flex align-items-center gap-1"
                style={{ fontSize: "14px" }}
              >
                Yes, swing
                <input
                  name="swing"
                  type="checkbox"
                  onChange={changeHandler}
                  checked={gl?.swing}
                />
              </span>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="post">Is System Posting?</label>
              <span
                className="d-flex align-items-center gap-1"
                style={{ fontSize: "14px" }}
              >
                Yes, system is posting
                <input
                  name="post"
                  type="checkbox"
                  onChange={changeHandler}
                  checked={gl?.post}
                />
              </span>
            </div>
          </div>
          <div
            style={{
              backgroundColor: "#f2f2f2",
              borderRadius: "0 0 15px 15px",
            }}
            className="d-flex justify-content-end gap-3 p-3"
          >
            <button
              type="reset"
              className="btn btn-sm rounded-5"
              style={{ backgroundColor: "#f7f7f7" }}
            >
              Discard
            </button>
            <button type="submit" className="btn-md border-0  member">
              Proceed
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditGLAccount;
