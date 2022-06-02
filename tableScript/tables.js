// tabla de mensajes (sqlite)
const sqlite = require("knex")(config.sqlite3);
(async () => {
    try {
        await sqlite.schema
            .dropTableIfExists("messages")
            .createTable("messages", (table) => {
                table.string("author", 30).notNullable();
                table.string("text", 300).notNullable();
                table.dateTime("date");
            });
        console.log("Tabla de mensajes SQLite generada.");
    } catch (err) {
        console.log(`ERROR: ${err}`);
        throw err;
    } finally {
        knex.destroy();
    }
})();

// tabla de productos (mysql o mariaDB)
const config = require("../config/config");
const knex = require("knex")(config.mariaDB);
(async () => {
    try {
        await knex.schema
            .dropTableIfExists("products")
            .createTable("products", (table) => {
                table.increments("id");
                table.string("title").notNullable();
                table.float("price");
                table.string("thumbnail").notNullable();
            });
        console.log("Tabla de productos generada con exito (mariaDB)");
    } catch (err) {
        console.log(`ERROR: ${err}`);
        throw err;
    } finally {
        knex.destroy();
    }
})();