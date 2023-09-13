interface ViewElementProps {
    label: string;
    value: string | number;
}

const ViewElement: React.FC<ViewElementProps> = ({ label, value }) => {
    return (
        <div className="flex">
            <div className="">
                {label}:
            </div>
            <div className="ml-2 text-gray-300">
                {value}
            </div>
        </div>
    )
}

export default ViewElement;