"use client";

import { useAuthStore } from "@/store/Auth";
import { useEffect } from "react";

export default function AuthInitializer() {
    const initializeAuth = useAuthStore((state) => state.initializeAuth);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return null;
}
