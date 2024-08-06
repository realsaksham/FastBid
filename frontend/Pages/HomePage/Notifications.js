
import React , { useState , useEffect } from 'react'
import '../../assets/css/Notifications.css'
import formatDate from  '../../assets/Utils/FormatDate';

export default function Notifications() {

    const searchparams = new URLSearchParams(window.location.search);
    const token = searchparams.get("token");
    const [notifications , setNotifications] = useState([])

    const fetchNotifications = async () => {
        try {
            
            const response = await fetch(`https://online-auction-backend.onrender.com/api/auth/fetchNotifications`, {
              method: "GET",
              headers: {
                  "content-type": "application/json",
                  "auth-token": token
              },
            });
            const json = await response.json();
            if(json.success)    setNotifications(json.notifications)
            console.log(json);
    
        } catch (error) {
            console.error("Error While Fetching Notification" , error)
        }
      }
    
      useEffect(() => {
        fetchNotifications()
      }, [])
  
  return (
    <div className='flex-container1'>
      <div className='box'>
        <h1 className='heading'>Notifications</h1>

        {notifications.map((item , index) => (
          <div key = {index} className='notifiBox'>
            <p>{item.message}</p>
            <p className='date'>{formatDate(item.date)}</p>
          </div>
        ))}
      </div>
    </div>

  )
}

