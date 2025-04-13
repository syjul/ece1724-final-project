"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { deleteUser } from "@/lib/actions"

interface UserListProps {
    users: prisma.User[]
}

export default function UserList(props : UserListProps ) {
    const deleteUserContext = (id:string) => {
        try{
            deleteUser(id)
            const idx = props.users.findIndex((g)=>{return g.id === id})
            if (idx != -1) {
                props.users = [...props.users.splice(idx,1)]
            }
            window.location.reload() // replace with better?? doesnt work??
        } catch {

        }
    }

    return (
        <div className="relative flex flex-col p-4 w-9/10 h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
            <table className="w-full text-left table-auto min-w-max">
                <thead className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                    <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Is Manager</th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.users.length === 0 ? <tr><td>No users</td></tr> :
                        props.users.map((q)=>{return (
                        <tr key={q.username}>
                            <td>{q.name}</td>
                            <td>{q.username}</td>
                            <td>{q.isManager?"yes":"no"}</td>
                            <td><Link className={buttonVariants({variant:"outline"})} href={"/manage/users/"+q.id+"/edit"}>Edit</Link><Button onClick={()=>{deleteUserContext(q.id)}} className="text-red-800 bg-red-50">Delete</Button></td>
                        </tr>)})
                    }
                </tbody>
            </table>
        </div>
    )
}