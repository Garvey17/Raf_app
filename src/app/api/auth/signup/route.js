import User from "@/lib/models/UserModel";
import { connectDB } from "@/lib/config/dbSetup";
import { hash } from "bcrypt";


export async function POST (req) {
    try {
        await connectDB() 

        const {name, email, password} = await req.json()

        const exists  = await User.findOne({email})
        if(exists){
            return Response.json({error: "User already exists"}, {status: 400})
        }

        const hashedPassword = await hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        return Response.json({message: "User created successfully", user})
    } catch (error) {
        return Response.json({error: error.message}, {status: 500})
    }
}