import React from 'react';
import { BrowserRouter, Route,Routes} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Main from "./components/Main";

function App() {
    return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/dashboard' element={<Main/>}/>
        </Routes>
    </BrowserRouter>
    );
}

export default App;
