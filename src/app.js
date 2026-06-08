import express from "express"
import reviewRoutes from "./routes/reviewRoutes.js"
import wishlistRoutes from "./routes/wishlistRoutes.js"

const app = express()

app.use(express.json())

// AÑADIR DESPUÉS DE LAS RUTAS CONTROLLERS ETC
app.use(reviewRoutes)
app.use(wishlistRoutes)
// NOS VAMOS A POSTMAN Y PROBAMOS
// finnnnn

// QUITAR LUEGO
app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "Bienvenido a la clase de MongoDB",
  })
})

export default app

// VEMOS LO QUE HAY PREPARADO Y NOS VAMOS A SERVER.JS
