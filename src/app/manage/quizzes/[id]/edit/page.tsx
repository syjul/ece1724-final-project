"use client"

import { Suspense, useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import CreateQuiz from "@/components/quiz/createQuiz";
import { Prisma } from "@prisma/client";
import { useParams } from "next/navigation"
import { getQuiz } from "@/lib/actions"

export default function EditQuiz() {
const [quiz, setQuiz] = useState<Prisma.Quiz>()
const params = useParams<{id: string}>()

useEffect(()=>{
    getQuiz(parseInt(params.id)).then((q)=>{setQuiz(q)})
},[])

return (
<Suspense>
    <Navbar activeTab={3} />
    <CreateQuiz quiz={quiz}/>
</Suspense>
);
}

export const dynamic = "force-dynamic";