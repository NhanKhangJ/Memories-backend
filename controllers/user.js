import bcrypt from 'bcrypt'; //bcryt to encrypt your password
import jwt from 'jsonwebtoken' //json web token store the user in the period of time

import User from '../models/user.js';

export const signin = async(req,res) =>{
    const {email, password} = req.body;
    try {
       const existingUser = await User.findOne({ email })
       
       if(!existingUser) return res.status(404).json({message: "User doesn't exist"});

       const isPasswordCorret = await bcrypt.compare(password, existingUser.password) //compare those two value in this function

       if(!isPasswordCorret) return res.status(400).json({ message: "Invalid credentials"})

       const token = jwt.sign({ email: existingUser.email, id: existingUser._id}, 'test', {expiresIn: "1h"}) //send this token to the localstorage and It up to you to set the expire time 

       res.status(200).json({result: existingUser, token})
    } catch (error) {
       res.status(500).json({ message: 'Something went wrong'})
    }
}

export const signup = async(req,res) =>{
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    try {
        const existingUser = await User.findOne({ email })
        
        if(existingUser) return res.status(400).json({message: "User already exist"});

        if(password !== confirmPassword) return res.status(400).json({message: "Passwrods dont't match"});

        const hashPassword = await bcrypt.hash(password, 12); //hashing the pass wrodr

        const result = await User.create({email, password: hashPassword, name: `${firstName} ${lastName}` }); // create new user from the req.body if everything done

        
       const token = jwt.sign({ email: result.email, id: result._id}, 'test', {expiresIn: "1h"}); //send this token to the localstorage and It up to you to set the expire time 

       res.status(200).json({result, token})
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong'})
    }
} 