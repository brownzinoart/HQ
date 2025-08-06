'use client';

import { useState, useRef, useEffect } from 'react';

interface InlineEditProps {
  value: string;
  onSave: (value: string) => void;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  multiline?: boolean;
}

export default function InlineEdit({
  value,
  onSave,
  className = '',
  inputClassName = '',
  placeholder = 'Click to edit',
  multiline = false,
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim() !== value) {
      onSave(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isEditing) {
    return (
      <div
        onClick={() => setIsEditing(true)}
        className={`cursor-pointer hover:bg-slate-50 rounded px-1 -mx-1 ${className}`}
      >
        {value || <span className="text-slate-400">{placeholder}</span>}
      </div>
    );
  }

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <InputComponent
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={inputRef as any}
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
      className={`w-full px-1 py-0 border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white ${
        multiline ? 'resize-none' : ''
      } ${inputClassName}`}
      rows={multiline ? 3 : undefined}
    />
  );
}