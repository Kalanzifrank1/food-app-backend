import { Request, Response } from "express"
import Restaurant from "../models/Restaurant"
import cloudinary from "cloudinary"
import mongoose from "mongoose"




const createMyRestaurant = async(req: Request, res: Response): Promise<any> => {

    try {
        const existingRestaurant = await Restaurant.findOne({user: req.userId})
        console.log(req.body)
        if(existingRestaurant){
            return res
                    .status(409)
                    .json({ message: "User restaurant already exists"})
        }

        // const image = req.file as Express.Multer.File

        // const base64Image = Buffer.from(image.buffer).toString("base64")
        // const dataURI = `data:${image.mimetype};base64,${base64Image}`

        const imageUrl = await uploadImage(req.file as Express.Multer.File)

        const restaurant = new Restaurant(req.body)
        restaurant.imageUrl = imageUrl 
        restaurant.user = new mongoose.Types.ObjectId(req.userId)
        restaurant.lastUpdated = new Date()
        await restaurant.save()

        console.log("saved ", restaurant)
        res.status(201).send(restaurant)

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Something went wrong"})
    }
}


const getMyRestaurant = async (req: Request, res: Response): Promise<any> => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.userId });
        console.log(restaurant)
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" }); // Added return
        }

        return res.json(restaurant); // Added return
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Error fetching restaurant" }); // Fixed message
    }
};


const updateMyRestaurant = async(req: Request, res: Response): Promise<any> => {
    try {
        const restaurant = await Restaurant.findOne({
            user: req.userId,
        })

        if(!restaurant){
            return res.status(404).json({ message: "Restaurant can't be found"})
        }

        restaurant.restaurantName = req.body.restaurantName
        restaurant.city = req.body.city
        restaurant.country = req.body.country
        restaurant.deliveryPrice = req.body.deliveryPrice
        restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime
        restaurant.cuisines = req.body.cuisines
        restaurant.menuItems = req.body.menuItems
        restaurant.lastUpdated = new Date()

        if(req.file){
            const imageUrl = await uploadImage(req.file as Express.Multer.File)
            restaurant.imageUrl = imageUrl
        }

        await restaurant.save()
        res.status(200).send(restaurant)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: " Cant update restaurant"})
    }
}

const uploadImage = async (file: Express.Multer.File): Promise<any> => {
    
        const image = file

        const base64Image = Buffer.from(image.buffer).toString("base64")
        const dataURI = `data:${image.mimetype};base64,${base64Image}`

        const uploadResponse = await cloudinary.v2.uploader.upload(dataURI)
        return uploadResponse
}

export default { createMyRestaurant, getMyRestaurant, updateMyRestaurant }