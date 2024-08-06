import { useEffect, useState } from "react";
import '../../assets/css/AuctionCard.css'
import LiveAuction from "./LiveAuction";

const AuctionCard = ({ changeSwitcher , details, auction }) => {
    console.log(auction)
    const AuctionName = details.name;
    const startTime = new Date(details.starting_time).getTime();
    const itemsArray = details.items.map(data => data.id);
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");
    const [items, setItems] = useState(null);
    const [time, setTime] = useState(Math.floor((startTime - Date.now()) / 1000));
    const [showLiveAuction, setShowLiveAuction] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(prevTime => {
                if (prevTime === 1) {
                    setShowLiveAuction(true);
                    clearInterval(interval); 
                    return 0; 
                }
                return prevTime - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchDetails();
    }, []);

    const fetchDetails = () => {
        fetch("https://online-auction-backend.onrender.com/api/auth/getItemsDetails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
            body: JSON.stringify({ token, itemsArray }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.items);
            setItems(data.items);
        })
        .catch(error => {
            console.error("Error fetching items:", error);
        });
    }

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    if(showLiveAuction){
        return <LiveAuction auction={auction}/>
    }
    else{
    return (
        <>
            <p onClick = {changeSwitcher} className="back">{'<- '}Back</p>
            <div className="AuctionCard-container">
                <div className="auction-card-heading-box">
                    <h1 className="auction-card-heading"></h1>
                    <h1 className="auction-card-heading">{AuctionName}</h1>
                    <h3 className="auction-card-heading">{formatTime(time)}</h3>
                </div>
                {items && items.map((item, index) => (
                    <div className="AuctionCard-box" key={index}>
                        <div>
                            <h3>{index + 1}. {item.name}</h3>
                            <br></br>
                            <br></br>
                            <p><b>Description:</b> {item.description}</p>
                            <p><b>Starting Price:</b> {item.starting_price} coins</p>
                        </div>
                        <div>
                            <img src={item.image} alt={item.name} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
}

export default AuctionCard;
