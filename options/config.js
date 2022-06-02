const admin = require("firebase-admin");
const serviceAccount = require ("../DB/ecommerce-ba45b-firebase-adminsdk-wjshn-62acc6ed1f.json");
const config = {
    sqlite3: {
        client: 'sqlite3',
        connection: {
            filename: `./DB/ecommerce.sqlite`,
        },
        useNullAsDefault: true
    },
    mariaDB: {
        client: "mysql",
        connection: {
            host: "127.0.0.1",
            user: "root",
            password: "",
            database: "tiendarg"
        }
    },
    mongooseProducts: {
        title: String,
        price: Number,
        thumbnail: String
    },
    mongooseMessages: {
        author: String,
        text: String,
        date: String
    },
    firebase: {
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://ecommerce-ba45b.firebaseio.com'
    }
};
module.exports = config;