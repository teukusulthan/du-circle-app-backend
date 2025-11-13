"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggestUser = exports.patchProfile = exports.profile = exports.login = exports.register = void 0;
const password_1 = require("../utils/password");
const client_1 = require("../connections/client");
const appError_1 = require("../utils/appError");
const jwt_1 = require("../utils/jwt");
const register = async (req, res) => {
    const { username, name, email, password } = req.body;
    if (!email || !username) {
        throw new appError_1.AppError(400, "Email and username are required");
    }
    const exist = await client_1.prisma.user.findUnique({ where: { email } });
    if (exist) {
        throw new appError_1.AppError(409, "Email is already used");
    }
    const hashedPassword = await (0, password_1.hashPassword)(password);
    const user = await client_1.prisma.user.create({
        data: {
            username,
            full_name: name,
            email,
            password: hashedPassword,
        },
    });
    const token = (0, jwt_1.signToken)({ id: user.id, email: user.email });
    res.status(201).json({
        code: 201,
        status: "success",
        message: "Registered succesfully!",
        data: {
            user_id: user.id,
            username: user.username,
            name: user.full_name,
            email: user.email,
            token: token,
        },
    });
};
exports.register = register;
const login = async (req, res, next) => {
    const { identifier, password } = req.body;
    const idNorm = identifier.trim();
    const user = await client_1.prisma.user.findFirst({
        where: {
            OR: [
                { email: { equals: idNorm.toLowerCase(), mode: "insensitive" } },
                { username: { equals: idNorm, mode: "insensitive" } },
            ],
        },
    });
    if (!user) {
        throw new appError_1.AppError(404, "Account is not registered");
    }
    const ok = await (0, password_1.comparePassword)(password, user.password);
    if (!ok) {
        throw new appError_1.AppError(401, "Wrong Password");
    }
    const token = (0, jwt_1.signToken)({ id: user.id, email: user.email });
    res.status(200).json({
        code: 201,
        status: "success",
        message: "Logged in succesfully!",
        data: {
            user_id: user.id,
            username: user.username,
            name: user.full_name,
            email: user.email,
            bio: user.bio,
            avatar: user.profile_photo,
            banner: user.banner_photo,
            token: token,
        },
    });
};
exports.login = login;
const profile = async (req, res) => {
    const auth = req.user;
    if (!auth?.id) {
        throw new appError_1.AppError(401, "Unauthorized");
    }
    const user = await client_1.prisma.user.findUnique({
        where: { id: auth.id },
        select: {
            id: true,
            username: true,
            full_name: true,
            profile_photo: true,
            banner_photo: true,
            bio: true,
        },
    });
    if (!user) {
        throw new appError_1.AppError(404, "User not found");
    }
    const [follower_count, following_count] = await Promise.all([
        client_1.prisma.following.count({ where: { following_id: user.id } }),
        client_1.prisma.following.count({ where: { follower_id: user.id } }),
    ]);
    res.status(200).json({
        code: 200,
        status: "success",
        message: "Get profile successfully",
        data: {
            id: user.id,
            username: user.username,
            name: user.full_name,
            avatar: user.profile_photo ?? null,
            banner: user.banner_photo ?? null,
            bio: user.bio ?? "",
            follower_count,
            following_count,
        },
    });
};
exports.profile = profile;
const patchProfile = async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        throw new appError_1.AppError(401, "Unauthorized");
    const { name, username, bio } = req.body;
    const files = req.files;
    const data = {};
    if (name)
        data.full_name = name;
    if (username) {
        const exists = await client_1.prisma.user.findFirst({
            where: {
                username: { equals: username, mode: "insensitive" },
                NOT: { id: userId },
            },
        });
        if (exists)
            throw new appError_1.AppError(409, "Username is already taken");
        data.username = username;
    }
    if (bio !== undefined)
        data.bio = bio;
    if (files?.profile_photo?.[0])
        data.profile_photo = `http://localhost:3000/uploads/${files.profile_photo[0].filename}`;
    if (files?.banner_photo?.[0])
        data.banner_photo = `http://localhost:3000/uploads/${files.banner_photo[0].filename}`;
    if (!Object.keys(data).length)
        throw new appError_1.AppError(400, "No fields to update");
    const user = await client_1.prisma.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            username: true,
            full_name: true,
            email: true,
            bio: true,
            profile_photo: true,
            banner_photo: true,
        },
    });
    res.status(200).json({
        code: 200,
        status: "success",
        message: "Profile updated successfully",
        data: {
            id: user.id,
            username: user.username,
            name: user.full_name,
            email: user.email,
            bio: user.bio,
            avatar: user.profile_photo,
            banner_photo: user.banner_photo,
        },
    });
};
exports.patchProfile = patchProfile;
const suggestUser = async (req, res) => {
    const suggest = await client_1.prisma.$queryRaw `SELECT * FROM "User" 
  ORDER BY RANDOM()
  LIMIT 10;`;
    res.status(200).json({
        code: 200,
        status: "success",
        message: "User fetched succedfully",
        data: suggest,
    });
};
exports.suggestUser = suggestUser;
