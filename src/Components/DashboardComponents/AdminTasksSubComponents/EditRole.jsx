import React, { useContext, useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { toast, ToastContainer } from "react-toastify";

const EditRole = () => {
  const [role, setRole] = useState({});
  const { id } = useParams();
  const [privileges, setPrivileges] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [accessDays, setAccessDays] = useState("");
  const [isOperation, setIsOperation] = useState("");
  const [canAuthenticate, setCanAuthenticate] = useState("");
  const { credentials } = useContext(UserContext);
  const navigate = useNavigate();

  const getRole = () => {
    axios(`/Roles/${id}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => {
      setRole(resp.data.data);
      setAccessDays(resp.data.data.accessDays);
      setRoleName(resp.data.data.roleName);
      setCanAuthenticate(resp.data.data.canAuthenticate);
      setIsOperation(resp.data.data.isOperation);
      setRoleDescription(resp.data.data.roleDescription);
      setPrivileges(resp.data.data.privilegdes);
    });
  };
  useEffect(() => {
    getRole();
  }, [id]);

  const handleSelectAll = (checked) => {
    const updatedPrivileges = privileges.map((priv) => ({
      ...priv,
      isAssigned: checked,
    }));
    setPrivileges(updatedPrivileges);
  };

  const handleCheck = (e) => {
    let updatedList = privileges.map((role) => {
      if (role.menuId === e) {
        return { ...role, isAssigned: !role.isAssigned };
      }
      return role;
    });
    setPrivileges(updatedList);
  };

   const editRole = (e) => {
  e.preventDefault();

  const formattedPrivileges = privileges.map((priv) => ({
    ...priv,
    menuId: String(priv.menuId),
  }));

  const payload = {
    isOperation: Number(isOperation),
    canAuthenticate: Number(canAuthenticate),
    roleId: id,
    roleName: roleName,
    roleDescription: roleDescription,
    accessDays: Number(accessDays),
    privileges: formattedPrivileges,
  };

  axios
    .post("Roles/update-role", payload, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    })
    .then((resp) => {
      toast(resp.data.data, {
        type: "success",
        pauseOnHover: true,
        autoClose: 5000,
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
        Manage roles
      </h4>
      <div
        className="bg-white mt-4"
        style={{ border: "solid 1px #fafafa", borderRadius: "15px" }}
      >
        <div
          className="p-3 d-flex align-items-center gap-2"
          style={{ backgroundColor: "#F5F9FF", borderRadius: "15px 15px 0 0" }}
        >
          <BsArrowLeft
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
          />{" "}
          <span style={{ fontSize: "14px", color: "#4D4D4D" }}>
            {" "}
            Edit user role{" "}
          </span>
        </div>
        <form onSubmit={editRole}>
          <div className="admin-task-forms p-3">
            <div className="d-flex flex-column gap-1 ">
              <label htmlFor="">Role name</label>
              <input type="text" name="roleName" value={roleName} disabled />
            </div>
            <div className="d-flex flex-column gap-1 ">
              <label htmlFor="">Role access duration</label>
              <input
                type="text"
                name="accessDays"
                value={accessDays}
                onChange={(e) => setAccessDays(e.target.value)}
              />
            </div>
          </div>
          <div className="d-flex flex-column gap-1 mx-3 mb-4">
            <label htmlFor="roleDescription">Role description</label>
            <textarea
              name="roleDescription"
              style={{
                height: "7rem",
                borderRadius: "12px",
                border: "none",
                backgroundColor: "#F7F7F7",
                padding: "5px",
              }}
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
            />
          </div>
          <div className="admin-task-forms px-3">
            <div className="d-flex gap-2  flex-column">
              <label>Can authorize?</label>
              <select
                name="canAuthenticate"
                value={canAuthenticate}
                onChange={(e) => setCanAuthenticate(e.target.value)}
                className="w-100"
              >
                <option value="">Select</option>
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </select>
            </div>
            <div className="d-flex gap-2 flex-column">
              <label>Can Post Operation Transaction?</label>
              <select
                name="isOperation"
                value={isOperation}
                onChange={(e) => setIsOperation(e.target.value)}
                className="w-100"
              >
                <option value="">Select</option>
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </select>
            </div>
          </div>
          <div className="d-flex gap-2 align-items-center mb-2 mt-3 px-3">
            <input
              type="checkbox"
              onChange={(e) => handleSelectAll(e.target.checked)}
              checked={
                privileges.length > 0 &&
                privileges.every((priv) => priv.isAssigned)
              }
            />
            <strong style={{ fontSize: "13px" }}>Select all privileges</strong>
          </div>
          <div className="role-list px-3 my-4">
            {privileges?.map((role) => (
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
                    name={role?.menuName}
                    checked={role?.isAssigned}
                    onChange={(e) => handleCheck(role?.menuId)}
                  />
                  <span style={{ fontSize: "12px" }}>{role?.menuName}</span>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              backgroundColor: "#f2f2f2",
              borderRadius: "0 0 10px 10px",
            }}
            className="d-flex justify-content-end gap-3 p-3"
          >
            <button
              type="reset"
              className="btn btn-md rounded-5"
              style={{ backgroundColor: "#f7f7f7" }}
            >
              Discard
            </button>
            <button type="submit" className="border-0 btn-md member">
              Proceed
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditRole;
