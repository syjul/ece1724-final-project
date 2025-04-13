"use client"

import { useEffect, useState, useTransition } from "react";
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { editUser, getUser } from "@/lib/actions"
import { useParams } from 'next/navigation'

export default function EditUser() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [user, setUser] = useState({})
    const params = useParams<{id: string}>()

    useEffect(()=>{
        getUser(params.id).then((u)=>{
            setUser(u)
        })
    },[])

    const handleEditUser = async (formData: FormData) => {
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

            const usernameFD = formData.get("username")
            let username = ""
            if (usernameFD) {
                username = usernameFD.toString()
            }

            if (username === "" || !usernameFD) {
                setError("Username is required")
                return
            }

            const passwordFD = formData.get("password")
            let password = ""
            if (passwordFD) {
                password = passwordFD.toString()
            }

            const passwordFDConf = formData.get("passwordConfirm")
            let passwordConf = ""
            if (passwordFDConf) {
                passwordConf = passwordFDConf.toString()
            }

            if (passwordConf != password) {
                setError("Passwords do not match")
                return
            }

            const isManagerFD = formData.get("isManager")
            let isManager = false
            if (isManagerFD) {
                isManager = isManagerFD.toString() === 'on'
            }

            const result = await editUser(name, username, password, isManager)
            setMessage("User saved succesfully")
            window.location.href="/manage/users"
        } 
        catch {
            setError("Error creating user")
        }})
    }

    return (
<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Edit User</h2>
    </div>
            <form className="space-y-6" action={handleEditUser}>
                <div>
                    <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                        Name
                    </label>
                    <div className="mt-2">
                        <input value={user.name} id="name" name="name" type="text" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"></input>
                    </div>
                </div>

                <div>
                    <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                        Username
                    </label>
                    <div className="mt-2">
                        <input value={user.username} id="username" name="username" type="text" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"></input>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                        Password
                        </label>
                    </div>
                    <div className="mt-2">
                        <input id="password" name="password" type="password" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" ></input>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="passwordConfirm" className="block text-sm/6 font-medium text-gray-900">
                        Confirm Password
                        </label>
                    </div>
                    <div className="mt-2">
                        <input id="passwordConfirm" name="passwordConfirm" type="password" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" ></input>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="isManager" className="block text-sm/6 font-medium text-gray-900">
                        Is Management
                        </label>
                    </div>
                    <div className="mt-2">
                        <input checked={user.isManager} id="isManager" name="isManager" type="checkbox" className="" ></input>
                    </div>
                </div>

                {error ? <p className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">{error}</p>:<></>}
                {message ? <p className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400">{message}</p>:<></>}
                <Button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Create
                </Button>

                <Link href="/manage/users" className={buttonVariants({variant: "outline"})} >
                    Cancel
                </Link>
            </form>
            </div>
        </div>
  );
}