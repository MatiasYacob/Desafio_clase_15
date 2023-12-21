import { Schema, model } from "mongoose";


const productSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    thumbnails: [String],
    code: String,
    stock: Number,
    status: {
        type: Boolean,
        default: true // Establecer el valor por defecto como true
    }
});

const Product = model('Product', productSchema);

export { Product };
