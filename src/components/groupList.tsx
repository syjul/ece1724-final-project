"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { deleteGroup } from "@/lib/actions"
import Link from "next/link"
import { useEffect, useState } from "react"


interface GroupListProps {
    groups: prisma.Group[]
}

export default function GroupList(props : GroupListProps ) {
    const deleteGroupContext = (id:number) => {
        try{
            deleteGroup(id)
            const idx = props.groups.findIndex((g)=>{return g.id === id})
            if (idx != -1) {
                props.groups = [...props.groups.splice(idx,1)]
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
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.groups.length === 0 ? <tr><td>No groups</td></tr> :
                        props.groups.map((q)=>{return (
                        <tr key={q.id}>
                            <td>{q.name}</td>
                            <td><Link href={"/manage/groups/"+q.id+"/edit"} className={buttonVariants({variant:"outline"})}>Edit</Link><Button onClick={()=>{deleteGroupContext(q.id)}} className="text-red-800 bg-red-50">Delete</Button></td>
                        </tr>)})
                    }
                </tbody>
            </table>
        </div>
    )
}