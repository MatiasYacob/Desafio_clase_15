import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    cid: Number,
    products: [{
        _id: Number,
        quantity: Number
    }]
});

const Cart = mongoose.model('Cart', cartSchema);

export { Cart };
