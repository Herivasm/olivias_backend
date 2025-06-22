import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./config/db"
import productRoutes from "./routes/productRoutes"
// import orderRoutes from "./routes/orderRoutes"
import supplierRoutes from "./routes/supplierRoutes"
import supplyRoutes from "./routes/supplyRoutes"

dotenv.config()
connectDB()

const app = express()

// Habilita CORS para que el frontend pueda comunicarse con el backend
app.use(cors({
  origin: "http://localhost:5173" // reemplaza si usas otro puerto para el front
}))

app.use(express.json())

// Rutas
app.use('/api/products', productRoutes)
// app.use("/api/orders", orderRoutes)
app.use('/api/suppliers', supplierRoutes)
app.use('/api/supplies', supplyRoutes)

export default app
