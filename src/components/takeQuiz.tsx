"use client"

 import { useEffect, useState, startTransition} from "react";
import { getUsers, getGroups, addResponse } from "@/lib/actions"
import { Prisma } from "@prisma/client";
import { assignQuiz } from "@/lib/actions"
import { buttonVariants, Button } from "./ui/button";
import { useParams } from 'next/navigation'
import Link from "next/link"
import TakeQuestion from "./takeQuestion";
import { authClient } from "@/lib/auth-client";

interface TakeQuizProps {
    quiz: Prisma.Quiz,
}

export default function TakeQuiz({quiz}:TakeQuizProps) {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        if (quiz) {
            setLoading(false)
            console.log("Questions: ")
            console.log(quiz?.questions)
        }
    },[quiz])

    const handleSaveQuiz = (fd: FormData) => {
        startTransition(async () => {
            try {
                const sess = await authClient.getSession()
                if (!sess.data || sess.error) {
                    setError("User session not available")
                }
                setError("")
                setMessage("")
    
                for (var pair of fd.entries()) {
                    console.log(pair[0]+ ', ' + pair[1]); 
                    let k = pair[0].split("-")
                    if (k.length > 3) {
                        const qID = parseInt(k[k.length-1])
                        /*const quest = quiz.questions.find((q)=>{return (q.id === qID)})
                        if (quest) {
                            if (quest.type == 1) {
                                //const cID = k[k.length-2]
                                
                            }
                        }*/
                       await addResponse(sess.data?.user.id, qID, pair[1])
                    }
                }
            } 
            catch (e) {
                console.log("Error: " + e)
                setError("Error assigning to quiz")
            }
        })
    }

    return(
        <div>
        {
        !loading?(
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">{quiz.name}</h2>
                    </div>
                    <form className="space-y-6" action={handleSaveQuiz}>
                        {quiz?.questions.map((question)=>{return (
                            <TakeQuestion question={question}></TakeQuestion>
                        )})}

                        {error ? <p className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">{error}</p>:<></>}
                        {message ? <p className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400">{message}</p>:<></>}
                        <Button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Save
                        </Button>
                    </form>
                </div>
            </div>
        ):(<p>Loading quiz..</p>)}
        </div>
    )
}

export const dynamic = "force-dynamic";