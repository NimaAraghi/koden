import { X } from "lucide-react";
import React, { useState } from "react";

export function TagsInput({
  value,
  onChange,
  placeholder = "Add tags...",
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !input && value.length) {
      onChange(value.slice(0, -1));
    } else if (value.length >= 4) {
      e.preventDefault();
      return;
    } else if ((e.key === "," || e.key === " ") && input.trim()) {
      e.preventDefault();
      const newTag = input.trim();
      if (!value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInput("");
    }
  }

  function removeTag(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div className='flex flex-wrap items-center gap-2 rounded'>
      {value.map((tag, idx) => (
        <span
          key={tag + idx}
          className='bg-gray-200 px-2 py-0.5 rounded flex items-center gap-1'
        >
          # {tag}
          <button
            type='button'
            className='ml-1 cursor-pointer hover:text-red-500'
            onClick={() => removeTag(idx)}
            aria-label='Remove tag'
          >
            <X />
          </button>
        </span>
      ))}
      <input
        className='flex-1 border-none outline-none min-w-[100px]'
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      {value.length >= 4 && (
        <p className='text-xs text-gray-500'>only 4 selections allowed</p>
      )}
    </div>
  );
}
