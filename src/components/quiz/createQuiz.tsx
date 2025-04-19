"use client"

import Card from "@/components/ui/card_old" 
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import QuestionForm from "../question/questionForm";
import { createQuizWithQuestions, editQuizWithQuestions } from "@/lib/actions"
import { Prisma } from "@prisma/client";

interface CreateQuizProps {
    quiz?: Prisma.Quiz,
}

export default function CreateQuiz({quiz}:CreateQuizProps) {
    const [questions, setQuestions] = useState([])
    const [saveData, setSaveData] = useState([])
    const [send, setSend] = useState(false)
    const [timeVal, setTimeVal] = useState("")

    useEffect(()=>{
        if (quiz) {
            setQuestions(quiz.questions)
            for(let i = 0; i < quiz.questions.length; i++) {
                console.log(quiz.questions)
            }
            if (quiz.expiresAt) {
                let tv=new Date( quiz.expiresAt?.getTime() - ( quiz.expiresAt?.getTimezoneOffset() * 60000 )).toISOString();
                console.log(tv)
                tv = tv.slice(0,tv.length-1)
                setTimeVal(tv)
            }
        }
    },[quiz])
    
    const addQuestion = () => {
        let data = {id:0,text:"",choices:[]}
        if (questions.length > 0) {
            data.id = questions[questions.length-1].id + 1
        }
        questions.push(data)
        setQuestions([...questions])
    }

    const beginSend = () => {
        setSend(true)
    }

    const addQuestionData = (id:number, fd: FormData) => {
        let data = {id:id}
        let formProc = {}
        for (var pair of fd.entries()) {
            formProc[pair[0]] = pair[1]
        }
        data["data"] = formProc
        saveData.push(data)

        setSaveData(saveData)
        if (saveData.length >= questions.length) {
            const name = document.getElementById("quizName")?.value
            const time = document.getElementById("quizTime")?.value
            if (!quiz) {
                createQuizWithQuestions(name,time,saveData)
            } else {
                editQuizWithQuestions(quiz.id,name,time,saveData)
            }
        }
    }

    return(
        <div> 
            <p className="text-xl py-4"><b>Create Quiz</b></p>

            <div className="py-4">
                <div className="flex items-center justify-between">
                    <label htmlFor={"quizName"} className="block text-sm/6 font-medium text-gray-900">
                        Quiz Name
                    </label>
                </div>
                <div className="mt-2">
                    <input defaultValue={quiz?quiz.name:""} id="quizName" name="quizName" type="text" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"></input>
                </div>
            </div>

            <div className="py-4">
                <div className="flex items-center justify-between">
                    <label htmlFor={"quizTime"} className="block text-sm/6 font-medium text-gray-900">
                        Due By
                    </label>
                </div>
                <div className="mt-2">
                    <input defaultValue={quiz?.expiresAt?timeVal:""} id="quizTime" name="quizTime" type="datetime-local" className=""></input>
                </div>
            </div>

            <Button onClick={addQuestion}>Add question</Button>
            {questions.length == 0? <p>No questions yet</p>: 
            questions.map((q)=>{
                return (
                    <div className="py-4" key={q.id}>
                    <Card title="" content={
                        <div>
                            <QuestionForm send={send} defaultValues={q.data?JSON.parse(q.data):{}} id={q.id} saveData={addQuestionData}></QuestionForm>
                        </div>
                    }/>
                    </div>
                )
            })}
            <Button type="button" onClick={beginSend}>Save Quiz</Button>
        </div>
    )
}

export const dynamic = "force-dynamic";