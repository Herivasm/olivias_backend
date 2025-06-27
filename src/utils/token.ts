import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

type TokenPayload = {
    id: string
}

export const generateToken = (payload: TokenPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: '8h'
    });
    return token;
}