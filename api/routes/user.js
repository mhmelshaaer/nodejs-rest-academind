import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { User } from '../models/user.js';

// User router
const router = express.Router();


/**
 * All routes definitions
 */

router.get('', async (req, res, next) => {
    
    try {
        const users = await User.find().exec();
        res.status(200).json({ data: users });
    } catch(err) {
        res.status(500).json({ error: err });
    };

 });

router.post('/signup', async (req, res, next) => {
    
    try {

        let user = await User.findOne({email: req.body.email}).exec();

        if (user) {
            return res.status(409).json({//409: can handle request but there is a conflict
                message: "Mail already exists"
            })
        }

        const hash = await bcrypt.hash(req.body.password, 10);

        user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash,
        });

        const result = await user.save();

        res.status(201).json({
            message: "User created",
            user: result
        });

    } catch(err) {
        res.status(500).json({ error: err.message });
    };

});

router.post('/login', async (req, res, next) => {

    try {
        const user = await User.findOne({email: req.body.email}).exec();
        const authenticate = () => {

            if (!user) {
                return res.status(401).json({
                    message: `Your credentials do not match our records`
                });
            }

            return bcrypt.compare(req.body.password, user.password);
        };

        const authSuccess = await authenticate();

        if (!authSuccess) {
            return res.status(401).json({
                message: `Your credentials do not match our records`
            });
        }
    
        const token = jsonwebtoken.sign(
            {
                email: user.email,
                _id: user._id
            },
            process.env.JWT_PRIVATE_KEY,
            {
                expiresIn: `1h`
            }
        );
    
        res.status(200).json({
            message: `Authentication succeeded`,
            token: token
        });

    } catch (err) {
        return res.status(500).json({
            message: `Authentication failed`
        });
    }
});

router.delete('/:id', (req, res, next) => {

    try {

        const result = User.findByIdAndDelete(req.params.id).exec();
        res.status(200).json({
            message: `User with id: ${req.params.id} has been deleted successfully`
        });
    
    } catch(err) {
        res.status(500).json({ error: err });
    };

});

// Exporting the router
export { router as UserRouter }