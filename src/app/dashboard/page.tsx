"use client"

import { Suspense, useEffect, useState } from "react";
import QuizList from "@/components/quizList";
import { getQuizzes } from "@/lib/actions"
import Navbar from "@/components/navbar";
import { authClient } from "@/lib/auth-client";
import Card from "@/components/ui/card" 


export default function Dashboard() {
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
    getQuizContext(false)
  },[])

  return (
    <div>
      {
      loading? <p>Loading dashboard...</p>:
        <div>
          <Navbar activeTab={0}/>
          <Card title="Available Quizzes" content={<QuizList quizzes={quizzes}/>} />
        </div>
      }
    </div>
  );
}

export const dynamic = "force-dynamic";
