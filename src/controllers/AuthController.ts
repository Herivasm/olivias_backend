import type { Request, Response } from "express";
import User from "../models/User";
import { generateToken } from "../utils/token";

export class AuthController {

    static getAuthenticatedUser = async (req: Request, res: Response) => {
        res.json(req.user);
    }

    static registerUser = async (req: Request, res: Response) => {
        try {
            const { name, email, password } = req.body;

            const userExists = await User.findOne({ email });
            if (userExists) {
                res.status(409).json({ error: 'El email ya está registrado' });
                return
            }

            const user = new User({ name, email, password });

            await user.save();

            res.send('Usuario Registrado Correctamente');

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error al registrar el usuario' });
        }
    }

    static loginUser = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                res.status(404).json({ error: 'Usuario no encontrado' });
                return
            }

            const isPasswordCorrect = await user.checkPassword(password);
            if (!isPasswordCorrect) {
                res.status(401).json({ error: 'Contraseña incorrecta' });
                return
            }

            const token = generateToken({ id: user._id.toString() });

            res.json({ token });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error al iniciar sesión' });
        }
    }
}