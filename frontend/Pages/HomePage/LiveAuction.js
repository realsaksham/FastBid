
import React , { useEffect, useState } from 'react'
import '../../assets/css/liveAuction.css'
import { io } from "socket.io-client";

const socket = io('http://localhost:3001');

export default function LiveAuction({ changeSwitcher , auction }) {

  const auctionId=auction._id;
  const searchparams = new URLSearchParams(window.location.search);
  const token = searchparams.get("token");
  const[timerclass,settimerclass]=useState('timer');

  const[timer,settimer]=useState(20);
  const [biddingItem , setbiddingItem] = useState(null)
  const[bidamount,setbidamount]=useState(null);
  const[nextbid,setNextbid]=useState(null);
  const[switcher,setswitcher]=useState("live")


  // const fetchNextBiddingItem = () => {
  //   console.log("fetching");
  //   fetch("https://online-auction-backend.onrender.com/api/auth/fetchNextBiddingItem",{
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "auth-token": token
  //     },
  //     body: JSON.stringify({ auctionId: auction._id }),
  //   })
  //   .catch((err)=>{console.log(err)})
  //   .then(response => {
  //     return response.json()
  //   })
  //   .then(json => {
  //     console.log(json)
  //     if(json.success){
  //       setbiddingItem(json.currentBiddingItem)
  //     }
  //     else{
  //       socket.emit('stopClock')
  //       setCompleted(true)
  //     }
  //   })
  // }

  useEffect(() => {
    socket.emit("join", token);

    socket.on("detail_to_all", (message) => {
      if(message){
       // console.log(message
      setbidamount(message.bidamount)
      setNextbid(message.nextbid)
      settimer(message.timer)
      }
    });

    socket.on('fetchNext' , (message) => {
      if(message.status=="hault"){
        if(message.data.currentBiddingItem=="Auction Completed"){
          socket.emit('stopClock')
          setCompleted(true)
        }
        else{
          console.log(message.data.currentBiddingItem);
        setbiddingItem(message.data.currentBiddingItem);
        setswitcher("hault");
        settimer(60)
      }
    }
    else {
      setswitcher("live");
      settimer(20);
    }
      setNextbid(0)
      setbidamount(0)
      
    })

    return () => {
      socket.off("message_to_client");
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        settimer((prevTimer) => prevTimer - 1);
        console.log(timer);
      }
      else if (timer <= 5) {
        settimerclass('red-timer');
      } else if(timer > 5) {
        settimerclass('timer');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);
  
  const fetchBiddingItem = () => {
    
    fetch("https://online-auction-backend.onrender.com/api/auth/fetchBiddingItem",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        },
        body: JSON.stringify({ auctionId: auction._id }),
      })
      .catch((err)=>{console.log(err)})
      .then(response => {
        return response.json()
      })
      .then(json => {
        setbiddingItem(json.currentBiddingItem);
    })
  }

  useEffect(() => {
    fetchBiddingItem()
  }, [])
  

  const make_a_bid = (event) => {
    event.preventDefault()
    let newamount;
    setbidamount(nextbid);
    if(nextbid==0){
      newamount=biddingItem.starting_price+0.1*biddingItem.starting_price;
    }else{
      newamount=0.1*(biddingItem.starting_price)+nextbid;
    }
    const message={timer:20, bidamount:nextbid, nextbid:newamount};
    socket.emit("detail_to_server",message);
    console.log(newamount)
    setNextbid(newamount)
    settimer(20)

    fetch("https://online-auction-backend.onrender.com/api/auth/make_a_bid",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token
      },
      body: JSON.stringify({ auctionId: auction._id }),
    })
    .catch((err)=>{console.log(err)})
    .then(response => {
      return response.json()
    })
    .then(json => {
      if(!json.success){
        alert(json.error)
      }
    })

  }

  const [completed , setCompleted] = useState(auction.items.length === auction.currentBiddingItem)
if(switcher=="live"){
  return (
    <div>
        {!completed ? 
          <div className='flex-container'>
              <div>
                <h1 className='heading'>{auction.name}</h1>
                <br/><br/><br/><br/>
                <p className='price'>Starting price:  {biddingItem ? biddingItem.starting_price : ''}</p>
                <p className='name'>Seller Name:  {biddingItem ? biddingItem.sellerName : ''}</p>
                <br></br>
                <p className='price'>Last Bid:  {bidamount ? bidamount : 'No Bid Yet'}</p>
                <p className='name'>Bidder Name:  {biddingItem ? biddingItem.bidderName : ''}</p>
              </div>
              <div id="intersection-line"></div>
              <div>
              <h2 className='itemName'>{biddingItem ? biddingItem.name : ''}</h2>
                <div className='outer-image'>
                  <img className='' src = {biddingItem ? biddingItem.image : ''} />
                  <div className='button-container'>
                    <button onClick = {make_a_bid} className='bid-button'>Make a bid of {nextbid === 0 && biddingItem !== null ? biddingItem.starting_price : nextbid}</button>
                </div>
                </div>
              </div>
              <div>
              <div className={timerclass}> {timer} </div>
              <p className='description'>{biddingItem ? biddingItem.description : ''}</p>
            </div>
          </div>
        :
          <div className='outer'>
            <p className='completed'>Auction Completed</p>
          </div>
        }

    </div>
  )}
  else if(switcher=="hault"){
    return(
    <div className='flex-container'>
        <div className='outer'>
            <p className='completed'>Next item in {timer} second</p>
          </div>
    </div>)
  }
}


