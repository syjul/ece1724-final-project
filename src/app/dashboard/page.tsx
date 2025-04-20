"use client"

import { Suspense, useEffect, useState } from "react";
import QuizList from "@/components/quiz/quizList";
import { getQuizzes } from "@/lib/actions"
import Navbar from "@/components/navbar";
import { authClient } from "@/lib/auth-client";
import Card from "@/components/ui/card_old"


export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<String>()
  const [quizzes, setQuizzes] = useState([])
  const [manageQuizzes, setManageQuizzes] = useState([])
  const [user, setUser] = useState({})


  const getQuizContext = async (manage: boolean) => {
    try {
      const sess = await authClient.getSession()
      if (!sess.data || sess.error) {
        window.location.href = "/"
      } else {
        setUser(sess.data.user)
        if (sess.data.user.isManager) {
          const q = await getQuizzes(true)
          setManageQuizzes(q)
        }
      }
      const q = await getQuizzes(manage)
      setQuizzes(q)
    } catch {
      setError("Error loading dashboard")
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
          <Card title="Available Quizzes" content={<QuizList manage={false} quizzes={quizzes}/>} />
          <div className="py-4"></div>
          {user.isManager?<Card title="Quiz Analytics" content={<QuizList manage={true} analysis={true} quizzes={manageQuizzes}/>} />:<></>}
        </div>
      }
      {
        error? <p>{error}</p>:<></>
      }
    </div>
  );
}

export const dynamic = "force-dynamic";
