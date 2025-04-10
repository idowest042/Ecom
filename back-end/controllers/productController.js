import {v2 as cloudinary} from "cloudinary"
import productModel from "../models/productModel.js"
import mongoose from "mongoose"
export const addProduct = async(req,res) =>{
    try {
        const{name,description,price,category,subCategory,size,bestseller} = req.body
        const image1 =req.files.image1 && req.files.image1[0]
        const image2 =req.files.image2 && req.files.image2[0]
        const image3 =req.files.image3 && req.files.image3[0]
        const image4 =req.files.image4 && req.files.image4[0]
        const images = [image1,image2,image3,image4].filter((item)=> item !== undefined)
        let imageurl = await Promise.all(
          images.map(async (item) => {
            let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
            return result.secure_url
          })
        )
        const productData = {
            name,
            description,
            category,
            price:Number(price),
            subCategory,
            bestseller:bestseller === "true" ? true :false,
            size:JSON.parse(size),
            images:imageurl,
            date:Date.now()
        }
        console.log(productData)
        const product = new  productModel(productData);
        await product.save()
        res.status(200).json({msg:"product added successfully"})
        console.log(imageurl)
    } catch (error) {
       res.status(500).json({msg:"error in addProduct"})
       console.log(error,'error in addProduct')
    }
}
export const listProducts = async(req,res) =>{
    try {
        const products = await productModel.find({})
        res.status(200).json({products})
    } catch (error) {
       res.status(500).json(error) 
       console.log(error,'error in listProduct')
    }
}
export const removeProduct = async (req, res) => {
    try {
        console.log('Delete request received with body:', req.body); // Debug log
        
        const { id } = req.body;
        
        // Validate ID exists
        if (!id) {
            console.log('No ID provided in request');
            return res.status(400).json({ 
                success: false,
                msg: "Product ID is required" 
            });
        }

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                msg: "Invalid product ID format"
            });
        }

        const deletedProduct = await productModel.findByIdAndDelete(id);
        
        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                msg: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Product removed successfully",
            deletedId: id
        });

    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            msg: "Failed to delete product",
            error: error.message
        });
    }
}
export const singleProduct = async(req,res) =>{
    try {
        const {productId} = req.body
        const product = await productModel.findById(productId)
        res.status(200).json({product})
    } catch (error) {
        res.status(500).json({msg:"error in singleProduct"})
        console.log(error,'error in singleProduct')
    }
}
