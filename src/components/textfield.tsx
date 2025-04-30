import { ChangeEvent } from "react";

interface Props {
  name: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}

export default function Textfield({
  name,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
}: Readonly<Props>) {
  return (
    <div className="inline-block">
      {name}
      <br />
      <input
        className="p-1.5 mr-4 rounded bg-white text-black"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
