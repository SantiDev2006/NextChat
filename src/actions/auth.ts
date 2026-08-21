"use server"

import { prisma } from "@/lib/prisma";
import bcrypt from 'bcryptjs';

export async function registerUser(formData:FormData) {
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if(!username || !email || !password){
        return { error: "Username, email, and password are required"}
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [{email}, {username}]
            }
        });

        if(user){
            return {error: "Email or username is already in use."};
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

        return { success: true };
    } catch (error) {
        console.error("Registration error: ", error);
        return { error: "Something went wrong during registration" };
    }
}