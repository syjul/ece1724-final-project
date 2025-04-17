import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface QuestionProps {
    questionType: number,
    defaultValues: {}
}


export default function QuestionType({questionType, defaultValues} : QuestionProps) {
    let [choices,setChoices] = useState<choice[]>([])

    useEffect(()=>{
        const keys = Object.keys(defaultValues)
        for(let i = 0; i < keys.length; i++ ) {
            const key = keys[i]
            if (key.startsWith("choice",0)) {
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
                            choice.text = defaultValues[key]
                            break
                        case "correct":
                            choice.isCorrect = true
                            break
                    }
                }
            }
            /*
            const ele = document.getElementById(key)
            if (ele) {
                ele.value = defaultValues[key]
            }*/
        }
        setChoices(choices)
    },[defaultValues])

    interface choice {
        id: number
        text: string
        data: string
        isCorrect: boolean
    }

    const addChoice = () => {
        let id = 0
        if (choices.length > 0) {
            id = choices[choices.length-1]["id"] + 1
        }
        
        const data:choice = {
            id: id,
            text: "",
            isCorrect: false,
            data: ""
        }
        choices.push(data)
        setChoices([...choices])
    }

    const removeChoice = (id:number) => {
        let idx = choices.findIndex((choice)=> {return choice.id === id})
        if (idx >= 0) {
            choices.splice(idx,1)
            setChoices([...choices])
        }
    }

    return (
        <div>
        {
            questionType === 0? // Short answer
            (
                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor={"choice-correct"} className="block text-sm/6 font-medium text-gray-900">
                            Correct Text 
                        </label>
                    </div>
                    <div className="mt-2">
                        <input placeholder="Leave empty for none" id={"choice-correct"} name={"choice-correct"} type="text" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" ></input>
                    </div>
                </div>
            )
            : questionType === 1? // Multiple Choice
            (
                <div>
                <Button type="button" onClick={()=>{addChoice()}}>Add new choice</Button>
                {
                    choices.map((choice) => {return (
                        <div key={choice.id}>
                            <label htmlFor={"choice-text-"+choice.id} className="block text-sm/6 font-medium text-gray-900">
                                Choice Text
                            </label>
                            <div className="mt-2">
                                <input defaultValue={choice.text} id={"choice-text-"+choice.id} name={"choice-text-"+choice.id} type="text" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"></input>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor={"choice-correct-"+choice.id} className="block text-sm/6 font-medium text-gray-900">
                                        Is correct?
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input defaultValue={choice.isCorrect?'on':'off'} id={"choice-correct-"+choice.id} name={"choice-correct-"+choice.id} type="checkbox" className="" ></input>
                                </div>
                            </div>
                            <Button type="button" onClick={()=>{removeChoice(choice.id)}}>Remove choice</Button>
                            <hr></hr>
                        </div>
                        )
                    })
                }
                </div>
            ):(<></>)
            
        }
        </div>
    )
}