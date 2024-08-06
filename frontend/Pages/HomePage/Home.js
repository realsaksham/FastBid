import React ,{useState} from "react";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
import '../../assets/css/Home.css';

const Home=()=>{

  const [switcher, setSwitcher] = useState("Home");

    const handleSwitcherChange = (newValue) => {
        setSwitcher(newValue);
    };

    return(
    <div>
      <div className="page-container">
        <Header onSwitcherChange={handleSwitcherChange} />
        <Body switcher={switcher} />
        <Footer/>
        </div>
    </div>)
}
export default Home;