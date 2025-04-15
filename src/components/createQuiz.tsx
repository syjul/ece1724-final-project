"use client"

import Card from "@/components/ui/card" 
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import QuestionForm from "./questionForm";
import { createQuizWithQuestions } from "@/lib/actions"


export default function CreateQuiz() {
    const [questions, setQuestions] = useState([])
    const [saveData, setSaveData] = useState([])
    const [send, setSend] = useState(false)
    
    const addQuestion = () => {
        let data = {id:0,text:"",choices:[]}
        if (questions.length > 0) {
            data.id = questions[questions.length-1].id + 1
        }
        questions.push(data)
        setQuestions([...questions])
        console.log("Added choice: " + questions[1])
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
        console.log("Added to SD: " + JSON.stringify(data))
        setSaveData(saveData)
        if (saveData.length >= questions.length) {
            const name = document.getElementById("quizName")?.value
            createQuizWithQuestions(name,saveData)
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
                    <input id="quizName" name="quizName" type="text" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"></input>
                </div>
            </div>

            <Button onClick={addQuestion}>Add question</Button>
            {questions.length == 0? <p>No questions yet</p>: 
            questions.map((q)=>{
                return (
                    <div className="py-4" key={q.id}>
                    <Card title="" content={
                        <div>
                            <QuestionForm send={send} id={q.id} saveData={addQuestionData}></QuestionForm>
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