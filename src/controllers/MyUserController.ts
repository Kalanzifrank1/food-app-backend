import { Request, Response } from "express";
import User from "../models/user";

const createCurrentUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { auth0Id } = req.body;
        const existingUser = await User.findOne({ auth0Id });

        if (existingUser) {
            return res.status(200).send();
        }

        const newUser = new User(req.body);
        await newUser.save();
        console.log(newUser)
        res.status(201).json(newUser.toObject());
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating user" });
    }
};

const updateCurrentUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, addressLine1, country, city } = req.body
        const user = await User.findById(req.userId)

        console.log(req.body)

        if(!user){
            return res.status(404).json({ message: "User not found"})
        }

        user.name = name
        user.addressLine1 = addressLine1
        user.city = city
        user.country = country

        await user.save()
        console.log("updated user", user)
        res.send(user)

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Error updating user"})
    }
}

const getCurrentUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const currentUser = await User.findOne({_id: req.userId})

        console.log(req.userId)

        if(!currentUser){
            return res.status(400).json({message: "user not found"})
        }

        res.json(currentUser)


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Something went wrong"})
    }
}


export default {createCurrentUser, updateCurrentUser, getCurrentUser}
