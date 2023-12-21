import express from 'express';
import productRouter from './routes/product.router.js';
import cartRouter from './routes/cart.router.js';
import { Server } from 'socket.io';
import handlebars from "express-handlebars";
import { __dirname } from "./dirname.js";
import viewsRouter from "./routes/views.routes.js";
import ProductManager from './managers/ProductManager.js';
import mongoose from "mongoose";
import MessageManager from './managers/MessageManager.js';

const app = express();
const port = 8080;
const pManager = new ProductManager(); // Instancia de ProductManager sin pasar un archivo JSON

app.engine("hbs", handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
}));

const httpServer = app.listen(port, () =>
    console.log(`Servidor Express corriendo en el puerto ${port}`)
);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

app.use('/public', (req, res, next) => {
    if (req.url.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
    }
    next();
}, express.static(__dirname + "/public"));

mongoose.connect(
    "mongodb+srv://matiasyacob27m:1234567812@clusterdesafio15.qwijtbv.mongodb.net/ClusterDesafio15"
).then(() => {
    console.log("DB connected");
}).catch((err) => {
    console.log("Hubo un error");
    console.log(err);
});

app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/', viewsRouter);

io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");

    try {
        socket.emit("productos", await pManager.getProducts());

        socket.on("post_send", async (data) => {
            try {
                const product = {
                    price: Number(data.price),
                    stock: Number(data.stock),
                    title: data.title,
                    description: data.description,
                    code: data.code,
                    thumbnails: data.thumbnails,
                };

                console.log(product);
                await pManager.addProduct(product);
                socket.emit("productos", await pManager.getProducts());
            } catch (error) {
                console.log(error);
            }
        });

        // Manejar la eliminación de productos

     
      


        socket.on("delete_product", async (_id) => {
          try {
              const deletedProduct = await pManager.deleteProduct(_id);
              if (deletedProduct) {
                  console.log("Producto eliminado:", deletedProduct);
                  socket.emit("productos", await pManager.getProducts());
              } else {
                  console.log("El producto no existe o no se pudo eliminar.");
              }
          } catch (error) {
              console.error("Error al eliminar el producto:", error);
          }
      });
  } catch (error) {
      console.error(error);
  }
});

io.on("error", (error) => {
    console.error("Error en Socket.IO:", error);
});

const messages = [];
const messageManager = new MessageManager();
io.on("connection", (socket) => {
    
  
    socket.on("newUser", (username) => {
      socket.broadcast.emit("userConnected", username);
    });
  
    socket.on("message",  async (data) => {


      messages.push(data);
      
      console.log(messages);
      io.emit("messages", messages);
      try {
        await messageManager.addMessage(data);
        console.log('Mensaje guardado en la base de datos.');
    } catch (error) {
        console.error('Error al guardar el mensaje:', error);
    }



    });
  
    socket.emit("messages", messages);
  });



export default app;
