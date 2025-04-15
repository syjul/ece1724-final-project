import { useState } from "react"

interface DropdownProps {
    title: string,
    options: Option[],
    onChange: (e)=>void,
    id: string
}

interface Option {
    value: string,
    text: string
}


export default function Dropdown({title, options, onChange, id} : DropdownProps) {
    let [value,setValue] = useState("")
    
    const typeChange = (e) => {
        onChange(e)
        setValue(e.target.value)
    }
    
    return (
        <div>
            <label htmlFor={id} className="block text-sm/6 font-medium text-gray-900">
                {title}
            </label>
            <div className="mt-2">
                <select value={value} onChange={typeChange} id={id} name={id} key={id} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                    {options.map((o)=>{
                        return (<option key={o.value} value={o.value}>{o.text}</option>)
                    })}
                </select>
            </div>
        </div>
    )
}