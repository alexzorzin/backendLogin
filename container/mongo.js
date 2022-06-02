const mongoose = require("mongoose");
const URL = 'mongodb://localhost:27017/ecommerce';

class mongoClient {
    constructor(userSchema, tabla) {
        this.tabla = tabla;
        this.userSchema = new mongoose.Schema(userSchema);
        this.model = mongoose.model(tabla, userSchema);
    }

    async createMessagesTable() {
        const modelMessages = new this.model(this.userSchema);
        let modelSaved = await modelMessages.save()
        console.log(modelSaved)
    }

    async createProductsTable() {
        const modelProducts = new this.model(this.userSchema);
        let productsSaved = await modelProducts.save()
        console.log(productsSaved)
    }

// LEER
    async readAll() {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        // metodo find para leer
        let products = await this.model.find({});
        console.log(products);
        return products;
    }
// AGREGAR PRODS/MSG
    async addElements(e) {
        let insert = await this.model.insertMany(e);
        console.log(insert);
        return insert;
    }
// CERRAR CONEXIÓN
    async destroyConnection() {
        await mongoose.disconnect();
    }
}

module.exports = mongoClient;