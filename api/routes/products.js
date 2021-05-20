import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { Product } from '../models/product.js';
import { AuthMiddleware } from '../middlewares/auth.js';

// Product router
const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, `${new Date().toISOString()}${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {

    if (
        file.mimetype === 'image/jpeg'
        || file.mimetype === 'image/png'
    ) {
        return cb(null, true);
    }
    cb(new Error('invalid file type'), false);

};

// Init multer with files destination
const upload = multer({
    storage: storage,
    limit: {fileSize: 1024*1024*5}, // 5MB
    fileFilter: fileFilter
});

router.get('/', (req, res, next) => {

    Product.find()
        .select('name price _id image')
        .exec()
        .then(products => {
            res.status(200).json({products})
        })
        .catch(products => {
            res.status(500).json({
                error: err
            })
        });
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;

    Product.findById(id)
        .select('name price _id image')
        .exec()
        .then(product => {
            
            // Product not found
            if (!product) {
                res.status(404).json({
                    message: "Invalid product id"
                })
            }

            res.status(200).json({
                product
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

router.post('/', AuthMiddleware, upload.single('image'), (req, res, next) => {

    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        image: req.file.path
    });

    product.save()
        .then(product => {
            res.status(201).json({
                message: "Product has been created",
                product: product,
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });

});

router.patch('/:id', (req, res, next) => {

    Product
        .update(
            {_id: req.params.id},
            {
                name: req.body.name,
                price: req.body.price,
            }
        )
        .exec()
        .then(result => {
            res.status(200).json({
                message: `Product has been updated successfully`
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });

});

router.delete('/:id', (req, res, next) => {

    Product.findByIdAndDelete(req.params.id)
        .exec()
        .then(result => {
            res.status(200).json({
                message: `Product has been deleted successfully`
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });

});

export { router as ProductRouter }
