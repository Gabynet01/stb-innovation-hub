import React, { useState, useRef, useEffect } from 'react';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    height?: number;
    className?: string;
    disabled?: boolean;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
    value,
    onChange,
    placeholder = 'Enter markdown content...',
    height = 200,
    className = '',
    disabled = false
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.max(height, textarea.scrollHeight)}px`;
        }
    }, [value, height]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Handle Tab key for indentation
        if (e.key === 'Tab') {
            e.preventDefault();
            const textarea = e.currentTarget;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newValue = value.substring(0, start) + '  ' + value.substring(end);
            onChange(newValue);

            // Set cursor position after the inserted spaces
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 2;
            }, 0);
        }
    };

    const insertMarkdown = (before: string, after: string = '', placeholder: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const replacement = before + (selectedText || placeholder) + after;

        const newValue = value.substring(0, start) + replacement + value.substring(end);
        onChange(newValue);

        // Set cursor position
        setTimeout(() => {
            const newCursorPos = start + before.length + (selectedText ? selectedText.length : placeholder.length);
            textarea.selectionStart = textarea.selectionEnd = newCursorPos;
            textarea.focus();
        }, 0);
    };

    const markdownButtons = [
        { label: 'Bold', action: () => insertMarkdown('**', '**', 'bold text') },
        { label: 'Italic', action: () => insertMarkdown('*', '*', 'italic text') },
        { label: 'Code', action: () => insertMarkdown('`', '`', 'code') },
        { label: 'Link', action: () => insertMarkdown('[', '](url)', 'link text') },
        { label: 'H1', action: () => insertMarkdown('# ', '', 'Heading 1') },
        { label: 'H2', action: () => insertMarkdown('## ', '', 'Heading 2') },
        { label: 'H3', action: () => insertMarkdown('### ', '', 'Heading 3') },
        { label: 'List', action: () => insertMarkdown('- ', '', 'List item') },
        { label: 'Quote', action: () => insertMarkdown('> ', '', 'Quote') },
    ];

    return (
        <div className={`border border-gray-300 rounded-lg overflow-hidden ${className} ${isFocused ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}>
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200">
                {markdownButtons.map((button, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={button.action}
                        disabled={disabled}
                        className="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {button.label}
                    </button>
                ))}
            </div>

            {/* Textarea */}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full p-3 border-0 resize-none focus:outline-none font-mono text-sm leading-relaxed"
                style={{ minHeight: height }}
            />
        </div>
    );
};

export default MarkdownEditor;