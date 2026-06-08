// src/server.js
import "dotenv/config" // dependencia para leer variables de entorno
import app from "./app.js"
import { dbConnection } from "./db/database.js"

const PORT = process.env.PORT || 3000

// Esto es con lo que empezamos
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`)
// })

// Esto se añade después.

// Segunda vez en server.js. AÑADIMOS:
try {
  await dbConnection()
  app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`)
  })
} catch (error) {
  console.error("❌ Error al conectar con MongoDB:", error.message)
  process.exit(1)
}

// VEMOS LO QUE HAY PREPARADO,
// LEVANTAMOS SERVER
// Y CREAMOS CARPETA DB/DATABASE.JS

// 2 VEZ, NOS VAMOS A MODELOS.
// En la carpeta models, creamos los schemas que tendrá nuestra base de datos.
// No es más que la estructura de nuestra colección.
