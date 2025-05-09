"use client"

import { useEffect, useState, useTransition } from "react";
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { createUser } from "@/lib/actions"
import Dropdown from "@/components/ui/dropdown"
import QuestionType from "./questionType";

interface QuestionFormProps {
    saveData: (id:number, fd: FormData) => void,
    id: number,
    send: boolean,
    defaultValues: {}
}

export default function QuestionForm({saveData, id, send, defaultValues}: QuestionFormProps) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [questionType, setQuestionType] = useState(0)
    const [questionText, setQuestionText] = useState("")

    useEffect(()=>{
        if (send) {
            const form = document.getElementById("form"+id)
            if (form) {
                form.requestSubmit()
            }
        }
    },[send])

    useEffect(()=>{
        const keys = Object.keys(defaultValues)
        for(let i = 0; i < keys.length; i++ ) {
            const key = keys[i]
            if (key == "questionTypeDropdown") {
                setQuestionType(parseInt(defaultValues[key]))
            } else if (key == "questionText") {
                setQuestionText(defaultValues[key])
            }
        }
    },[defaultValues])

    const typeChange = (e) => {
        setQuestionType(parseInt(e.target.value))
    }

    const onSumbit = (fd: FormData) => {
        saveData(id, fd)
    }

    return (
<div className="flex min-h-full flex-col justify-center px-4 py-4 lg:px-4">
  <div className="sm:mx-auto sm:w-full sm:max-w-lg">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            </div>
            <form id={"form"+id} className="space-y-6" action={onSumbit}>
                <Dropdown defaultValue={questionType} id="questionTypeDropdown" title="Question Type" onChange={typeChange}
                    options={[{
                        value: "0",
                        text: "Short Response"
                    },
                    {
                        value: "1",
                        text: "Multiple Choice"
                    }]}></Dropdown>
            <div>
                <label htmlFor="questionText" className="block text-sm/6 font-medium text-gray-900">
                    Question Text
                </label>
                <div className="mt-2">
                    <input defaultValue={questionText} id="questionText" name="questionText" type="text" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"></input>
                </div>
            </div>
            <hr></hr>
            <QuestionType defaultValues={defaultValues} questionType={questionType}></QuestionType>
        </form>
        </div>
    </div>
  );
}

export const dynamic = "force-dynamic";