import React, { useContext, useEffect, useState } from "react";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";

const AddNewUser = () => {
  const [detail, setDetail] = useState({});
  const [branches, setBranches] = useState([]);
  const [roles, setRoles] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [supervise, setSupervise] = useState(false);
  const [departments, setDepartments] = useState([]);
  const { credentials } = useContext(UserContext);

  const getStatuses = () => {
    axios("Users/user-status", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => {
      setStatuses(resp.data);
    });
  };

  const getBranches = () => {
    axios("Common/get-branches", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setBranches(resp.data));
  };
  const getRoles = () => {
    axios("Common/get-roles", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setRoles(resp.data));
  };
  const getDepartments = () => {
    axios("Common/get-departments", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setDepartments(resp.data));
  };
  useEffect(() => {
    getBranches();
    getRoles();
    getStatuses();
    getDepartments();
  }, []);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setDetail({ ...detail, [name]: value });
  };

  const addUser = (e) => {
    const payload = {
      staffid: detail.userId,
      staffName: detail.staffName,
      branch: detail.branch,
      department: detail.department,
      phoneno: detail.mobilePhoneNumber,
      email: detail.email,
      staffstatus: detail.status,
      reportlevel: detail.reportLevel,
      userFunction: detail.roleId,
      postAccountNumber: detail.postAccount,
      password: detail.password,
      supervisedOtherStaff: supervise,
    };
    e.preventDefault();
    axios
      .post("Account/member-signup", payload, {
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
          navigate(-1);
        }, 5000);
      })
      .catch((error) =>
        toast(error.response.data.message, { type: "error", autoClose: false })
      );
  };

  return (
    <div className="bg-white p-3 rounded-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 style={{ fontSize: "16px", color: "#1d1d1d" }}>Add new user</h4>
      </div>
      <form onSubmit={addUser}>
        <div
          className="p-3"
          style={{ backgroundColor: "#F5F9FF", borderRadius: "15px 15px 0 0" }}
        >
          <div
            className=" d-flex align-items-center gap-2 title-link"
            style={{ width: "fit-content" }}
            onClick={() => navigate(-1)}
          >
            <BsArrowLeft />{" "}
            <span style={{ fontSize: "14px" }}> Add new user </span>
          </div>
        </div>
        <div
          className="px-3 pt-2 pb-4"
          style={{ borderInline: "1px solid #ddd" }}
        >
          <div className="admin-task-forms">
            <div className="d-flex flex-column gap-1">
              <label htmlFor="userId">
                Staff user ID<sup className="text-danger">*</sup>
              </label>
              <input type="text" name="userId" onChange={handleChange} />
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="staffName">
                Staff name<sup className="text-danger">*</sup>
              </label>
              <input type="text" name="staffName" onChange={handleChange} />
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="userId">
                Branch<sup className="text-danger">*</sup>
              </label>
              <select type="text" name="branch" onChange={handleChange}>
                <option value="">Select</option>
                {branches.map((branch) => (
                  <option value={branch.branchCode} key={branch.branchCode}>
                    {branch.branchName}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="userId">
                Department<sup className="text-danger">*</sup>
              </label>
              <select type="text" name="department" onChange={handleChange}>
                <option value="">Select</option>
                {departments.map((department) => (
                  <option
                    value={department.departmentId}
                    key={department.departmentId}
                  >
                    {department.departmentName}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="email">
                Email<sup className="text-danger">*</sup>
              </label>
              <input type="text" name="email" onChange={handleChange} />
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="role">
                Role<sup className="text-danger">*</sup>
              </label>
              <select type="text" name="roleId" onChange={handleChange}>
                <option value="">Select</option>
                {roles.map((role) => (
                  <option value={role.roleId} key={role.roleId}>
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="mobilePhoneNumber">
                Phone number<sup className="text-danger">*</sup>
              </label>
              <input
                type="text"
                name="mobilePhoneNumber"
                onChange={handleChange}
              />
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="status">
                User status<sup className="text-danger">*</sup>
              </label>
              <select type="text" name="status" onChange={handleChange}>
                <option value="">Select</option>
                {statuses.map((status) => (
                  <option value={status.value} key={status.value}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" onChange={handleChange} />
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="multipleLogin">
              Does this user supervise others?
              <sup className="text-danger">*</sup>
            </label>
            <div className="d-flex gap-2">
              <span
                className="d-flex align-items-center gap-1"
                style={{ fontSize: "14px" }}
              >
                <input
                  type="checkbox"
                  name="multipleLogin"
                  onChange={(e) => setSupervise(e.target.checked)}
                />{" "}
                Yes, the user does
              </span>
            </div>
            {/* <div className="d-flex flex-column gap-1">
            <label htmlFor="postAccount">Till Account</label>
             <input type="number" name='postAccount' onChange={handleChange} />
        </div> */}
            {/* <div className="d-flex flex-column gap-1">
            <label htmlFor="reportLevel">Reports to?</label>
             <select name='reportLevel' onChange={changeHandler} >
            <option value="">Select</option>
            {
                supervisors.map(supervisor=>(
                    <option value={supervisor.userId} key={supervisor.userId}>{supervisor.fullName}</option>
                ))
            }
            </select>
        </div> */}
          </div>
        </div>
        <div
          style={{ backgroundColor: "#f2f2f2", borderRadius: "0 0 10px 10px" }}
          className="d-flex justify-content-end gap-3 p-3"
        >
          <button
            type="reset"
            className="btn btn-sm rounded-5"
            style={{ backgroundColor: "#f7f7f7" }}
          >
            Discard
          </button>
          <button type="submit" className="border-0 btn-sm member">
            Proceed
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddNewUser;
