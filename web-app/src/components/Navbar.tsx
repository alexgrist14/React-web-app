import axios from "axios";
import {useNavigate} from "react-router-dom";
import React, {ReactElement} from "react";

const Navbar = ():ReactElement => {
    const history = useNavigate();
    let isDashBoard:boolean = window.location.pathname === '/dashboard';
    let isRegisterPage:boolean = window.location.pathname === '/register';


    const Logout = async () => {
        try {
            await axios.delete('http://localhost:5000/logout');
            history('/');
        } catch (err) {
            console.log(err);
        }
    }

    const toRegisterPage = () => history('/register');
    const toLoginPage = () => history('/');

    return (
        <nav className='navbar is-light' role='navigation' aria-label='main navigation'>
            <div className='container'>
                <div id='navbarBasicExample' className='navbar-menu'>
                    <div className='navbar-end'>
                        <div className='navbar-item'>
                            <div className='buttons'>
                                {
                                    isRegisterPage || isDashBoard ? '' :
                                        <button onClick={toRegisterPage} className='button is-light'>
                                            Sing up
                                        </button>
                                }

                                {
                                    isDashBoard ?
                                        <button onClick={Logout} className='button is-light'>
                                            Log Out
                                        </button>
                                        :
                                        <button onClick={toLoginPage} className='button is-light'>
                                            Log in
                                        </button>
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar