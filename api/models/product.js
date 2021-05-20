import mongoose from "mongoose";

const schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    price: {type: Number, required: true},
    image: {type: String, required: true},
});

const model = mongoose.model('Product', schema);

export { model as Product }