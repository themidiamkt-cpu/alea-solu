import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

interface EditableTextProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    multiline?: boolean;
    placeholder?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
    value,
    onChange,
    className,
    multiline = false,
    placeholder
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    useEffect(() => {
        if (isEditing) {
            if (multiline && textareaRef.current) {
                textareaRef.current.focus();
                // Adjust height
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
            } else if (!multiline && inputRef.current) {
                inputRef.current.focus();
            }
        }
    }, [isEditing, multiline]);

    const handleBlur = () => {
        setIsEditing(false);
        onChange(localValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !multiline) {
            handleBlur();
        }
    };

    if (isEditing) {
        if (multiline) {
            return (
                <textarea
                    ref={textareaRef}
                    value={localValue}
                    onChange={(e) => {
                        setLocalValue(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    onBlur={handleBlur}
                    className={cn(
                        "w-full bg-white border-2 border-accent-gold/50 rounded outline-none resize-none overflow-hidden p-2 text-gray-900",
                        className
                    )}
                    placeholder={placeholder}
                    rows={1}
                />
            );
        }
        return (
            <input
                ref={inputRef}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={cn(
                    "w-full bg-white border-2 border-accent-gold/50 rounded outline-none p-2 text-gray-900",
                    className
                )}
                placeholder={placeholder}
            />
        );
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            className={cn(
                "cursor-pointer hover:outline hover:outline-2 hover:outline-dashed hover:outline-accent-gold/50 rounded hover:bg-accent-gold/5 min-w-[20px] min-h-[20px] p-2 text-gray-900",
                !localValue && "opacity-50 italic",
                className
            )}
            title="Click to edit"
        >
            {localValue || placeholder || "Click to edit"}
        </div>
    );
};
