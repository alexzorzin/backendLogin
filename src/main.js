const express = require('express');
const exphbs = require('express-handlebars');
const fs = require('fs');
const util = require('util')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bCrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const routes = require('./routes');
const controllersdb = require('./controllersdb');
const User = require('./models');

const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

passport.use('login', new LocalStrategy(
    (username, password, done) => {
        User.findOne({ username }, (err, user) => {
            if (err)
                return done(err);
            if (!user) {
                console.log('User not found ' + username);
                return done(null, false);
            }
            if (!isValidPassword(user, password)) {
                return done(null, false);
            }

            return done(null, user);
        });
    }
));

passport.use('signup', new LocalStrategy({
    passReqToCallback: true
}, (req, username, password, done) => {
    User.findOne({ 'username': username }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false);
        }

        const newUser = {
            username: username,
            password: createHash(password),
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }

        User.create(newUser, (err, userWithId) => {
            if (err) {
                return done(err);
            }
            return done(null, userWithId);
        })
    })
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, done);
});

function isValidPassword(user, password) {
    return bCrypt.compareSync(password, user.password);
}

function createHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
var path = require('path');

const productsTestClass = require('./faker.js')
const { normalize, schema } = require('normalizr')

const MongoStore = require('connect-mongo');
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

app.use(cookieParser());
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://aleexz:caca12345@cluster0.wohmi.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: advancedOptions
    }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 20000
    }
}));

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main.hbs' }));
app.set('view engine', '.hbs');

app.use(express.static(__dirname + '/views')); 

app.use(passport.initialize());
app.use(passport.session());

//LOGIN
app.get('/login', routes.getLogin);
app.post('/login', passport.authenticate('login', {failureRedirect: '/faillogin'}), routes.postLogin)
app.get('/faillogin', routes.getFailLogin);

//REGISTER
app.get('/signup', routes.getSignup);
app.post('/signup', passport.authenticate('signup', {failureRedirect: '/failsignup'}), routes.postSignup)
app.get('/failsignup', routes.getFailsignup);

function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.get('/productos', checkAuthentication, (req, res) => {
        app.use('/', express.static('../public'));
        res.sendFile(path.resolve('../public/index.html'));
        console.log(routes.userEmail)
        io.on('connection', async (socket) => {
            socket.emit('login', routes.userEmail);
        })
});

app.get('/logout', routes.getLogout);

const config = require("../options/config");

const sqlClient = require("../container/sql");
const firebaseClient = require("../container/firebase")
const mongoClient = require("../container/mongo")

// MENSAJES
// const messagesApi = new sqlClient(config.sqlite3, "messages");
// const messagesApi = new mongoClient(config.mongooseMessages,"messages");
const messagesApi = new firebaseClient(config.firebase, "messages");

// PRODUCTOS
// const productsApi = new sqlClient(config.mariaDB, "products");
// const productsApi = new mongoClient(config.mongooseProducts,"products");
const productsApi = new firebaseClient(config.firebase, "products");
const testApi = new productsTestClass();


// const messages = require('./api/messages.json');
// const messages = []

// const lastMessage = async () => {
//     try {
//         if (messages.length == 0) {
//             messages.push(await messagesApi.readAll())
//         }
//         else {
//             await messagesApi.createMessagesTable()
//             await messagesApi.addElements(messages)
//         }
//     }
//     catch (error) {
//         console.log(`ERROR: ${error}`);
//     }
// }
// lastMessage()

// entidad de autores
const authorSchema = new schema.Entity("author", {}, { idAttribute: "email" });

// entidad de comentarios
const commentSchema = new schema.Entity(
    "text",
    { author: authorSchema },
    {
        idAttribute: "email",
    }
);

// entidad de articulos
const postSchema = new schema.Entity(
    "posts",
    {
        messages: [commentSchema],
    },
    { idAttribute: "email" }
);

const messagesNew = [];

io.on("connection", async (socket) => {
    console.log("Usuario conectado");

    //   cargamos por primera vez los msg
    const messages = await messagesApi.readAll();
    io.emit("messages", messages);
    const normalizedData = normalize(
        { id: "messages", messages: [messages] },
        postSchema
    );
    function print(obj) {
        console.log(util.inspect(obj, false, 12, true));
    }

    io.emit("messages2", normalizedData);
    print(normalizedData);

    // mandamos un nuevo mensaje

    socket.on("new-message", async (message) => {
        await messagesApi.insertMessage(message);
        messagesNew.push(message);
    });
});

async function readNormalized() { }


// const products = require('./api/productos');
const products = []
const lastProduct = async () => {
    try {
        if (products.length == 0) {
            products.push(await productsApi.readAll())
            console.log(await products[0])
        }
        else {
            await productsApi.createProductsTable()
            await productsApi.addElements(products)
            console.log(await productsApi.readAll())
        }

    }
    catch (error) {
        console.log(error);
    }
}
lastProduct()

// metodos postman

//leer los productos
app.get("/productos", async function (req, res) {
    res.json(await productsApi.readAll());
});

//Añadir producto
app.post("/productos", async function (req, res) {
    res.json(await productsApi.addElements(req.body));
});

//Eliminar un producto
app.delete("/productos/:id", async function (req, res) {
    const id = req.params.id;
    res.json(await productsApi.deleteProduct(id));
});

app.get("/productos-test", async function (req, res) {
    res.json(await testApi.generarProductos(5));
});

// io


io.on('connection', async (socket) => {
    console.log('Usuario conectado');

    // productos
    socket.emit('products', products);

    socket.on('newProduct', product => {
        products[0].push(product);
        io.sockets.emit('products', products)
        productsApi.addElements(product)
    })
    //Envio de mensaje
    socket.emit('messages', messagesNew[0]);

    socket.on('newMessage', data => {
        // messages.push({ socketid: socket.id , message: data });
        messages[0].push(data);
        io.sockets.emit('messages', messages[0]);
        messagesApi.addElements(data);
    });
});

// uso de middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

httpServer.listen(8080, () => console.log('SERVER ON'));