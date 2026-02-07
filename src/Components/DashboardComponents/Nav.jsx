import React,{useContext, useEffect, useState, useRef} from "react";
import adminLogo from "../../assets/Logo.png";
import { LuSettings, LuBell } from "react-icons/lu";
import { RiQuestionnaireLine } from "react-icons/ri";
import "./Nav.css";
import { LiaAngleDownSolid, LiaAngleUpSolid } from "react-icons/lia";
import { UserContext } from "../AuthContext";
import { FaKey, FaRegUser, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";
import { toast, ToastContainer } from "react-toastify";
import { DashboardRoutes } from "./DashboardRoutes";

function Nav({handleShowSidebar, showSidebar}) {
  const [show, setShow] = useState(false)
  const [notifications, setNotifications]= useState([])
  const [isOpen, setIsOpen] = useState(false)
  const {credentials} = useContext(UserContext)

  const fetchNotifications= ()=>{
     axios('Notifications', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      setNotifications(resp.data)
    })
  }

  useEffect(()=>{
    fetchNotifications()
  }, [])
  const navigate = useNavigate()
const handleSubmit =(e)=>{
  e.preventDefault()
// const payload={
//   refreshToken: credentials.refreshToken,
// }
//   axios.post('Account/logout', payload, {headers:{
//     Authorization: `Bearer ${credentials.token}`
//   }})
  // .then((resp)=>{
  //   toast(resp.data.message, {type:'success', autoClose:3000})
    // setTimeout(() => {
      sessionStorage.clear('cooperative-details')
      window.location.replace("/"); 
    // }, 3000);
  // })
}


const markAsRead = (id) => {
 axios.post(`Notifications/${id}/read`, {}, {headers:{
  Authorization: `Bearer ${credentials.token}`
 }}).then(()=>{
  
 })
};

const dropdownRef = useRef(null); // Ref for dropdown

// Function to handle click outside
useEffect(() => {
  function handleClickOutside(event) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false); // Close dropdown
    }
  }

  if (isOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [isOpen]);

const [searchTerm, setSearchTerm] = useState("");

  const filteredRoutes = DashboardRoutes.filter((route) =>
    route.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-3 row admin-nav bg-white container-fluid align-items-center">
      <div className="ml-2 col-2">
        <img src={adminLogo} 
        alt="Logo" className="img-fluid" style={{ height:'60px', objectFit:'contain'}}/>
      </div>
      <div className="icon-container align-items-center col position-relative">
      <input
            type="text"
            className="search-bar"
            placeholder="Search anything"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
        <ul className="position-absolute z-10 bg-white p-2 w-50 border rounded-2 shadow  max-h-60 overflow-auto"
         style={{top:'100%'}}>
          {filteredRoutes.length > 0 ? (
            filteredRoutes.map((route, index) => (
              <li>
              <Link
              to={route.path}
                key={index}
                onClick={()=>handleNavigate()}
                className="cursor-pointer text-dark"
                style={{textDecoration:'none'}}
              >
                {route.label}
              </Link>
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">No matches found</li>
          )}
        </ul>
      )}
        <Link to='/admin-dashboard/configurations' className="text-dark"><LuSettings className="nav-icon" /></Link>
        <div style={{position:'relative'}}>
         <LuBell className="nav-icon bell" onClick={() => { setIsOpen(!isOpen) }}/>
        {/* Notification Dropdown */}
        {isOpen && (
          <div className='notification-dropdown' ref={dropdownRef}>
         <div style={{backgroundColor:'#E6F0FF', padding:'7px 15px'}}>Notifications</div>
            {notifications?.length === 0 ? (
              <p>No new notifications</p>
            ) : (
              notifications.slice(0, 9).map((notif, index) => (
                <div key={index} onClick={()=>markAsRead(notif.id)}>
                  <Link to='/notifications' style={{textDecoration:'none'}}>
                  <div className="px-3 mt-2">
                  <div className="d-flex gap-2 align-items-center">
                  <div style={{backgroundColor:'#3785FB', color:'#fff', borderRadius:'50%',
                    height:'32px', width:'32px'
                  }} className="d-flex justify-content-center align-items-center">
                    <LuBell/> 
                  </div><span style={{fontWeight:600,  color:'#000'}}>{notif.category}</span>
                  </div>
                  <p style={{fontSize:'13px', color:'#333'}}>{notif.message.slice(0, 60)}... <br />
                  {new Date(notif.createdOn).toLocaleString()}</p>
                  <hr />
                </div>
                </Link>
                </div>
              ))
            )}
          </div>
        )}
         </div>
         <div>
          <Link to='/admin-dashboard/support' className="text-dark">
        <RiQuestionnaireLine className="nav-icon" style={{cursor:'pointer'}}/></Link>
        </div>
        <div className="nav-drop">
        <div style={{display:'flex', gap:'5px'}}>
          <FaUserCircle size={30}/>
       <div className="row" onClick={()=>setShow(prev=>!prev)}>
        <span style={{color:'#022B69', fontFamily:'Aeonik-md', fontWeight:'500'}}>{credentials?.logInfo?.fullname} </span> 
        <span >{credentials?.logInfo?.emailAddress} {show? <LiaAngleUpSolid /> :<LiaAngleDownSolid />}</span>
       </div>
       </div>
       <div className={show? 'drop-down bg-white p-3': 'no-show'}>
         <Link to='/admin-dashboard/admin-tasks/manage-users' className="d-flex gap-1 align-items-center" 
         onClick={()=>setShow(prev=>!prev)}> 
         <FaRegUser/> Profile </Link>
         <Link to='/admin-dashboard/configurations/change-password' className="d-flex gap-1 align-items-center"> 
         <FaKey/> Change password </Link>
         <form onSubmit={handleSubmit}>
         <button className="show-button py-2 px-2 rounded-3 border-0">Logout</button>
         </form>
        </div>
        </div>
        <div onClick={handleShowSidebar} className="toggle-icon">
        {showSidebar ? (
                <FaTimes style={{ color: "#3A358C" }} />
              ) : (
                <FaBars style={{ color: "#3A358C" }} />
              )}
         </div>
      </div>
      <ToastContainer/>
    </div>
  );
}
export default Nav;
