const mongoose = require('mongoose')

const connectToDb = async() => {
    try {
        const connec = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDb Connected : ${connec.connection.host}`)
    } catch (e) {
        console.log(e.message)
        process.exit()
    }

}

module.exports = connectToDb;