"use client"

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button"
import { createUser } from "@/lib/actions"
import { prisma } from "@/lib/prisma"

interface QuizListProps {
    quizzes: prisma.Quiz[]
}

export default function QuizList(props : QuizListProps ) {
    return (
        <div>
            <table className="text-left table-auto min-w-max">
                <thead className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                    <tr>
                    <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.quizzes.length === 0 ? <tr><td>No quizzes</td></tr> :
                        props.quizzes.map((q)=>{return <tr><td>{q}</td></tr>})
                    }
                </tbody>
            </table>
        </div>
    )
}