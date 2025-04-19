"use client"

import { Suspense, useEffect, useState } from "react";
import QuizList from "@/components/quiz/quizList";
import { getQuizzes } from "@/lib/actions"
import Navbar from "@/components/navbar";
import Card from "@/components/ui/card_old" 
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button";


export default function ManageQuizzes() {
  const [loading, setLoading] = useState(true)
  const [quizzes, setQuizzes] = useState([])


  const getQuizContext = async (manage: boolean) => {
    try {
      const q = await getQuizzes(manage)
      setQuizzes(q)
    } catch {

    }
    setLoading(false)
  }

  useEffect(()=> {
    getQuizContext(true)
  },[])

  return (
    <div>
      {
      loading? <p>Loading quizzes...</p>:
        <div>
          <Navbar activeTab={3}/>
          <Card title="Quizzes" content={
            <div>
                <Link className={buttonVariants({variant:"outline"})} href="/manage/quizzes/create">New Quiz</Link>
                <QuizList manage={true} quizzes={quizzes}/>
            </div>
            } />
        </div>
      }
    </div>
  );
}

export const dynamic = "force-dynamic";
