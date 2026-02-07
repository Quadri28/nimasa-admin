import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from './AuthContext'
import axios from './axios'
import { categorizeNotifications, NotificationItem } from './CategorizeNotification'

const Notifications = () => {
    const [notifications, setNotifications]= useState([])
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

      const categorized = categorizeNotifications(notifications);
  return (
    <>
            <h5>Notifications</h5>
    <div className='bg-white rounded-4 p-3'>
      {
        notifications.length > 0 ? <div>
            <>
                {categorized.today.length > 0 && (
                  <div className='my-3'>
                    <h6 style={{fontWeight:'500', color:'#666666', fontSize:'14px'}}>Today</h6>
                    {categorized.today.map((notif, index) => (
                      <NotificationItem key={index} notif={notif} />
                    ))}
                  </div>
                )}

                {categorized.yesterday.length > 0 && (
                  <div className='my-3'>
                    <h6 style={{fontWeight:'500', color:'#666666', fontSize:'14px'}}>Yesterday</h6>
                    {categorized.yesterday.map((notif, index) => (
                      <NotificationItem key={index} notif={notif} />
                    ))}
                  </div>
                )}

                {categorized.lastWeek.length > 0 && (
                  <div className='my-3'>
                    <h6 style={{fontWeight:'500', color:'#666666', fontSize:'14px'}}>Last Week</h6>
                    {categorized.lastWeek.map((notif, index) => (
                      <NotificationItem key={index} notif={notif} />
                    ))}
                  </div>
                )}

                {categorized.older.length > 0 && (
                  <div>
                    <h6>Older</h6>
                    {categorized.older.map((notif, index) => (
                      <NotificationItem key={index} notif={notif} />
                    ))}
                  </div>
                )}
              </>
        
        </div>
        :<div className="d-flex justify-content-center">
            No notifications yet...
        </div>
      }
    </div>
    </>
  )
}

export default Notifications
