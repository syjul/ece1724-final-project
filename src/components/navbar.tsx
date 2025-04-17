"use client"

import { authClient } from "@/lib/auth-client"
import { Button } from "./ui/button"
import { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";

interface NavbarProps {
    activeTab: number
}

const activeCss = "bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold"
const inactiveCss = "bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold"

export default function Navbar({ activeTab } : NavbarProps) {
    const [user, setUser] = useState(Prisma.User)

    const handleLogout = async () => {
        await authClient.signOut()
        window.location.href = "/"
    }

    const getUser = async () => {
        const sess = await authClient.getSession()
        if (sess.data) {
            setUser(sess.data?.user)
        } else {
            window.location.href = "/"
        }
    }

    useEffect(()=> {
        getUser()
    },[])

    return (
    <div className="flex border-b">
        <ul className="flex border-b">
            <li className={activeTab===0?"-mb-px mr-1":"mr-1"}>
                <a className={activeTab===0?activeCss:inactiveCss} href="/dashboard">Dashboard</a>
            </li>
            { user?.isManager?(
                <div className="flex border-b">
                <li className={activeTab===1?"-mb-px mr-1":"mr-1"}>
                    <a className={activeTab===1?activeCss:inactiveCss} href="/manage/users">Manage Users</a>
                </li>
                <li className={activeTab===2?"-mb-px mr-1":"mr-1"}>
                    <a className={activeTab===2?activeCss:inactiveCss} href="/manage/groups">Manage Groups</a>
                </li>
                <li className={activeTab===3?"-mb-px mr-1":"mr-1"}>
                    <a className={activeTab===3?activeCss:inactiveCss} href="/manage/quizzes">Manage Quizzes</a>
                </li>
                </div>):<></>
            }
            <li className="self-end float-right">
                <Button onClick={handleLogout} className={inactiveCss}>Logout</Button>
            </li>
        </ul>
    </div>
    )
}