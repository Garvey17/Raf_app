'use client';
import { useState } from "react";


export default function LoginForm({onSubmit}){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault()

        setLoading(true)
        setError("")
        try {
            onSubmit({email, password})
        } catch (error) {
            setError(error.message || "Error occured whilt trying to login")
        }finally{
            setLoading(false)
        }
    }
     return (
        <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        </div>
        <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50"
        >
            {loading ? "Logging in..." : "Login"}
        </button>
        </form>
    );
}