import Image from "next/image";
import StaffLoginForm from "./StaffLoginForm";

export default function StaffLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-slate-900 dark:to-slate-800">
            <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))] pointer-events-none" />
            <div className="relative z-10 w-full max-w-md">
                <StaffLoginForm />
            </div>
        </div>
    );
}
