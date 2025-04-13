"use client"

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client";

export default function CreateLogin() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (formData: FormData) => {
        startTransition(async () => {
        try {
            setError("")
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

            if (password === "" || !passwordFD) {
                setError("Password is required")
                return
            }
            
            //const result = await login(username, password)
            await authClient.signIn.username({
                username:username, 
                password:password
            })
            setMessage("Succesfully signed in")

            window.location.href = "/dashboard"
        } 
        catch {
            setError("Email or Password was incorrect")
        }})
    }

    return (
<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
  </div>

  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" action={handleLogin}>
                <div>
                    <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                        Username
                    </label>
                    <div className="mt-2">
                        <input id="username" name="username" type="text" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"></input>
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
                {error ? <p className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">{error}</p>:<></>}
                {message ? <p className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400">{message}</p>:<></>}
                <Button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Login
                </Button>
            </form>
            </div>
        </div>
  );
}