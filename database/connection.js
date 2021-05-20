import mongoose from "mongoose";


function init() {

    mongoose.connect(
        `mongodb+srv://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_PASS}@cluster0-bfjvj.mongodb.net/test?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            userMongoClient: true,
        }
    )
}

export { init as MongooseConnect }

