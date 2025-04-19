"use client"

 import { useEffect, useState, startTransition} from "react";
import { getUsers, getGroups, addResponse, uploadFile } from "@/lib/actions"
import { Prisma } from "@prisma/client";
import { assignQuiz } from "@/lib/actions"
import { buttonVariants, Button } from "./ui/button";
import { useParams } from 'next/navigation'
import Link from "next/link"
import TakeQuestion from "./takeQuestion";
import { authClient } from "@/lib/auth-client";
import {v4 as uuidv4 } from "uuid";

interface TakeQuizProps {
    quiz: Prisma.Quiz,
}

export default function TakeQuiz({quiz}:TakeQuizProps) {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [unavailable, setUnavailable] = useState(false);

    useEffect(()=>{
        if (quiz) {
            setLoading(false)
            if (quiz.expiresAt) {
                if (quiz.expiresAt < Date.now()) {
                    setUnavailable(true)
                }
            }
        }
    },[quiz])

    const handleSaveQuiz = (fd: FormData) => {
        const sessID = uuidv4()
        let responses = []
        startTransition(async () => {
            try {
                const sess = await authClient.getSession()
                if (!sess.data || sess.error) {
                    setError("User session not available")
                }
                setError("")
                setMessage("")
    
                for (var pair of fd.entries()) {
                    let k = pair[0].split("-")
                    const qID = parseInt(k[k.length-1])
                    /*const quest = quiz.questions.find((q)=>{return (q.id === qID)})
                    if (quest) {
                        if (quest.type == 1) {
                            //const cID = k[k.length-2]
                            
                        }
                    }*/
                    let response = {}
                    response[pair[0]] = pair[1]
                    responses.push([...pair,qID])
                    await addResponse(sessID, sess.data?.user.id, qID, JSON.stringify(response))
                }
                createXAPI(sessID,responses)
                //window.location.href = "/dashboard"
            } 
            catch (e) {
                console.log("Error: " + e)
                setError("Error assigning to quiz")
            }
        })
    }

    const createXAPI = (sessID: string, responses: []) => {
        startTransition(async () => {
            try {
                const sess = await authClient.getSession()
                let statements = []
                for (let i = 0; i < responses.length; i++) {
                    console.log(responses)
                    const qID = responses[i][2]
                    const question = quiz.questions.find((q)=>{return q.id === qID})
                    if (!question) {
                        console.log(qID)
                        console.log(quiz)
                        break
                    }
                    const qdata = JSON.parse(question.data)
                    let choiceText = {}
                    for (const [key, value] of Object.entries(qdata)) {
                        const ks = key.split("-")
                        if (ks[1]==="text") {
                            choiceText[ks[ks.length-1].toString()] = value
                        }
                    }
                    if (!question.correctResponsePattern) {
                        for (const [key, value] of Object.entries(qdata)) {
                            const ks = key.split("-")
                            if (ks[1]=="correct") {
                                if (question.type == 0) {
                                    question["correctResponsePattern"] = [
                                        value
                                    ]
                                } else if (question.type == 1) {
                                    console.log(question["correctResopnsePattern"])
                                    question["correctResopnsePattern"] = question["correctResopnsePattern"]?
                                        question["correctResopnsePattern"].push(choiceText[ks[ks.length-1]]):[choiceText[ks[ks.length-1]]]
                                }
                            }
                        }
                    }
                    let statement = {
                        "actor": {
                            "account": {
                                "homePage":"/", 
                                "name": sess.data?.user.username
                            }
                        },
                        "context": {
                            "registration": sessID
                        },
                        "verb": {
                            "id": "http://adlnet.gov/expapi/verbs/answered",
                            "display": {
                                "en-us" : "answered"
                            }
                        },
                        "object": {
                            "id":responses[i][0],
                            "definition": {
                                "name": { "en-US": responses[i][0] }
                            },
                            "correctResponsePattern":question["correctResopnsePattern"]
                        },
                    }
                    if (question.type === 0) {
                        statement["result"] = {
                            "response": responses[i][1]
                        }
                        statements.push(statement)
                    } else if (question.type === 1) {
                        const smt = statements.find((s)=>{
                            return s["object"]["id"].split("-")[3] === question.id
                        })
                        const cid = responses[i][0].split("-")[2]
                        console.log("CID: " + cid)
                        console.log(choiceText)
                        if (smt) {
                            let res = smt["result"]["response"]
                            res = res.slice(0,res.length-2)+","+choiceText[cid]+"]"
                            smt["result"]["response"] = res
                        } else {
                            statement["result"] = {
                                "response": "["+choiceText[cid]+"]"//responses[i][1]
                            }
                            statements.push(statement)
                        }
                    }
                }
                const statementStr = JSON.stringify(statements)
                uploadFile(sessID, statementStr)
                //window.location.href = "/dashboard"
            }
            catch (e) {
                console.log("Error file: " + e)
                setError("Error saving to file")
            }
        })
    }

    return(
        <div>
            {unavailable?<p>Quiz is expired</p>:(
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
                                <div key={question.id}>
                                    <TakeQuestion question={question}></TakeQuestion>
                                </div>
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
            </div>)}
        </div>
    )
}

export const dynamic = "force-dynamic";