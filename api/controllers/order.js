import mongoose from 'mongoose';
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";

export class OrderController {

    constructor() {}

    list(req, res, next) {

        Order.find()
            .select('_id quantity product')
            .populate('product', 'name')
            .exec()
            .then(orders => {
                res.status(200).json({
                    count: orders.length,
                    orders: orders.map(order => {
                        return {
                            _id: order._id,
                            product: order.product,
                            quantity: order.quantity,
                            request: {
                                type: 'GET',
                                url: `http://localhost:3000/order/${order._id}`,
                            },
                        };
                    })
                })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            });
    }

    get(req, res, next) {

        Order.findById(req.params.id)
            .populate('product')
            .exec()
            .then(order => {
                res.status(200).json(order);
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            })
    }

    store(req, res, next) {

        Product.findById(req.body.productId)
            .exec()
            .then(product => {
    
                if (!product) {
                    return res.status(404).json({
                        message: "Product not found"
                    });
                }
    
                const order = new Order({
                    _id: mongoose.Types.ObjectId(),
                    product: product._id,
                    quantity: req.body.quantity,
                });
            
                return order.save();
            })
            .then(order => {
                res.status(201).json({
                    message: "Order has been created",
                    product: order,
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    }

    delete(req, res, next) {

        Order.findByIdAndDelete(req.params.id)
            .exec()
            .then(result => {
                res.status(200).json({
                    message: `Order with id: ${req.params.id} has been deleted`
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            })
    }

}