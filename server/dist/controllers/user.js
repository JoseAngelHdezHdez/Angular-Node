"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.newUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const newUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    //Validamos si existe el usuario
    const user = yield user_1.User.findOne({ where: { username } });
    if (user) {
        return res.status(400).json({
            msg: `Usuario con el nombre ${username}, ya existe`
        });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    try {
        // Guardamos usuario en la base de datos
        yield user_1.User.create({
            username,
            password: hashedPassword
        });
        res.json({
            msg: `Usuario ${username} creado exitosamente!!!!`
        });
    }
    catch (error) {
        res.status(400).json({
            msg: 'Ups occurio un error',
            error
        });
    }
});
exports.newUser = newUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    //Validamos que el usuario existe en la base de datos
    const user = yield user_1.User.findOne({ where: { username } });
    if (!user) {
        return res.status(400).json({
            msg: `Esta mal el usuario o la contraseña`
        });
    }
    //Validamos password
    const passwordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!passwordValid) {
        return res.status(400).json({
            msg: `Esta mal el usuario o la contraseña`
        });
    }
    //Generamos token
    const token = jsonwebtoken_1.default.sign({
        username
    }, process.env.SECRET_KEY || 'PEPITO123', {
        expiresIn: '400000'
    });
    res.json(token);
});
exports.loginUser = loginUser;
