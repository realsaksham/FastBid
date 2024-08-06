import React, { useState } from "react";
import ReactDOM from "react-dom/client"
import LoginForm from "./Pages/Authentication/Login_form";
import { createBrowserRouter ,RouterProvider} from "react-router-dom";
import Forgotpwd from "./Pages/Authentication/Forgot_pwd";
import Create_Account from "./Pages/Authentication/CreateAccount";
import Home from "./Pages/HomePage/Home";


const root=ReactDOM.createRoot(document.getElementById("root"));

const Router =createBrowserRouter([{
    path:"/",
    element:<LoginForm/>,   
    errorElement:<Error/>,
},{
    path:"/Forgot_password",
    element:<Forgotpwd/>,
    errorElement:<Error/>,
},{
    path:"/Create_Account",
    element:<Create_Account/>,
    errorElement:<Error/>,
},{
    path:"/Home",
    element:<Home/>,
    errorElement:<Error/>,
},
])

root.render(<RouterProvider router={Router} />);