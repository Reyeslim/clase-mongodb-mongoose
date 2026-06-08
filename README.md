# Sprint 11 · Live 1 — MongoDB, Mongoose y Atlas

> **Objetivo de la Clase**
> Entender qué es una base de datos NoSQL, cómo funciona MongoDB y cómo conectar un backend Express con MongoDB Atlas usando Mongoose.

---

## 📂 Estructura del Proyecto

```
11-live-1/
├── .env
├── .env.example
├── package.json
└── src/
    ├── server.js
    ├── app.js
    ├── db/
    │   └── database.js              # Conexión con Mongoose
    ├── models/
    │   ├── Review.js                # Schema de reviews
    │   └── Wishlist.js              # Schema de wishlist
    ├── services/
    │   ├── reviewService.js
    │   └── wishlistService.js
    ├── controllers/
    │   ├── reviewController.js
    │   └── wishlistController.js
    └── routes/
        ├── reviewRoutes.js
        └── wishlistRoutes.js
```

---

## Bloque 1 · Teoría: NoSQL vs SQL (15 min)

### ¿Qué es la persistencia de datos?

Diferencia clave para explicar primero:

```js
// En memoria → se pierde al reiniciar el servidor
const reviews = []

// En base de datos → persiste para siempre
// MongoDB Atlas = datos en la nube
```

---

### SQL vs NoSQL — Tabla comparativa

| Concepto                 | SQL (PostgreSQL) | NoSQL (MongoDB)        |
| :----------------------- | :--------------- | :--------------------- |
| Unidad de almacenamiento | Tabla            | Colección              |
| Registro                 | Fila             | Documento              |
| Propiedad                | Columna          | Campo                  |
| Formato                  | Esquema fijo     | JSON flexible          |
| Relaciones               | JOINs            | Referencias o embebido |

---

### Cuándo usar cada una

**SQL (PostgreSQL/Supabase)** → datos estructurados con relaciones:

- users
- movies
- orders
- carts

**MongoDB** → datos flexibles, sociales o de contenido:

- reviews (diferentes campos según el tipo de reseña)
- wishlist (listas personales)
- logs, comentarios, etiquetas

> No hay una opción mejor. Cada base de datos se usa para lo que mejor hace.

---

### Arquitectura de la feature

```
Cliente
  ↓
API Backend (Express)
  ↓
Prisma → PostgreSQL (Supabase)    ← users, movies, orders
  ↓
Mongoose → MongoDB Atlas          ← reviews, wishlist
```

---

## Bloque 2 · MongoDB Atlas — Crear Cluster (20 min)

### Pasos en directo

1. Ir a https://cloud.mongodb.com
2. Crear nuevo proyecto (o usar el existente)
3. **Build a Database → Free (M0)**
4. Elegir región (Europe o la más cercana)
5. Ponerle nombre al cluster: `cursofsia` o cualquier nombre.
6. **Security → Create User** → nombre y contraseña
7. **Network Access → Add IP Address → Allow from anywhere** (para clase)
8. Esperar ~2 minutos a que el cluster esté activo

---

### Explorar Data Explorer

1. Click en **Browse Collections**
2. Si no hay datos, click en **Add My Own Data**
3. Nombre de la database: `cursofsia` o el que queramos ponerle.

> En MongoDB, una "database" contiene colecciones. Una colección contiene documentos.

---

## Bloque 3 · Crear Colecciones en Atlas (20 min)

### Colección `reviews`

Estructura de un documento:

```json
{
  "movieId": "movie1",
  "userId": "user1",
  "rating": 8,
  "comment": "Great movie, really enjoyed it",
  "createdAt": "2026-01-10"
}
```

**Puntos clave:**

- `_id` se genera automáticamente (ObjectId)
- No hay esquema obligatorio: cada documento puede tener campos diferentes
- El formato es JSON (internamente BSON (Binary JSON))

Insertar varios documentos de ejemplo:

```json
{ "movieId": "movie1", "userId": "user1", "rating": 9, "comment": "Amazing!", "createdAt": "2026-01-10" }
{ "movieId": "movie1", "userId": "user2", "rating": 7, "comment": "Pretty good", "createdAt": "2026-01-11" }
{ "movieId": "movie2", "userId": "user1", "rating": 5, "comment": "Disappointing", "createdAt": "2026-01-12" }
```

---

### Colección `wishlist`

Estructura de un documento:

