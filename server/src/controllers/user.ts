import bcrypt from "bcrypt";
import {Request, Response} from 'express';
import { User } from "../models/user";
import jwt from "jsonwebtoken";

export const newUser = async (req: Request, res: Response) => {

    const { username, password } = req.body;

    //Validamos si existe el usuario
    const user = await User.findOne({ where: { username}});

    if (user) {
        return res.status(400).json({
            msg: `Usuario con el nombre ${username}, ya existe`
        });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Guardamos usuario en la base de datos
        await User.create({
            username,
            password: hashedPassword
        });
        res.json({
            msg: `Usuario ${username} creado exitosamente!!!!`
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Ups occurio un error',
            error
        });
    }

}


export const loginUser = async (req: Request, res: Response) => {

    const { username, password } = req.body;

    //Validamos que el usuario existe en la base de datos
    const user: any = await User.findOne({where: {username}})

    if (!user) {
        return res.status(400).json({
            msg: `Esta mal el usuario o la contraseña`
        });
    }
    //Validamos password
    const passwordValid = await bcrypt.compare(password, user.password)
    
    if (!passwordValid) {
        return res.status(400).json({
            msg: `Esta mal el usuario o la contraseña`
        });
    }
    //Generamos token
    const token = jwt.sign({
        username
    }, process.env.SECRET_KEY || 'PEPITO123', {
        expiresIn: '400000'
    });

    res.json(token);
}

