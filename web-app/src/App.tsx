import React, {ReactElement} from 'react';
import { BrowserRouter, Route,Routes} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";

function App():ReactElement {
    return (
    <BrowserRouter>
        <Navbar/>
        <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>
        </Routes>
    </BrowserRouter>
    );
}

export default App;
