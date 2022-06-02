const knex = require("knex");

class sqlClient {
    constructor(config, tabla) {
        this.knex = knex(config);
        this.tabla = tabla;
    }

    // crear tabla de mensajes
    async createMessagesTable() {
        return this.knex.schema.dropTableIfExists('messages')
            .finally(() => {
                return this.knex.schema.createTable('messages', table => {
                    table.string('author');
                    table.string('text');
                    table.string('date');
                })
            })
    }

    // crear tabla de productos
    async createProductsTable() {
        return this.knex.schema.dropTableIfExists('products')
            .finally(() => {
                return this.knex.schema.createTable('products', table => {
                    table.increments('id'),
                        table.string('title'),
                        table.float('price'),
                        table.string('thumbnail')
                })
            })
    }

    async addElements(e) {
        return this.knex(this.tabla).insert(e);
    }

    async readAll() {
        return this.knex.from(this.tabla).select('*');
    }

    async deleteProduct(id) {
        this.knex.from(this.tabla).where('id', id).del()
    }

    async destroyConnection() {
        await this.knex.destroy();
    }
}

module.exports = sqlClient;