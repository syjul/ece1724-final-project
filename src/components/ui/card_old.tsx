interface CardProps {
    title: string,
    content: React.ReactNode
}

export default function Card({title, content} : CardProps) {
    return (
        <div className="crelative flex w-full flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
            <div className="m-8 w-full">
                <p className="text-xl"><b>{title}</b></p>
                <div className="card-actions justify-end">
                {content}
                </div>
            </div>
        </div>
    )
}