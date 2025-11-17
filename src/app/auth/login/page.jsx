import { Card } from "@/Components/ui/card";
import LoginForm from "./LoginForm";

export default function LoginPage() {
    return (
        <div className="h-screen flex justify-center items-center">
            <Card className={'p-6'}>
                 <LoginForm />
            </Card>
        </div>
       
    )
}