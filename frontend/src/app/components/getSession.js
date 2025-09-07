"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react"
import { useSession } from "next-auth/react";
import Loader from "../admin/common/loader";

export default function useAuthSession(redirectTo = "/admin/login") {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push(redirectTo);
        }
    }, [status, router, redirectTo]);

    return {
        user: session?.user || null,
        loading: status === "loading"
    };
}
