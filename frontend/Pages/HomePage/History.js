
import React , { useState , useEffect } from 'react'
import '../../assets/css/Notifications.css'
import formatDate from  '../../assets/Utils/FormatDate';

export default function History() {

  const searchparams = new URLSearchParams(window.location.search);
  const token = searchparams.get("token");
  const [transactions , setTransactions] = useState([])

  const fetchTransactions = async () => {
    try {
        
        const response = await fetch(`https://online-auction-backend.onrender.com/api/auth/fetchTransactions`, {
          method: "GET",
          headers: {
              "content-type": "application/json",
              "auth-token": token
          },
        });
        const json = await response.json();
        if(json.success)    setTransactions(json.newTransactions)
        console.log(json);
  
    } catch (error) {
        console.error("Error While Fetching Transactions" , error)
    }
  }
  
  useEffect(() => {
    fetchTransactions()
  }, [])

  return (
    <div>
      <div className='flex-container1'>
      <div className='box'>
        <h1 className='heading'>Transactions</h1>

        {transactions.map((item , index) => (
          <div key = {index} className='transactionBox'>
            <div className='row1'>
                <p className='name1'>{item.itemName}</p>
                <p className='amount'>{item.isSeller ? '+' : '-'}{item.isSeller ? item.amount : item.amount + item.amount * 0.1} 🪙</p>
            </div>
            <p className='date'>{formatDate(item.date)}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}
