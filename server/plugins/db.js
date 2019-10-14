module.exports = app => {
    const mongoose = require("mongoose")
    mongoose.connect('mongodb+srv://vue123:vue123456@weball-snswc.mongodb.net/test?retryWrites=true&w=majority',{
        useNewUrlParser: true,
        useFindAndModify: false,
    })
    require('require-all')(__dirname + '/../modules')
}