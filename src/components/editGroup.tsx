"use client"

import { useEffect, useState, useTransition } from "react";
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { editGroup, getGroup, getUsers } from "@/lib/actions"
import { useParams } from 'next/navigation'

export default function EditGroup() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [fetchUsers, setFetchUsers] = useState([]);
    const [group, setGroup] = useState({})
    const [userIDS, setUserIDS] = useState([])
    const params = useParams<{id: string}>()

    useEffect(()=>{
        if(params.id){
            getGroup(parseInt(params.id)).then((g)=>{
                console.log("GROUP: "+ g.users[0].id)
                let ids = []
                for(let i = 0; i < g.users.length; i++ ) {
                    ids.push(g.users[i].id)
                }
                setUserIDS(ids)
                setGroup(g)
            })
        }
        getUsers(0,0).then((r) => {setFetchUsers(r.users)})
    },[])

    const handleEditGroup = async (formData: FormData) => {
        startTransition(async () => {
        try {
            setError("")
            setMessage("")

            const nameFD = formData.get("name")
            let name = ""
            if (nameFD) {
                name = nameFD.toString()
            }

            if (name === "" || !nameFD) {
                setError("Name is required")
                return
            }

            const usersFD = formData.get("users")
            let users = ""
            if (usersFD) {
                users = usersFD.toString()
            }

            let userList = users.split(",")

            const result = await editGroup(parseInt(params.id), name, userList)
            setMessage("Group created succesfully")
            window.location.href="/manage/groups"
        } 
        catch {
            setError("Error creating group")
        }})
    }

    return (
<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Edit Group</h2>
    </div>
            <form className="space-y-6" action={handleEditGroup}>
                <div>
                    <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                        Name
                    </label>
                    <div className="mt-2">
                        <input value={group.name} id="name" name="name" type="text" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"></input>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="users" className="block text-sm/6 font-medium text-gray-900">
                        Users
                        </label>
                    </div>
                    <select value={userIDS} multiple name="users" id="users" className="border p-2 w-full" data-testid="author-dropdown">
                    {/*<option value="US">United States</option>*/}
                    {fetchUsers.length === 0 ? (<option disabled>No users available</option>) 
                    : (fetchUsers.map((a)=>{return <option key={a.id} value={a.id}>{a.name}</option>}))}
                    </select>
                </div>

                {error ? <p className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">{error}</p>:<></>}
                {message ? <p className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400">{message}</p>:<></>}
                <Button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Save
                </Button>

                <Link href="/manage/groups" className={buttonVariants({variant: "outline"})} >
                    Cancel
                </Link>
            </form>
            </div>
        </div>
  );
}