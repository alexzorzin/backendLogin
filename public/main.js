const socket = io.connect();

// agregar producto
function addProduct(e) {
  event.preventDefault();
  const product = {
    title: document.getElementById('title').value,
    price: document.getElementById('price').value,
    thumbnail: document.getElementById('thumbnail').value,
  };
  socket.emit('newProduct', product);
  alert("Has agregado un producto al carrito");
  return false;
}

// tabla de productos
function tableProducts(products) {
  return fetch('./partials/productsTable.hbs')
    .then(ans => ans.text())
    .then(plantilla => {
      const temp = Handlebars.compile(plantilla);
      const htmlTable = temp({ products });
      document.getElementById('products').innerHTML = htmlTable;
      return htmlTable;
    })
}

socket.on('products', products => {
  tableProducts(products[0]);
  console.log(products[0])
});

// // render de mensajes
// function render(messages) {
//   const messagesHtml = messages.map((message, index) => {
//     return (`<div>
//       <p class="author">${message.author} <span class="date">[${message.date}]</span>: <span class="text">${message.text}</span> </p>
//               </div>`)
//   }).join(" ");
//   document.getElementById('messages').innerHTML = messagesHtml;
// }

// function addMessage(e) {
//   event.preventDefault();
//   const message = {
//     author: document.getElementById('username').value,
//     text: document.getElementById('text').value,
//     date: new Date().toLocaleString("es-ES", {
//       dateStyle: "short",
//       timeStyle: "short"
//     })
//   };
//   socket.emit('newMessage', message);
//   return false;
// }

// socket.on('messages', data => {
//   render(data);
// });


// desnormalizacion:

// const authorSchema = new normalizr.schema.Entity("authors");


// const messageSchema = new normalizr.schema.Entity(
//   "messages",
//   { author: authorSchema },
//   { idAttribute: "email" }
// );


// const postsSchema = new normalizr.schema.Entity("posts", {
//   messages: messageSchema,
// });

const inputUsername = document.getElementById("username");
const inputMessage = document.getElementById("inputMessage");
const submit = document.getElementById("submit");

const submitMessage = document.getElementById("submitMessage");
submitMessage.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = {
    author: {
      email: inputUsername.value,
      nombre: document.getElementById("firstname").value,
      apellido: document.getElementById("lastname").value,
      edad: document.getElementById("age").value,
      alias: document.getElementById("alias").value,
      avatar: document.getElementById("avatar").value,
    },
    text: inputMessage.value,
    timestamp: new Date(Date.now()).toLocaleString().split("-")[0],
  };

  socket.emit("new-message", message);
  console.log(message);
  submitMessage.reset();
  inputMessage.focus();
});
let normalizrLength = 0;
let desnormalizrLength = 0;
socket.on("messages", (messages) => {
  const html = makeHtmlList(messages);
  document.getElementById("messages").innerHTML = html;
  desnormalizrLength = JSON.stringify(messages).length;
  console.log(messages);
  console.log(desnormalizrLength);
});

socket.on("messages2", (normalizedData) => {
  console.log(normalizedData);
  normalizrLength = JSON.stringify(normalizedData).length;
  console.log(normalizrLength);
});
const comprension = normalizrLength;
console.log(`Porcentaje de compresión: ${comprension}%`);
document.getElementById("compresion").innerText = comprension;
function makeHtmlList(messages) {
  return messages
    .map((message) => {
      return `
        <div>
            <b style="color:blue;">${message.author.email}</b>
            [<span style="color:brown;">${message.timestamp}</span>] :
            <i style="color:green;">${message.text}</i>
            <img width="50" src="${message.author.avatar}" alt=" ">
        </div>
    `;
    })
    .join(" ");
}

socket.on("messages2", (messages2) => {
  console.log(`${messages2} Mensajes normalizados`);
});
inputUsername.addEventListener("input", () => {
  const emailValido = inputUsername.value.length;
  const textoValido = inputMessage.value.length;
  inputMessage.disabled = !emailValido;
  submit.disabled = !emailValido || !textoValido;
});

inputMessage.addEventListener("input", () => {
  const textoValido = inputMessage.value.length;
  submit.disabled = !textoValido;
});

const clientName = [];
socket.on('login', nameClient => {
    const name = document.getElementById("nameClient");
    name.textContent = `Bienvenido ${nameClient}`;
    clientName.push(nameClient);
    console.log(clientName)
});


function bye(){
    alert(`Hasta luego ${clientName[1]}`)
}