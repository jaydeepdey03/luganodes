'use client'

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'

export default function DashboardLayout({ children }) {
    const router = useRouter()
    const [isSuccess, setIsSuccess] = useState(false)
    useEffect(() => {
        (async () => {
            const { user, error } = await getUser()
            console.log(user, 'user')
            if (error) {
                router.push('/login')
                return
            }
            setIsSuccess(true)
        })();
    }, [router])
    if(!isSuccess) return (<div>Loading...</div>)
    return (
        <div>
            {children}
        </div>
    )
}


async function getUser() {
    try {
        const res = await fetch('http://localhost:5000/api/me')
        const data = await res.json()
        return {
            error: null,
            user: data
        }
    } catch (err) {
        return {
            error: err.message,
            user: null
        }
    }
}