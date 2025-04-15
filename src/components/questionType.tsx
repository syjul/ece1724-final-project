import { useState } from "react"
import { Button } from "@/components/ui/button"

interface QuestionProps {
    questionType: number
}


export default function QuestionType({questionType} : QuestionProps) {
    let [choices,setChoices] = useState<choice[]>([])

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
            questionType === 0? // True/False - allow correctness?
            (
                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor={"choice-correct"} className="block text-sm/6 font-medium text-gray-900">
                            Correct
                        </label>
                    </div>
                    <div className="mt-2">
                        <input id={"choice-correct"} name={"choice-correct"} type="checkbox" className="" ></input>
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