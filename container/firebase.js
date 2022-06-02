const admin = require("firebase-admin");
const config = require("../options/config");

admin.initializeApp(config.firebase);

class firebaseClient {
    constructor(userSchema, tabla) {
        this.tabla = tabla;
        this.db = admin.firestore();
        this.query = this.db.collection(tabla);
    }

    async createMessagesTable() {
        console.log('table')
    }

    async createProductsTable() {
        console.log('table')
    }

// LEER
    async readAll() {
        const querySnapshot = await this.query.get();
        let docs = querySnapshot.docs;

        const response = docs.map((doc) => ({
            title: doc.data().title,
            price: doc.data().price,
            thumbnail: doc.data().thumbnail
        }));
        return response;
    }

    async addElements(e) {
        let doc = this.query.doc()
        return await doc.create(e)
    }
}

module.exports = firebaseClient;