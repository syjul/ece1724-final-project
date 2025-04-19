"use client"

 import { useEffect, useState, startTransition} from "react";
import { getUsers, getGroups } from "@/lib/actions"
import { Prisma } from "@prisma/client";
import { assignQuiz } from "@/lib/actions"
import { buttonVariants, Button } from "../ui/button";
import { useParams } from 'next/navigation'
import Link from "next/link"

interface AssignQuizProps {
    quiz: Prisma.Quiz,
}

export default function AssignQuiz({quiz}:AssignQuizProps) {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [fetchUsers, setFetchUsers] = useState([]);
    const [fetchGroups, setFetchGroups] = useState([]);
    const [userIDS, setUserIDS] = useState([])
    const [groupIDS, setGroupIDS] = useState([])
    const params = useParams<{id: string}>()

    useEffect(()=>{
        if (quiz) {
            getUsers(0,0).then((r) => {
                setFetchUsers(r.users)
                let uids = []
                console.log(quiz)
                for(let i = 0; i < quiz.users.length; i++ ) {
                    uids.push(quiz.users[i].id)
                }
                setUserIDS(uids)
            })
            getGroups(0,0).then((r) => {
                setFetchGroups(r.groups)
                let gids = []
                for(let i = 0; i < quiz.groups.length; i++ ) {
                    gids.push(quiz.groups[i].id)
                }
                setGroupIDS(gids)
            })
        }
    },[quiz])

    const handleSaveAssignments = (fd: FormData) => {
        startTransition(async () => {
            try {
                setError("")
                setMessage("")
    
                const usersFD = fd.get("users")
                let users = ""
                if (usersFD) {
                    users = usersFD.toString()
                }
    
                let userList = users.split(",")
                if (users === "") {
                    userList = []
                }

                const groupsFD = fd.get("groups")
                let groups = ""
                if (groupsFD) {
                    groups = groupsFD.toString()
                }
    
                let groupList = groups.split(",")
                if (groups === "") {
                    groupList = []
                }
    
                const result = await assignQuiz(parseInt(params.id), groupList, userList)
                setMessage("Quiz assigned succesfully")
                window.location.href="/manage/quizzes"
            } 
            catch (e) {
                console.log("Error: " + e)
                setError("Error assigning to quiz")
            }
        })
    }

    const onUserChange = (event) => {
        let options: HTMLOptionElement[] = Array.from(event.target.options);

        let selected = options
        .filter(o => o.selected)
        .map(o => o.value);
        setUserIDS(selected)
    }

    const onGroupChange = (event) => {
        let options: HTMLOptionElement[] = Array.from(event.target.options);

        let selected = options
        .filter(o => o.selected)
        .map(o => o.value);
        setGroupIDS(selected)
    }

    return(
        <div> 
            {
                quiz!=undefined?
                (
                    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Assignments to "{quiz.name}"</h2>
    </div>
            <form className="space-y-6" action={handleSaveAssignments}>
                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="users" className="block text-sm/6 font-medium text-gray-900">
                        Users
                        </label>
                    </div>
                    <select multiple value={userIDS} onChange={onUserChange} name="users" id="users" className="border p-2 w-full" data-testid="author-dropdown">
                    {fetchUsers.length === 0 ? (<option disabled>No users available</option>) 
                    : (fetchUsers.map((a)=>{return <option key={a.id} value={a.id}>{a.name}</option>}))}
                    </select>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="groups" className="block text-sm/6 font-medium text-gray-900">
                        Users
                        </label>
                    </div>
                    <select multiple value={groupIDS} onChange={onGroupChange} name="groups" id="groups" className="border p-2 w-full" data-testid="author-dropdown">
                    {fetchGroups.length === 0 ? (<option disabled>No groups available</option>) 
                    : (fetchGroups.map((a)=>{return <option key={a.id} value={a.id}>{a.name}</option>}))}
                    </select>
                </div>

                {error ? <p className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">{error}</p>:<></>}
                {message ? <p className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400">{message}</p>:<></>}
                <Button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Save
                </Button>

                <Link href="/manage/quizzes" className={buttonVariants({variant: "outline"})} >
                    Cancel
                </Link>
            </form>
            </div>
        </div>
                )
                :(
                    <p>Loading quiz data..</p>
                )
            }
        </div>
    )
}

export const dynamic = "force-dynamic";