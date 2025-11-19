
// import { login } from "@/lib/auth";
import Image from "next/image";
import LoginForm from "./LoginForm";


export default function LoginPage() {
//   const handleLogin = async (data) => {
//     await login(data.email, data.password);
//     // redirect logic
//   };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <LoginForm />
    </div>
  );
}
