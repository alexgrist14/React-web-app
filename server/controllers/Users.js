import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req,res)=>{
    try {
        const users = await Users.findAll({
            attributes: ['id', 'name', 'email','createdAt','updatedAt','isBlocked']
        });
        res.json(users);
    }catch(err){
            console.log(err);
    }
}

export const Register = async (req,res) =>{
    const {name,email,password,confirmPassword} = req.body;
    if(password !== confirmPassword) return res.status(400).json({msg:"Password and Confirm Password do not match"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password,salt);
    try{
        await Users.create({
            name:name,
            email:email,
            password:hashPassword,
            isBlocked: false,
        });
        res.json({msg: "Registration Successful"});
    }catch (err){
        console.log(err);
    }
}

export const Login = async (req,res)=>{
    try{
        const user = await Users.findAll({
            where:{
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password,user[0].password);
        if(!match) return res.status(400).json({msg: "Wrong password"});
        if(user[0].isBlocked) return res.status(400).json({msg: "You are banned"});
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign({userId,name,email},process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Users.update({refresh_token: refreshToken},{
            where:{
                id:userId
            }
        });
        res.cookie('refreshToken',refreshToken,{
            httpOnly: true,
            maxAge: 24*60*60*1000
        });
        res.json({accessToken});
    }catch (err){
        res.status(404).json({msg:"Email not found"});
    }
}

export const Logout = async (req,res) =>{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({refresh_token: null},{
        where:{
            id:userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}

export const Delete = async (req,res)=>{
    const users = req.body.id;
    try {
        users.map(async (id) => {
            await Users.destroy({
                where: {
                    id: id
                }
            })
        })
        return res.sendStatus(200);
    }catch (err){
        console.log(err);
    }
}

export const Block = async (req,res)=>{
    const users = req.body.id;
    try{
        users.map(async (id)=>{
            await Users.update({isBlocked: true},{
                where:{
                    id: id
                }
            })
        })
        return res.sendStatus(200);
    }catch (err){
        console.log(err);
    }
}

export const Unblock = async (req,res)=>{
    const users = req.body.id;
    try{
        users.map(async (id)=>{
            await Users.update({isBlocked: false},{
                where:{
                    id: id
                }
            })
        })
        return res.sendStatus(200);
    }catch (err){
        console.log(err);
    }
}
