import { Field } from "formik";

interface InputProps {
    label: string;
    id: string;
    placeholder: string;
    
}

const Input: React.FC<InputProps> = ({label, id, placeholder}) => {
    return (
        <div>
            <label htmlFor={id}> {label} </label>
            <Field id={id} name={id} placeholder={placeholder} className="font-mono text-black" />
        </div>
    )
}

export default Input;