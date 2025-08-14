import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRouter from './client/routes/authRoutes.js';

dotenv.config();

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN1 || process.env.CORS_ORIGIN2 || 'http://localhost:3000',
    credentials: true,
}))

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use('/api/client', authRouter);

app.use((req, res) => res.status(404).json({ ok: false, errors: { message: 'Not found' } }));
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ ok: false, errors: { message: 'Server error' } });
});

export default app;