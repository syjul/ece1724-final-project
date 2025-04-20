"use client"

import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"

import {v4 as uuidv4} from "uuid"
import Navbar from "@/components/navbar"
import { getQuizResponses, getQuiz, getFile, getComments, postComment } from "@/lib/actions"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Prisma } from "@prisma/client"
import PieChart from "@/components/ui/pieChart"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

export default function ViewQuizAnalysis() {
    const [quizID, setQuizID] = useState(0)
    const [responses,setResponses] = useState<Prisma.Response>([])
    const [sessionIDs, setSessionIDs] = useState([])
    const [questionData, setQuestionData] = useState([])
    const [quiz, setQuiz] = useState<Prisma.Quiz>()
    const [isLoading, setIsLoading] = useState(true)
    const [fullTotal, setFullTotal] = useState(0)
    const [fullSum, setFullSum] = useState(0)
    const [comments, setComments] = useState([])

    const params = useParams<{id: string}>()

    const getResponses = (id:number) => {
        getCommentsFromAPI(id).then(()=>{
            getQuizResponses(id).then((r)=>{
                getQuiz(id).then((q)=>{
                    setResponses(r)
                    setQuiz(q)
                    console.log(r)
                    unravelQuestionData(q, r)
                    setIsLoading(false)

                    let sessIDS = []
                    for (let i = 0; i < r.length; i++) {
                        const idx = sessIDS.find((s)=>{return s[1]===r[i].sessionID})
                        if (!idx) {
                            sessIDS.push([r[i].user.name,r[i].sessionID])
                        }
                    }
                    setSessionIDs(sessIDS)
                })
            })
        })
    }

    const getCommentsFromAPI = async (quizID: number) => {
        const comments = await getComments(quizID)
        setComments(comments)
    }

    const postCommentFromAPI = (fd: FormData) => {
        authClient.getSession().then((sess) =>{
            if (sess.data && !sess.err) {
                const comment = fd.get("comment").toString()
                const commentAdd = {
                    comment: comment,
                    user: {
                        name: sess.data.user.name
                    }
                }
                postComment(quiz.id, comment)
                setComments([...comments,commentAdd])
            }
        })
        
    }

    const downloadFile = (sessID:string) => {
        getFile(sessID).then((d)=>{
            var link = document.createElement('a')  // once we have the file buffer BLOB from the post request we simply need to send a GET request to retrieve the file data
            link.href = window.URL.createObjectURL(new Blob([d]))
            link.download = sessID
            link.click()
            link.remove();  //afterwards we remove the element  
        })
    }

    useEffect(()=>{
        const id = parseInt(params.id)
        setQuizID(id)
        getResponses(id)
    },[])

    const unravelQuestionData = (quiz: Prisma.Quiz, responseData) => {
        let questionData = []
        let totals = 0
        let sums = 0
        for(let i = 0; i < quiz.questions.length; i++) {
            let q = {}
            const question = quiz.questions[i]
            q.id = question.id
            q.type = question.type
            const data = JSON.parse(question.data)
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
                    } else if (ch[ch.length-1] == "correct") {
                        const choice = {
                            isCorrect:true,
                            value:data[key]
                        }
                        choices.push(choice)
                    }
                }
            }
            if (question.type === 1) {
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
                let total = 0
                let sum = 0
                for (let i = 0; i < entries.length; i++) {
                    var qrd = {}
                    qrd["key"] = entries[i][0].toString()
                    qrd["value"] = entries[i][1]
                    qrd["fill"] = colors[i%6]
                    pieChartData.push(qrd)

                    const val = q.choices.find((r)=>{return r.key.split("-")[2] === entries[i][0].toString()})
                    if (val) {
                        total += entries[i][1]
                        if (val.isCorrect) {
                            sum += entries[i][1]
                        }
                    }
                }
                q.total = total
                q.sum = sum
                q.pieChartData = pieChartData
                totals += total
                sums += sum
            } else if (question.type === 0) {
                let responses = []
                let total = 0
                let sum = 0
                let correctRes = ""
                if (choices.length >= 1) {
                    correctRes = choices[0].value
                }
                for (let i = 0; i < responseData.length; i++) {
                    const res = JSON.parse(responseData[i].response)
                    const rd = Object.keys(res)[0].split("-")
                    const qid = rd[rd.length-1]
                    if (parseInt(qid) === q.id) {
                        const uid = responseData[i].user.name
                        responses.push([uid, Object.values(res)[0]])
                        if (correctRes != "") {
                            total += 1
                            if (correctRes == Object.values(res)[0]) {
                                sum += 1
                            }
                        }
                    }
                    q.total = total
                    q.sum = sum
                    totals += total
                    sums += sum
                }
                q.responses = responses
            }
                
            questionData.push(q)
        }
        console.log(questionData)
        setFullTotal(totals)
        setFullSum(sums)
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
                <div>
                <b className="py-8 px-4">{quiz.name}</b>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline">
                            Comments
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div>
                            {comments.map((c)=>{ return (
                                <div key={c.id} className="grid gap-4">
                                    <div className="space-y-4">
                                        <h4 className="font-medium leading-none">{c.comment}</h4>
                                        <p className="text-sm">
                                            {c.user?.name}
                                        </p>
                                    </div>
                                    <hr></hr>
                                </div>
                                )}
                            )}

                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <form action={postCommentFromAPI}>
                                        <input className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" placeholder="Add comment" name="comment" id="comment" key="comment"></input>
                                        <Button>Post</Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
                </div>
                <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
                    <Card className="@container/card">
                        <CardHeader className="relative">
                        <CardDescription>
                            Total Responses
                        </CardDescription>
                        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                            {sessionIDs.length}
                        </CardTitle>
                        <div className="absolute right-4 top-4">
                        </div>
                        </CardHeader>
                        <CardFooter className="flex-col items-start gap-1 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            {fullTotal != 0?"Percent Correct: " + ((fullSum/fullTotal)*100.0).toFixed(2) + "%":""}
                            </div>
                        </CardFooter>
                    </Card>

                    <Table>
                    <TableCaption>Sessions</TableCaption>
                    <TableHeader>
                        <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead className="text-right">Session</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sessionIDs.map((s)=>{return (
                            <TableRow key={s[0]+s[1]}>
                                <TableCell>{s[0]}</TableCell>
                                <TableCell className="text-right"><Button onClick={()=>{downloadFile(s[1])}}>{s[1]}</Button></TableCell>
                            </TableRow>)})}
                    </TableBody>
                    </Table>

                    {questionData.map((q) => {
                        return (
                            <div key={q.id}>
                                {q.type === 1? (<PieChart name={q.text} config={q.config} data={q.pieChartData} footer={q.total != 0?"Percent Correct: "+((q.sum/q.total)*100.0).toFixed(2)+"%":""}></PieChart>):
                                (<div>
                                    {q.type === 0?(
                                    <Card className="flex flex-col">
                                        <CardHeader className="items-center pb-0">
                                            <CardTitle>{q.text}</CardTitle>
                                        </CardHeader>
                                        <Table>
                                            <TableCaption>{q.total != 0?"Percent Correct: "+((q.sum/q.total)*100.0).toFixed(2)+"%":""}</TableCaption>
                                            <TableHeader>
                                                <TableRow>
                                                <TableHead>User</TableHead>
                                                <TableHead className="text-right">Response</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {q.responses.map((r)=>{return (
                                                    <TableRow key={uuidv4()}>
                                                        <TableCell>{r[0]}</TableCell>
                                                        <TableCell className="text-right">{r[1]}</TableCell>
                                                    </TableRow>)})}
                                            </TableBody>
                                        </Table>
                                    </Card>)
                                : (<p>Not Implemented</p>)}</div>)}
                                </div>)
                            }
                        )
                    }
                </div>
            </div>)}
        </div>
    )
}