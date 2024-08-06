import { useEffect, useState } from 'react';
import '../../assets/css/Home.css';


const Header = ({onSwitcherChange}) => {
    useEffect(()=>{
        details();
    },[])

    const searchparams = new URLSearchParams(window.location.search);
    const token = searchparams.get("token");
    const logo = require('../../assets/images/_d188e314-5479-4529-acad-ea7653f4a611.jpeg');
    const [user , setUser] = useState(null)

    const details = () => {

        
        fetch("https://online-auction-backend.onrender.com/api/auth/getdetails",{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token
          },
          body: JSON.stringify({ token }),
        })
          .catch((err) => {
            window.location.href = 'https://main--fastbid.netlify.app'
            console.log("Error is", err);
          })
          .then(data=>data.json())
          .then(
            (data2) => {
                if(data2.error=="Token revoked"){
                    window.location.href = 'https://main--fastbid.netlify.app'
                }
                setUser(data2.user)}
          )
      };

      const handleLogout = () => {
        fetch("https://online-auction-backend.onrender.com/api/auth/logout",{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token
          },
          body: JSON.stringify({ message:"logout" }),
        })
          .catch((err) => {
            console.log("Error is", err);
          }).then(()=>{ window.location.href = 'https://main--fastbid.netlify.app'
        })
      }

    return (
        <header>
            <div className="logo">
                <img src={logo} alt="Logo" style={{width:"6vw", height:"13vh" , borderRadius:"50%"}}/>
                <b onClick={() => onSwitcherChange("Home")} style={{cursor:"pointer" ,fontFamily:"Cambria", fontSize:"24px"}}> &nbsp; FastBid</b>
            </div>
            <nav>
                <ul className="navigation">
                    <li onClick={() => onSwitcherChange("History")}>History</li>
                    <li onClick={() => onSwitcherChange("Notifications")}>Notifications</li>
                    <li onClick={() => onSwitcherChange("Upcoming Auctions")}>Upcoming Auctions</li>
                    <li className="dropdown">
                        <div className="btn-group">
                            <div type="div" data-bs-toggle="dropdown" aria-expanded="false" id="dropdown-box-button">
                                Welcome {user ? user.name : ''}
                            </div>
                            <ul className="dropdown-menu dropdown-menu-start">
                                <li><button className="dropdown-item" type="button" onClick={() => onSwitcherChange("Addcoins")}>Add Coins</button></li>
                                <li><button className="dropdown-item" type="button">Accounts</button></li>
                                <li><button className="dropdown-item" type="button" onClick = {handleLogout}>Logout</button></li>
                            </ul>
                        </div>
                    </li>
                    <li>🪙 {user ? user.coins : 0}</li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;

