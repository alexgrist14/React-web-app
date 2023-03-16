import axios from "axios";

const deleteUsers = async (selectedUsers:number[]) => {
    try {
        await axios.post('http://localhost:5000/delete', {
            id: selectedUsers
        })
    } catch (err: any) {
        console.log(err);
    }
}

const logout = async () => {
    try {
        await axios.delete('http://localhost:5000/logout');
    } catch (err) {
        console.log(err);
    }
}

const blockUsers = async (selectedUsers:number[], sessionUserId:string) => {
    try {
        await axios.post('http://localhost:5000/block', {
            id: selectedUsers
        });
    } catch (err: any) {
        console.log(err);
    }
}

const unblockUsers = async (selectedUsers:number[]) => {
    try {
        await axios.post('http://localhost:5000/unblock', {
            id: selectedUsers
        })
    } catch (err: any) {
        console.log(err);
    }
}

export default {deleteUsers,logout,unblockUsers,blockUsers}