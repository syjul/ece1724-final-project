"use client"

import { Suspense, useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import AssignQuiz from "@/components/assignQuiz";
import { Prisma } from "@prisma/client";
import { useParams } from "next/navigation"
import { getQuiz } from "@/lib/actions"
import TakeQuiz from "@/components/takeQuiz" 

export default function TakeQuizMain() {
    const [quiz, setQuiz] = useState<Prisma.Quiz>()
    const params = useParams<{id: string}>()

    useEffect(()=>{
        getQuiz(parseInt(params.id)).then((q)=>{setQuiz(q)})
    },[])

    return (
    <Suspense>
        <Navbar activeTab={0} />
        <TakeQuiz quiz={quiz}/>
    </Suspense>
    );
}

export const dynamic = "force-dynamic";