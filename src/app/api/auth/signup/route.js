import User from "@/lib/models/UserModel";
import { connectDB } from "@/lib/config/dbSetup";
import { hash } from "bcrypt";


export async function POST(req) {
    try {
        await connectDB()

        const { name, email, password, phone, location } = await req.json()

        // Validate required fields
        if (!name || !email || !password) {
            return Response.json(
                { error: "Name, email, and password are required" },
                { status: 400 }
            )
        }

        const exists = await User.findOne({ email })
        if (exists) {
            return Response.json({ error: "User already exists" }, { status: 400 })
        }

        const hashedPassword = await hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone: phone || "",
            location: location || {
                address: "",
                city: "",
                state: "",
                zipCode: "",
                country: ""
            },
            verificationStatus: "unverified"
        })

        // Remove password from response
        const userResponse = user.toObject()
        delete userResponse.password

        return Response.json({
            message: "User created successfully",
            user: userResponse
        })
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}