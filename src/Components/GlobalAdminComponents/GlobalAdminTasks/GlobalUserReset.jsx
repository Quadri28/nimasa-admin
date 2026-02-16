import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../AuthContext';
import axios from '../../axios';
import { toast, ToastContainer } from 'react-toastify';

const GlobalUserReset = () => {
  const { credentials } = useContext(UserContext);
  const [tenants, setTenants] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [tenant, setTenant]= useState(null)
  const [input, setInput] = useState(
    { 
    tenant: '',
    userId: '',
    loginStatus: false,
    lockCount: false,
    multiLogin: false,
    resetPassword: false,
    });
  const [password, setPassword]= useState('')
  

  useEffect(() => {
    axios.get('Admin/get-tenants', {
      headers: { Authorization: `Bearer ${credentials.token}` },
    })
      .then(resp => setTenants(resp.data.data))
      .catch(error => console.error("Error fetching tenants:", error));
  }, [credentials.token]);

  useEffect(() => {
    if (tenant) {
      axios.get(`Admin/get-users-by-tenant?nodeId=${tenant}`, {
        headers: { Authorization: `Bearer ${credentials.token}` },
      })
        .then(resp => setUserIds(resp.data.data))
        .catch(error => console.error("Error fetching user IDs:", error));
    }
  }, [tenant, credentials.token]);

  useEffect(() => {
    if (tenant && input.userId) {
      axios.get(`Admin/get-reset-user-detail?NodeId=${tenant}&UserId=${input.userId}`, {
        headers: { Authorization: `Bearer ${credentials.token}`},
      })
        .then(resp => setInput(resp.data.data))
        .catch(error => console.error("Error fetching user details:", error));
    }
  }, [tenant, input.userId]);

  const handleChange = (e) => {
    const { name, value, type, checked,  } = e.target;
    setInput({...input, [name]: type === 'checkbox' ? checked : value});
  };

  const resetUser = async (e) => {
    e.preventDefault();
    const payload = {
      nodeId: tenant,
      userId: input.userId,
      loginStatus: input.loginStatus,
      lockCount: input.lockCount,
      resetMultipleLogin: false,
      allowMultipleLogin: input.multiLogin,
      resetPassword: input.resetPassword ? true : false,
      password: input?.resetPassword ? password : null,
    };

    try {
      const response = await axios.post('Admin/reset-global-user', payload, {
        headers: { Authorization: `Bearer ${credentials.token}` }
      });
      toast(response.data.message, { type: 'success', autoClose: 5000 });
      
    } catch (error) {
      toast(error.response?.data.message || 'Error resetting user', { type: 'error', autoClose: false });
    }
  };

  return (
    <div className='p-3'>
      <h3 className='title-head'>Global User Reset</h3>
      <div className='my-3 rounded-4' style={{ border: 'solid .5px #F2F2F2' }}>
      <div
      className="py-3 px-4 form-header"
      style={{ backgroundColor: '#f4fAfd', borderRadius:'15px 15px 0 0' }}
    >
      <div style={{fontSize:'16px', fontWeight:'500', color:'#4D4D4D'}}>
      Global User Reset
      </div>
    </div>
        <form onSubmit={resetUser}>
          <div className="admin-task-forms p-3">
            <SelectField
              label="Tenant"
              name="tenant"
              options={tenants.map(t => ({ value: t.node_id, label: t.tenant.slice(0, 50) }))}
              onChange={(e)=>setTenant(e.target.value)}
              required
            />
            <SelectField
              label="User ID"
              name="userId"
              value={input.userId}
              options={userIds.map(u => ({ value: u.userid, label: u.fullName }))}
              onChange={handleChange}
              required
            />
          </div>
          <div className="statutory-list">
            <div className="d-flex justify-content-between">
          <CheckboxField
            label="Online"
            name="loginStatus"
            type='checkbox'
            checked={input.loginStatus}
            onChange={handleChange}
          />
          <CheckboxField
            label="Status Locked"
            type='checkbox'
            name="lockCount"
            checked={input.lockCount}
            onChange={handleChange}
          />
          </div>
          <div className="d-flex justify-content-between">
          <CheckboxField
            label="Allow Multiple Login"
            type='checkbox'
            name="multiLogin"
            checked={input.multiLogin}
            onChange={handleChange}
          />
          <CheckboxField
            label="Reset Password"
            type='checkbox'
            name="resetPassword"
            checked={input.resetPassword}
            onChange={handleChange}
          />
          </div>
          </div>
          {input?.resetPassword && 
          <div className="admin-task-forms">
          <div className="d-flex flex-column px-3 mb-3">
            <label htmlFor="password">Password</label>
            <input type="password" name='password' onChange={(e)=>setPassword(e.target.value)} />
          </div>
          </div>}
          <div className="d-flex justify-content-end gap-3 py-4 px-2" style={{ backgroundColor: "#FAFAFA", borderRadius: "0 0 10px 10px" }}>
            <button type="reset" className="btn btn-md rounded-5 py-1 px-3" style={{ backgroundColor: "#F7F7F7", fontSize: '14px' }}>
              Reset Page
            </button>
            <button type="submit" className="btn btn-md text-white rounded-5" style={{ backgroundColor: "var(--custom-color)", fontSize: '14px' }}>
              Reset User
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

const SelectField = ({ label, name, value, options, onChange, required, type}) => (
  <div className="d-flex flex-column gap-1">
    <label htmlFor={name}>{label}{required && <sup className="text-danger">*</sup>}</label>
    <select name={name} value={value} onChange={onChange} type='text'>
      <option value="">Select {label.toLowerCase()}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

const CheckboxField = ({ label, name, checked, onChange, type }) => (
  <div className="d-flex gap-1 px-3 mb-4 align-items-center" style={{ fontSize: '14px', color: '#4d4d4d' }}>
    <span>{label}</span>
    <input type="checkbox" name={name} checked={checked} onChange={onChange} />
  </div>
);

export default GlobalUserReset;