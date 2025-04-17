"use client"

import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import Navbar from "@/components/navbar"
import { getQuizResponses, getQuiz } from "@/lib/actions"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Prisma } from "@prisma/client"
import PieChart from "@/components/ui/pieChart"

export default function ViewQuizAnalysis() {
    const [quizID, setQuizID] = useState(0)
    const [responses,setResponses] = useState<Prisma.Response>([])
    const [responseData, setResponseData] = useState()
    const [questionData, setQuestionData] = useState([])
    const [quiz, setQuiz] = useState<Prisma.Quiz>()
    const [isLoading, setIsLoading] = useState(true)
    const params = useParams<{id: string}>()

    const getResponses = (id:number) => {
        getQuizResponses(id).then((r)=>{
            getQuiz(id).then((q)=>{
                setResponses(r)
                setQuiz(q)
                console.log(r)
                unravelQuestionData(q, r)
                setIsLoading(false)
            })
        })
    }

    useEffect(()=>{
        const id = parseInt(params.id)
        setQuizID(id)
        getResponses(id)
    },[])

    const unravelQuestionData = (quiz: Prisma.Quiz, responseData) => {
        let questionData = []
        for(let i = 0; i < quiz.questions.length; i++) {
            let q = {}
            const question = quiz.questions[i]
            q.id = question.id
            q.type = question.type
            const data = JSON.parse(question.data)
            if (question.type === 1) {
                const keys = Object.keys(data)
                const choices = []
                for(let i = 0; i < keys.length; i++ ) {
                    const key = keys[i]
                    if (key === "questionText") {
                        q.text = data[key];
                    } else if (key.startsWith("choice",0)) {
                        let ch = key.split('-')
                        const id = parseInt(ch[ch.length-1])
                        if (!isNaN(id)) {
                            let choice = {}//choices.find((c)=>{c.id == id})
                            let found = false
                            for (var k = 0; k < choices.length; k++) {
                                if (choices[k].id == id) {
                                    choice = choices[k]
                                    choice.key = key
                                    found = true
                                    break
                                }
                            }
                            if (!found) {
                                choice = {
                                    id: id,
                                    key: key
                                }
                                choices.push(choice)
                            }
                            switch(ch[1]) {
                                case "text": 
                                    choice.text = data[key]
                                    break
                                case "correct":
                                    choice.isCorrect = true
                                    break
                            }
                        }
                    }
                }
                let resData = {}
                q.choices = choices
                let config = {}
                for (let k = 0; k < choices.length; k++) {
                    resData[choices[k].id.toString()] = 0
                    config[choices[k].id.toString()] = {
                        "label":choices[k].text,
                        "color":colors[k%6]
                    }
                }
                q.config = config

                for (let i = 0; i < responseData.length; i++) {
                    const res = JSON.parse(responseData[i].response)
                    const rd = Object.keys(res)[0].split("-")
                    const qid = rd[rd.length-1]
                    if (parseInt(qid) === q.id) {
                        const cid = rd[rd.length-2]
                        resData[cid] = resData[cid] + 1
                    }
                }
                
                var pieChartData = []
                const entries = Object.entries(resData)
                for (let i = 0; i < entries.length; i++) {
                    var qrd = {}
                    qrd["key"] = entries[i][0].toString()
                    qrd["value"] = entries[i][1]
                    qrd["fill"] = colors[i%6]
                    pieChartData.push(qrd)
                }
                q.pieChartData = pieChartData
                console.log(q)
                console.log()
            }
            questionData.push(q)
        }
        setQuestionData(questionData)
    }

    const colors = [
        "#FF0000",
        "#00FF00",
        "#0000FF",
        "#FFFF00",
        "#00FFFF",
        "#C0C0C0",
    ]

    return(
        <div>
            {isLoading?<p>Loading responses...</p>: (
            <div>
                <Navbar activeTab={0}/>
                <b className="py-8 px-4">{quiz.name}</b>
                <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
                    <Card className="@container/card">
                        <CardHeader className="relative">
                        <CardDescription>Total Responses</CardDescription>
                        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                            {responses.length}
                        </CardTitle>
                        <div className="absolute right-4 top-4">
                        </div>
                        </CardHeader>
                        <CardFooter className="flex-col items-start gap-1 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            </div>
                        </CardFooter>
                    </Card>
                    {questionData.map((q) => {
                        return (
                            <div key={q.id}>
                                {q.type === 1? (<PieChart name={q.text} config={q.config} data={q.pieChartData}></PieChart>):
                                (<div>{q.type === 0?(<p></p>): (<p>Not Implemented</p>)}</div>)}
                            </div>
                        )
                    })}
                </div>
            </div>)}
        </div>
    )
}