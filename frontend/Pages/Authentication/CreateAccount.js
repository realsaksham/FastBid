import React, { useState } from 'react';
import { Link } from "react-router-dom";
import '../../assets/css/Auth.css';
import Loader from './AuthLoader';

const Create_Account = () => {

const [email,setemail]=useState('');
const [username,setusername]=useState('');
const[switcher,setswitcher]=useState(0);
const[pwd,setpwd]=useState('');
const[conpwd,setconpwd]=useState('');
const[otp,setotp]=useState('');


const sendotp=(e)=>{
  e.preventDefault();
  if(pwd!=conpwd){
    window.alert("Password doesnot match");
  }else{
    setswitcher('loader')
    fetch("https://online-auction-backend.onrender.com/api/auth/send-otp",{
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username,email,pwd}),
    })
    .then(response => {
      return response.json()
    })
    .then(json => {
      if(json.success){
        setswitcher(2)
      }
      else{
        setswitcher(0);
        alert(json.error)
      }
    })
    .catch((err)=>{
      setswitcher(0);
      console.log(err);
    })
  }
 }

 const verifyotp=(e)=>{
  e.preventDefault();
      setswitcher('loader')
  fetch("https://online-auction-backend.onrender.com/api/auth/signup",{
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({otp,username,email,pwd}),
    })
    .then(response => {
      return response.json()
    })
    .then(json => {
      if(json.success){
        window.location.href = 'https://main--fastbid.netlify.app'
        alert('Account Created Successfully')
        setswitcher(2);
      } 
      else{
        setswitcher(2);
        alert(json.error)
      }
    })
    .catch((err)=>{
      setswitcher(2);
      console.log(err);
    })
 }
const ChangePage=()=>{
  setswitcher(1)
}
const ChangePage2=()=>{
  setswitcher(0)
}

  if(switcher==0){return (
    <div className="background">
      <div className="shape"></div>
      <div className="shape"></div>
      <div>
      <form className="AuthForm">
        <h3>Create Account</h3>

        <label htmlFor="UserName" >Username</label>
        <input type="text" placeholder="Username" id="username" onChange={(e)=>{setusername(e.target.value)}} />

        <label htmlFor="Email" >Email</label>
        <input type="text" placeholder="Email" id="username" onChange={(e)=>{setemail(e.target.value)}} />

        <button className="AuthButton" onClick={ChangePage}>Next</button>
        <br></br>
        <br></br>
        <br></br>
        <Link to="/">Already have an Account</Link>
      </form>
      </div>
    </div>
  );}else if(switcher==1 || switcher=='loader'){
    return <div className="background">
      <div className="shape"></div>
      <div className="shape"></div>
      <form className="AuthForm">
        {switcher!='loader' ? <h3>Set Password</h3>:<></>}
        {switcher=='loader' ? <Loader/>:<></>}
        <label htmlFor="UserName" >Password</label>
        <input type="password" placeholder="Password" id="username" onChange={(e)=>{setpwd(e.target.value)}} />

        <label htmlFor="Email" >Confirm Password</label>
        <input type="password" placeholder="Confirm Password" id="username" onChange={(e)=>{setconpwd(e.target.value)}} />

        <button className="AuthButton" onClick={sendotp} >Send OTP</button>
        <button className="AuthButton" style={{marginTop:"15px" , width:"30%"}} onClick={ChangePage2}>Back</button>
      </form>
    </div>
  }else if(switcher==2 || switcher=='loader'){
    return <div className="background">
    <div className="shape"></div>
    <div className="shape"></div>
    <form className="AuthForm">
      <h3>Verify OTP</h3>

      <label htmlFor="OTP" >OTP</label>
      <input type="text" placeholder="OTP" id="otpInput" value={otp} onChange={(e)=>{setotp(e.target.value)}} />

      <button className="AuthButton" onClick={verifyotp} >Verify OTP</button>
    </form>
  </div>
  }
};

export default Create_Account;
