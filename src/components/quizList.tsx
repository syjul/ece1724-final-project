"use client"

import { useState, useTransition } from "react";
import { Button, buttonVariants } from "@/components/ui/button"
import { deleteQuiz } from "@/lib/actions"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

interface QuizListProps {
    quizzes: prisma.Quiz[],
    manage: boolean,
    analysis: boolean,
}

export default function QuizList(props : QuizListProps ) {
    const deleteQuizContext = (id:number) => {
        try{
            deleteQuiz(id)
            const idx = props.quizzes.findIndex((g)=>{return g.id === id})
            if (idx != -1) {
                props.quizzes = [...props.quizzes.splice(idx,1)]
            }
            window.location.reload() // replace with better?? doesnt work??
        } catch {

        }
    }

    return (
        <div>
            <div className="relative flex flex-col p-4 w-9/10 h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
            <table className="w-full text-left table-auto min-w-max">
                <thead className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                    <tr>
                    <th>Name</th>
                    {props.manage?<th></th>:<th></th>}
                    <th>Due by</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.quizzes.length === 0 ? <tr><td>No quizzes</td></tr> :
                        props.quizzes.map((q)=>{return (
                            <tr key={q.id}>
                                <td>{q.name}</td>
                                {props.manage?props.analysis?(<td><Link className={buttonVariants({variant:"outline"})} href={"/quizzes/"+q.id+"/view"}>View Analitics</Link></td>)
                                :(<td><Link className={buttonVariants({variant:"outline"})} href={"/manage/quizzes/"+q.id+"/assignments"}>Assign</Link><Link className={buttonVariants({variant:"outline"})} href={"/manage/quizzes/"+q.id+"/edit"}>Edit</Link><Button onClick={()=>{deleteQuizContext(q.id)}} className="text-red-800 bg-red-50">Delete</Button></td>
                                ):<td><Link className={buttonVariants({variant:"outline"})} href={"/quizzes/"+q.id+"/take"}>Take Quiz</Link></td>}
                                <td>{q.expiresAt?q.expiresAt.toLocaleString():"No expiration"}</td>
                            </tr>)})
                    }
                </tbody>
            </table>
            </div>
        </div>
    )
}