import { useState } from 'react';
import '../../assets/css/Addcoins.css';
const logo=require('../../assets/images/th.jpeg')
const searchparams = new URLSearchParams(window.location.search);
const token = searchparams.get("token");
const success_gif=require('../../assets/images/70a552e8e955049c8587b2d7606cd6a6.gif')
const failed_gif=require('../../assets/images/failed.gif')

const Addcoins = () => {
  const [selectedPacks, setSelectedPacks] = useState([]);
  const [switcher,setswitcher]=useState('select-pack');
  const [amount,setamount]=useState(0);
  const receiptId = "qwsaq1";
  const currency = "INR";

  const handlePackSelection = (pack) => {
    setSelectedPacks(pack);
  };

  const updatecoin=()=>{
    const addcoins=amount/100;
    fetch("https://online-auction-backend.onrender.com/updateCoins",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        },
        body: JSON.stringify({ addcoins}),
      })
      .catch((err)=>{console.log(err)})
      .then(response => {
        return response.json()
      })
  }
  const handlePayNow = async (e) => {
    const response = await fetch("https://online-auction-backend.onrender.com/order", {
      method: "POST",
      body: JSON.stringify({
        amount
      }),
      headers: {
        "Content-Type": "application/json",
        "auth-token": token
      },
    });

    const order = await response.json();
    console.log(order);

    var options = {
      key: "rzp_test_mWhZkLa3BUx3J7", 
      amount,
      currency,
      name: "Fast Bid", 
      description: "Test Transaction",
      image: {logo},
      order_id: order.id, 
      handler: async function (response) {
        const body = {
          ...response,
        };

        const validateRes = await fetch(
          "https://online-auction-backend.onrender.com/order/validate",
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
          }
        );
        const jsonRes = await validateRes.json();
        setswitcher('payment-done')
        updatecoin();
        console.log(jsonRes);
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      setswitcher('payment-failed')
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    rzp1.open();
  };
  
  if(switcher=='select-pack'){
    return (
        <>
          <div className="outerbox-Addcoins">
            <div className="Addcoin-box">
              <div className={`pack-detail ${selectedPacks.includes('100 coins for ₹100') && 'selected'}`} onClick={() => {setamount(10000), handlePackSelection('100 coins for ₹100')}}>
                100 coins for ₹100
              </div>
              <div className={`pack-detail ${selectedPacks.includes('600 coins for ₹500') && 'selected'}`} onClick={() => {setamount(50000),handlePackSelection('600 coins for ₹500')}}>
                600 coins for ₹500
              </div>
              <div className={`pack-detail ${selectedPacks.includes('1300 coins for ₹1000') && 'selected'}`} onClick={() => {setamount(100000),handlePackSelection('1300 coins for ₹1000')}}>
                1300 coins for ₹1000
              </div>
              <div className={`pack-detail ${selectedPacks.includes('7000 coins for ₹5000') && 'selected'}`} onClick={() => {setamount(500000),handlePackSelection('7000 coins for ₹5000')}}>
                7000 coins for ₹5000
              </div>
              <div className={`pack-detail ${selectedPacks.includes('15000 coins for ₹10000') && 'selected'}`} onClick={() => {setamount(1000000),handlePackSelection('15000 coins for ₹10000')}}>
                15000 coins for ₹10000
              </div>
            </div>
            <div className="pay-button-box">
              {selectedPacks.length > 0 && (
            <button className='pay-button' onClick={handlePayNow}>
              Pay Now
            </button>
          )}
          </div>
          </div>
        </>
      );
  }else if(switcher=='payment-done'){
  return <div className='payment-done-image-box'>
    <img src={success_gif} alt="Success Logo" className='payment-done-image' />
    <h3> Payment Success</h3>
  </div>
  }else if(switcher=='payment-fail'){
    return <div className='payment-done-image-box'>
    <img src={failed_gif} alt="Success Logo" className='payment-done-image' />
    <h3> Payment Failed</h3>
  </div>
  }
};

export default Addcoins;
