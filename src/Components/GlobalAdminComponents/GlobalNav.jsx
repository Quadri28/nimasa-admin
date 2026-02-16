import React, { useContext, useState } from 'react'
import globalLogo from '../../assets/Logo.png'
import { FaBars, FaKey, FaRegUser, FaTimes, FaUserCircle } from 'react-icons/fa'
import { LuBell, LuSettings } from 'react-icons/lu'
import { RiQuestionnaireLine } from 'react-icons/ri'
import { LiaAngleDownSolid, LiaAngleUpSolid } from 'react-icons/lia'
import { UserContext } from '../AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { GlobalAdminDashboardRoutes } from './GlobalAdminDashboardRoutes'

const GlobalNav = ({handleShowSidebar, showSidebar}) => {
    const {credentials}= useContext(UserContext)
  const [show, setShow] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const navigate= useNavigate()
  
      const handleSubmit=(e)=>{
        e.preventDefault()
        localStorage.clear('cooperative-details')
        navigate('/')
    }
    const forgotPassword =()=>{
        const email= credentials.username;
        axios.post('Account/forgot-password', email, {headers:{
          Authorization: `Bearer ${credentials.token}`
        }}).then(()=>{
          console.log('logged out')
        })
      }

      const filteredRoutes = GlobalAdminDashboardRoutes.filter((route) =>
        route.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
  return (
    <div className="py-3 row admin-nav bg-white container-fluid align-items-center">
    <div className="mx-2 col-4 col-md-2 ">
      <img src={globalLogo} alt="Logo" className="img-fluid" style={{width:'60px'}}/>
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
          <div>
          <LuSettings className="nav-icon" /> 
          </div>
          <div style={{position:'relative'}}>
          <LuBell className="nav-icon bell" onClick={() => { setIsOpen(!isOpen) }}/>
           {/* Notification Dropdown */}
        {/* {isOpen && (
          <div className='notification-dropdown' ref={dropdownRef}>
         <div style={{backgroundColor:'#E6F0FF', padding:'7px 15px'}}>Notifications</div>
            {notifications?.length === 0 ? (
              <p>No new notifications</p>
            ) : (
              notifications.slice(0, 9).map((notif, index) => (
                <div key={index} onClick={()=>markAsRead(notif.id)}>
                  <Link to='/dashboard/notifications' style={{textDecoration:'none'}}>
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
        )} */}
        </div>
        <Link to='/dashboard/communications' className='text-dark'>
          <RiQuestionnaireLine className="nav-icon" />
          </Link>
          <div className="nav-drop">
          <div style={{display:'flex', gap:'5px'}}>
          {credentials?.logInfo?.memberImageUrl ?
           <img src={credentials?.logInfo?.memberImageUrl} 
           style={{borderRadius:'50%', height:'40px', width:'40px'}} />:<FaUserCircle size={28}/>}
         <div className="row" onClick={()=>setShow(prev=>!prev)}>
          <span style={{color:'#022B69', fontFamily:'Aeonik-md', fontWeight:'500'}}>
            {credentials?.logInfo?.fullname} </span> 
          <span >{credentials?.logInfo?.emailAddress} {show? <LiaAngleUpSolid /> :<LiaAngleDownSolid />}</span>
         </div>
         </div>
         <div className={show? 'drop-down bg-white p-3': 'no-show'}>
           <Link to='/dashboard/profile' className="d-flex gap-1 align-items-center"> <FaRegUser/> Profile </Link>
           <Link to='/' className="d-flex gap-1 align-items-center" onClick={forgotPassword}> <FaKey/> Recover password </Link>
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
  </div>
  )
}
export default GlobalNav;