```json
{
  "userId": "user1",
  "movieId": "movie3",
  "createdAt": "2026-01-10"
}
```

Insertar varios documentos de ejemplo:

```json
{ "userId": "user1", "movieId": "movie1", "createdAt": "2026-01-10" }
{ "userId": "user1", "movieId": "movie3", "createdAt": "2026-01-11" }
{ "userId": "user2", "movieId": "movie2", "createdAt": "2026-01-12" }
```

---

## Bloque 4 · CRUD desde Data Explorer (15 min)

Ejecutamos estas operaciones desde el shell de Atlas o Data Explorer:

```js
// Leer todos los documentos
db.reviews.find()

// Filtrar por película
db.reviews.find({ movieId: "movie1" })

// Filtrar por rating mínimo
db.reviews.find({ rating: { $gte: 8 } })

// Actualizar el rating de una review
db.reviews.updateOne(
  { movieId: "movie1", userId: "user1" },
  { $set: { rating: 10 } },
)

// Eliminar una review
db.reviews.deleteOne({ movieId: "movie1", userId: "user2" })
```

---

### Operadores importantes

| Operador | Significado      | Ejemplo                       |
| :------- | :--------------- | :---------------------------- |
| `$set`   | Actualizar campo | `{ $set: { rating: 9 } }`     |
| `$gte`   | Mayor o igual    | `{ rating: { $gte: 8 } }`     |
| `$lt`    | Menor que        | `{ rating: { $lt: 5 } }`      |
| `$in`    | Dentro de lista  | `{ movieId: { $in: [...] } }` |

---

## Bloque 5 · Conectar Express + Mongoose (15 min)

### ¿Qué es Mongoose?

Mongoose es librería de modelado de datos y objetos (ODM: Object Document Mapper) para Node.js y MongoDB. Actúa como un puente que permite interactuar con bases de datos NoSQL mediante programación orientada a objetos. Proporciona un entorno estructurado para definir esquemas, validar datos y construir consultas.

Funciones:

- Define esquemas para los documentos
- Valida los datos antes de guardar
- Ofrece métodos como `.find()`, `.save()`, `.findByIdAndUpdate()`

> Es como Prisma, pero para MongoDB.

---

### Instalación y configuración

```bash
npm install
cp .env.example .env
# Añadir la connection string de Atlas en MONGODB_URI
npm run dev
```

**Connection String de Atlas:**

```
mongodb+srv://usuario:contraseña@cursofsia.xxxxx.mongodb.net/cursofsia
```

---

### Modelo vs Schema

```js
// reviewSchema define la estructura
const reviewSchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  rating: { type: Number, min: 1, max: 10, required: true },
})

// Review es el modelo (equivale a la colección en MongoDB)
export const Review = mongoose.model("Review", reviewSchema)
```

---

### Probar los endpoints con Postman

| Método   | Ruta                      | Descripción             |
| :------- | :------------------------ | :---------------------- |
| `POST`   | `/reviews`                | Crear review            |
| `GET`    | `/reviews/movie/:movieId` | Reviews de una película |
| `PUT`    | `/reviews/:id`            | Actualizar review       |
| `DELETE` | `/reviews/:id`            | Eliminar review         |
| `POST`   | `/wishlist`               | Añadir a wishlist       |
| `GET`    | `/wishlist/user/:userId`  | Wishlist de un usuario  |
| `DELETE` | `/wishlist/:id`           | Quitar de wishlist      |

---

## Bloque 6 · Arquitectura Híbrida (5 min)

### Prompt de IA para revisar modelos

```
Te paso un modelo de documento MongoDB para una colección de reviews.

Quiero que me digas:
- si la estructura tiene sentido
- qué campos faltan
- qué mejorarías

No quiero que reescribas el modelo completo.
Solo quiero explicación.

{
  "movieId": "movie1",
  "userId": "user1",
  "rating": 8,
  "comment": "Great movie"
}
```

---

## ✅ Resumen Final

- [ ] Entiendo la diferencia entre SQL y NoSQL
- [ ] Sé crear una base de datos y colecciones en MongoDB Atlas
- [ ] Sé insertar, leer, actualizar y eliminar documentos en Atlas
- [ ] Entiendo qué es Mongoose y para qué sirve
- [ ] Sé definir un Schema con Mongoose
- [ ] Entiendo la arquitectura híbrida SQL + MongoDB

---
