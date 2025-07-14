import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import supplierRoutes from "./routes/supplierRoutes";
import supplyRoutes from "./routes/supplyRoutes";
import cashClosingRoutes from './routes/cashClosingRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config()
connectDB()

const app = express()

app.use(cors({
    origin: "https://olivias-frontend.vercel.app"
}))

app.use(express.json())

// Routes
app.use('/products', productRoutes)
app.use("/orders", orderRoutes)
app.use('/suppliers', supplierRoutes)
app.use('/supplies', supplyRoutes)
app.use('/api/cash-closings', cashClosingRoutes)
app.use('/api/auth', authRoutes);

export default app
