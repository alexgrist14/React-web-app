import React, {useState} from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Register = () =>{
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfrimPassword] = useState('')
    const [msg,setMsg] =useState('');
    const history = useNavigate();

    const Register = async (e:React.MouseEvent<HTMLFormElement, MouseEvent>) =>{
        e.preventDefault();
        try{
            await axios.post('http://localhost:5000/users',{
                name:name,
                email:email,
                password:password,
                confirmPassword:confirmPassword
            });
            history('/dashboard');
        }catch(err:any){
            if(err.response){
                setMsg(err.response.data.msg);
            }
        }
    }
    return(
        <section className='hero has-background-grey-light is-fullheight is-fullwidth'>
            <div className='hero-body'>
                <div className='container'>
                    <div className='columns is-centered'>
                        <div className="column is-4-desktop">
                            <form onSubmit={Register} className='box'>
                                <p className='has-text-centered'>{msg}</p>
                                <div className="field mt-5">
                                    <label className="label">Name</label>
                                    <div className='control'>
                                        <input type="text" className='input' placeholder='Name'
                                        value ={name} onChange={(e) => setName(e.target.value)}/>
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Email</label>
                                    <div className='control'>
                                        <input type="text" className='input' placeholder='Email'
                                               value ={email} onChange={(e) => setEmail(e.target.value)}/>
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Password</label>
                                    <div className='control'>
                                        <input type="password" className='input' placeholder='Password'
                                               value ={password} onChange={(e) => setPassword(e.target.value)}/>
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Confirm Password</label>
                                    <div className='control'>
                                        <input type="password" className='input' placeholder='Confirm password'
                                               value ={confirmPassword} onChange={(e) => setConfrimPassword(e.target.value)}/>
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <button className='button is-success is-fullwidth'>Register</button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>

        </section>
    )
}

export default Register