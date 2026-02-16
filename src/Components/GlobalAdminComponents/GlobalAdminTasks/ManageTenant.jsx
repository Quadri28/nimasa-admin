import React, { useContext, useEffect, useState } from "react";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { toast, ToastContainer } from "react-toastify";

const ManageTenant = () => {
  const [tenants, setTenants] = useState([]);
  const [tenant, setTenant] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const { credentials } = useContext(UserContext);
  const getTenants = async () => {
    await axios("Admin/get-tenants", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setTenants(resp.data.data));
  };
  useEffect(() => {
    getTenants();
  }, []);
  const getPrivileges = async () => {
    await axios(`Admin/get-mapped-tenant?TenantId=${tenant}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setPrivileges(resp.data.data));
  };
  useEffect(() => {
    getPrivileges();
  }, [tenant]);

  const handleCheck = (e) => {
    let updatedList = privileges.map((account) => {
      if (account.tenantName === e) {
        return { ...account, isMapped: !account.isMapped };
      }
      return account;
    });
    setPrivileges(updatedList);
  };

  const mapTenant = async (e) => {
    e.preventDefault();
    const payload ={
      mappedTenantId: Number(tenant),
      tenantMappings: privileges
    }
    await axios
      .post("Admin/map-tenant", payload, {
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
        getPrivileges()
      })
      .catch((error) =>
        toast(error.response.data.message, { type: "error", autoClose: false })
      );
  };
  return (
    <div className="p-3 ">
      <h3 className="title-head">Manage Tenant</h3>
      <div className="my-3 rounded-4" style={{ border: "solid .5px #F2F2F2" }}>
        <div
          className="py-3 px-4 form-header"
          style={{ backgroundColor: "#f4fAfd", borderRadius: "15px 15px 0 0" }}
        >
          <div
            style={{ fontSize: "16px", fontWeight: "500", color: "#4D4D4D" }}
          >
            Map tenant
          </div>
        </div>
        <form onSubmit={mapTenant}>
          <div className="d-flex flex-column gap-1 p-3">
            <label htmlFor="tenant">
              Tenant <sup className="text-danger">*</sup>
            </label>
            <select
              type="text"
              className="w-100"
              name="tenant"
              style={{
                backgroundColor: "#F7F7F7",
                border: "solid 1px #F7F7F7",
                borderRadius: "12px",
                height: "50px",
                paddingInline: "5px",
              }}
              onChange={(e) => setTenant(e.target.value)}
            >
              <option value="">Select</option>
              {tenants.map((tenant) => (
                <option value={tenant.node_id} key={tenant.node_id}>
                  {tenant.tenant}
                </option>
              ))}
            </select>
          </div>
          <div className="statutory-list px-3 my-4">
            {privileges?.map((account) => (
              <div className="d-flex justify-content-between align-items-center">
                <div
                  className="d-flex gap-2 align-items-center"
                  style={{ fontSize: "14px" }}
                >
                  <input
                    type="checkbox"
                    name={account.tenantName}
                    onChange={() => handleCheck(account.tenantName)}
                    checked={account?.isMapped}
                  />
                  <span style={{ fontSize: "12px" }}>{account.tenantName}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    alignItems: "center",
                    fontSize: "12px",
                    color: "#333",
                    borderRadius: "1.5rem",
                    border: "none",
                    padding: "8.33px",
                  }}
                  className={account.isMapped === true ? "mapped" : "un-mapped"}
                >
                  <hr
                    className={
                      account.isMapped === true ? "hr-map" : "un-mapped-hr"
                    }
                  />
                  <span>
                    {account.isMapped === true ? "Mapped" : "Unmapped"}
                  </span>
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
            <button type="submit" className="btn-sm member px-3 border-0">
              Proceed
            </button>
          </div>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default ManageTenant;
