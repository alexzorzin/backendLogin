const mongoose = require('mongoose');

let dbConnected = false;

function connectDb(url, cb) {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
        if (!err) {
            dbConnected = true;
        }
        if (cb != null) {
            cb(err);
        }
    })
}

module.exports = {
    connectDb  
}