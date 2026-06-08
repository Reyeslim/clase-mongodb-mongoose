import express from "express"

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "Bienvenido a la clase de MongoDB",
  })
})

export default app
