import axios from "../../../Components/axios";
import React, { useContext, useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../AuthContext";
import { toast, ToastContainer } from "react-toastify";

const AddNewRole = () => {
  const [input, setInput] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isOperation, setIsOperation] = useState(false);
  const [isAuthenticate, setIsAuthenticate] = useState(false);
  const { credentials } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSelectAll = (checked) => {
    const updatedRoles = roles.map((role) => ({
      ...role,
      isSelected: checked,
    }));
    setRoles(updatedRoles);
  };

  const handleCheck = (e) => {
    let updatedList = roles.map((role) => {
      if (role.menuId === e) {
        return { ...role, isSelected: !role.isSelected };
      }
      return role;
    });
    setRoles(updatedList);
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput({ ...input, [name]: value });
  };
  const getRoles = () => {
    axios("Roles/application-data-capture-privileges", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setRoles(resp.data.data));
  };
  useEffect(() => {
    getRoles();
  }, []);

  const createRole = (e) => {
    e.preventDefault();
    const payload = {
      roleName: input.roleName,
      roleDescription: input.roleDescription,
      isOperation: isOperation === false ? 0 : 1,
      canAuthenticate: isAuthenticate === false ? 0 : 1,
      accessDays: Number(input.accessDuration),
      nodeId: credentials?.logInfo?.nodeId,
      privileges: roles,
    };
    axios
      .post("Roles/add-role", payload, {
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
    <div className="bg-white p-3 rounded-4">
      <h4 style={{ fontSize: "18px", fontFamily: "General sans" }}>
        Add new role
      </h4>

      <form onSubmit={createRole}>
        <div>
          <div
            className="bg-white mt-4"
            style={{ border: "solid 1px #fafafa", borderRadius: "15px" }}
          >
            <div
              className="p-3 d-flex align-items-center gap-2"
              style={{
                backgroundColor: "#F5F9FF",
                borderRadius: "15px 15px 0 0",
              }}
            >
              <BsArrowLeft
                onClick={() => navigate(-1)}
                style={{ cursor: "pointer" }}
              />
              <span style={{ fontSize: "14px", color: "#4D4D4D" }}>
                {" "}
                Add user role
              </span>
            </div>
            <div className="admin-task-forms px-3 pb-1">
              <div className="d-flex flex-column gap-1">
                <label htmlFor="">
                  Enter role name <sup className="text-danger">*</sup>
                </label>
                <input
                  type="text"
                  required
                  name="roleName"
                  onChange={handleChange}
                />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="accessDuration">
                  Enter role access days <sup className="text-danger">*</sup>
                </label>
                <input
                  type="number"
                  required
                  name="accessDuration"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="statutory-list mt-3 px-3">
              <div className="d-flex gap-2 align-items-center">
                <input
                  type="checkbox"
                  name="isAuthenticate"
                  onChange={(e) => setIsAuthenticate(e.target.checked)}
                />
                <label>Can authorize?</label>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <input
                  type="checkbox"
                  name="isOperation"
                  onChange={(e) => setIsOperation(e.target.checked)}
                />
                <label>Can Post Operation Transaction?</label>
              </div>
            </div>
            <div className="px-3 d-flex flex-column gap-1 mt-2">
              <label htmlFor="roleDescription">Enter role description</label>
              <textarea
                type="text"
                required
                name="roleDescription"
                onChange={handleChange}
                style={{
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: "#f7f4f9",
                  height: "7rem",
                  padding: "5px",
                }}
              />
            </div>
            <div className="d-flex gap-2 align-items-center mb-2 px-3 mt-3">
              <input
                type="checkbox"
                onChange={(e) => handleSelectAll(e.target.checked)}
                checked={
                  roles.length > 0 && roles.every((role) => role.isSelected)
                }
              />
              <strong style={{ fontSize: "13px" }}>Select all roles</strong>
            </div>
            <div className="role-list px-3 my-4">
              {roles?.map((role) => (
                <div
                  className="d-flex justify-content-between align-items-center flex-wrap"
                  key={role.menuName}
                >
                  <div
                    className="d-flex gap-2 align-items-center"
                    style={{ fontSize: "14px" }}
                  >
                    <input
                      type="checkbox"
                      checked={!!role.isSelected}
                      onChange={() => handleCheck(role.menuId)}
                    />
                    <span style={{ fontSize: "12px" }}>{role?.menuName}</span>
                  </div>
                </div>
              ))}
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
              <button type="submit" className="btn-sm member border-0">
                Proceed
              </button>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddNewRole;
