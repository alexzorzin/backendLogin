const faker = require('faker');
faker.locale = "es";
const { commerce, image } = faker;

class productsTestClass {
    constructor() {}
    async generarProductos(cant) {
        const productsTest = [];

        for (let i = 0; i < cant; i++) {
            let titleTest = commerce.productName();
            let priceTest = commerce.price(100, 2000, 0, "$");
            let thumbnailTest = image.imageUrl(200, 200, "product");

            productsTest.push({
                title: titleTest,
                price: priceTest,
                thumbnail: thumbnailTest,
            });
        }
        return { productsTest: productsTest };
    }
}

module.exports = productsTestClass;