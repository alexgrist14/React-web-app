import React, {useEffect, useState} from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import jwt_decode from 'jwt-decode';

const Dashboard = () =>{
    const [name,setName] = useState('');
    const [token,setToken] =useState('');
    const [expire,setExpire] =useState('');
    const [users,setUsers] = useState([]);
    const [isUsersSelected,setIsUsersSelected] = useState(false);
    const [selectedUsers,setSelectedUsers] = useState<number[]>([]);
    const history = useNavigate();

    useEffect(()=>{
        refreshToken();
        getUsers();
    },[]);

    const refreshToken = async () =>{
        try{
            const response:any = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded:any = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        }catch (error:any){
            if(error.response){
                history('/');
            }
        }
    }

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config)=>{
        const currentDate = new Date();
        // @ts-ignore
        if(expire * 1000 < currentDate.getTime()){
        const response = await axios.get('http://localhost:5000/token');
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded:any =jwt_decode(response.data.accessToken);
        setName(decoded.name);
        setExpire(decoded.exp);
        }
        return config;
    },(error) =>{
        return Promise.reject(error);
    });
    const getUsers = async ()=>{
        const response = await axiosJWT.get('http://localhost:5000/users',{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setUsers(response.data);
    }
    const deleteUsers = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
        e.preventDefault();
        try{
            await axios.post('http://localhost:5000/delete',{
                id: selectedUsers
            })
            await window.location.reload();
        }catch(err:any){
            console.log(err);
        }
    }
    const blockUsers = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
        e.preventDefault();
        try{
            await axios.post('http://localhost:5000/block',{
                id: selectedUsers
            });
            window.location.reload();
        }catch(err:any){
            console.log(err);
        }
    }
    const unblockUsers = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
        e.preventDefault();
        try{
            await axios.post('http://localhost:5000/unblock',{
                id: selectedUsers
            })
            window.location.reload();
        }catch(err:any){
            console.log(err);
        }
    }
    const formatDate = (dateToFormat: Date)=>{
        const date = new Date(dateToFormat);
        const year = date.getFullYear();
        const month = date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth();
        const day = date.getDate() < 10 ?`0${date.getDate()}` : date.getDate();
        const hours = date.getHours() < 10 ?`0${date.getHours()}` : date.getHours();
        const minutes = date.getMinutes() < 10 ?`0${date.getMinutes()}` : date.getMinutes();

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    const selectAllUsers = ()=>{
        setIsUsersSelected(!isUsersSelected);
    }
    const addSelectedUsersToList = (event:React.ChangeEvent<HTMLInputElement>,index:number):void=>{
        if(event.target.checked){
            setSelectedUsers(prevState => [...prevState,index]);
        }
        else {
            setSelectedUsers(prevState => prevState.filter(i =>i !== index));
        }
    }
    return (
        <div className='container mt-5'>
            <h1>Welcome Back: {name}</h1>
            <button onClick={deleteUsers}>Delete</button>
            <button onClick={blockUsers}>Block</button>
            <button onClick={unblockUsers}>Unblock</button>
            <table className='table is-striped is-fullwidth'>
                <thead>
                <tr>
                    <th><input onChange={() =>setIsUsersSelected(!isUsersSelected)} type='checkbox' className='checkbox'/>Select all</th>
                    <th>No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Registration date</th>
                    <th>Last login</th>
                    <th>Is blocked</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user:any) =>(
                    <tr key = {user.id}>
                        <td><input type='checkbox'
                                   onChange={(e) =>addSelectedUsersToList(e,user.id)}

                                   className='user-checkbox'/>
                        </td>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>{formatDate(user.updatedAt)}</td>
                        <td className='is-warning'>{user.isBlocked.toString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default Dashboard