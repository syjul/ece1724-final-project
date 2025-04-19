import { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";

interface TakeQuestionProps {
    question: Prisma.Question
}

interface choice {
    id: number
    text: string
    data: string
    isCorrect: boolean
}

export default function TakeQuestion({question}:TakeQuestionProps) {
    const [loading, setLoading] = useState(true)
    const [choices, setChoices] = useState<choice[]>([])
    const [text, setText] = useState("")

    useEffect(()=>{
        if (question) {
            const data = JSON.parse(question.data)
            
            const keys = Object.keys(data)
            for(let i = 0; i < keys.length; i++ ) {
                const key = keys[i]
                if (key === "questionText") {
                    setText(data[key])
                } else if (key.startsWith("choice",0)) {
                    let ch = key.split('-')
                    const id = parseInt(ch[ch.length-1])
                    if (!isNaN(id)) {
                        let choice = {}//choices.find((c)=>{c.id == id})
                        let found = false
                        for (var k = 0; k < choices.length; k++) {
                            if (choices[k].id == id) {
                                choice = choices[k]
                                found = true
                                break
                            }
                        }
                        if (!found) {
                            choice = {
                                id: id
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
            setChoices(choices)
            
            setLoading(false)
        }
    },[question])

    return (
        <div>
            {loading?<p>Loading question..</p>:(
                <div>
                    <b>{text}</b>
                {question.type === 0? (
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor={"choice-response-"+question.id} className="block text-sm/6 font-medium text-gray-900">
                                {question.text}
                            </label>
                        </div>
                        <div className="mt-2">
                            <input id={"choice-response-"+question.id} name={"choice-response-"+question.id} type="text" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" ></input>
                        </div>
                    </div>):(
                        <div>
                        {question.type === 1? (
                            <div>
                                {
                                    choices.map((choice) => {return (
                                        <div key={choice.id}>
                                            <label htmlFor={"choice-text-"+choice.id+"-"+question.id} className="block text-sm/6 font-medium text-gray-900">
                                                {choice.text}
                                            </label>
                
                                            <div>
                                                <div className="mt-2">
                                                    <input defaultValue='off' id={"choice-correct-"+choice.id+"-"+question.id} name={"choice-correct-"+choice.id+"-"+question.id} type="checkbox" className="" ></input>
                                                </div>
                                            </div>
                                        </div>
                                        )
                                    })
                                }
                            </div>
                        ):<></>}
                        </div>
                        )}
                        <hr className="py-2"></hr>
                </div>
                )
            }
        </div>
    )
}