import Joi from "joi"
import { Request, Response } from "express"
import { User } from "../models/User"
import bcrypt from "bcrypt"
import { generateToken } from "../utils/generateToken"






const registerSchema= Joi.object({
    username:Joi.string().min(3).max(30).required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(8).required(),

})

const loginSchema = Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().min(8).required(),
})

export const register = async (req:Request,res:Response) => {

    const {error} = registerSchema.validate(req.body)
    if(error){
        logger.warn(`Validation error: ${error.details[0].message}`);
        return res.status(400).json({error:error.details[0].message})   
    
    }
    const {username,email,password}=req.body
    try {
        let user = await User.findOne({email})
        if(user){
            logger.warn(`User already exists: ${email}`);
            return res.status(400).json({error:"user already exists"})
        }
        user = new User{
            username,
            email,
            password:await bcrypt.hash(password,10)

        }
        await user.save()
        const token= generateToken.save(user)
        logger.info(`User registered: ${email}`);
        return res.status(201).json({message:"user registered successfully"})

    } catch (error) {
        logger.error(`Error registering user: ${error}`);
        return res.status(500).json({error:"internal server error"})
        
    }


}

export const login = async(req:Request,res:Response) => {
    const {error} = loginSchema.validate(req.body)
    if(error){
        logger.warn(`Validation error: ${error.details[0].message}`);
        return res.status(400).json({error:error.details[0].message})   
    }
    const {email,password}=req.body 
    try {
        const user = email.findOne(email)
        if(!user){
            logger.warn(`User not found: ${email}`);
            return res.status(400).json({error:"user not found"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            logger.warn(`Invalid credentials for user: ${email}`);
            return res.status(400).json({error:"invalid credentials"})
        }
        const token = generateToken(user)
        
    } catch (error) {
        logger.error(`Error logging in user: ${error}`);
        return res.status(500).json({error:"internal server error"})
        
    }


}
