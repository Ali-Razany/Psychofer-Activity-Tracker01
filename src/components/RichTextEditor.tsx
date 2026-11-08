import React, { useRef, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder = 'لێرە بنووسە...' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Sync external value changes if editor is empty or not focused
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML && !isFocused) {
      editorRef.current.innerHTML = value;
    }
  }, [value, isFocused]);

  const execCommand = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    editorRef.current?.focus();
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const ToolbarButton = ({ 
    icon, 
    onClick, 
    title,
    isActive = false
  }: { 
    icon: string; 
    onClick: () => void; 
    title: string;
    isActive?: boolean;
  }) => (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={`p-1.5 sm:p-2 flex items-center justify-center rounded hover:bg-surface-bg transition-colors ${
        isActive ? 'bg-primary/10 text-primary' : 'text-neutral-600'
      }`}
    >
      <Icon icon={icon} width={18} />
    </button>
  );

  return (
    <div className={`border rounded-xl overflow-hidden bg-white transition-colors ${isFocused ? 'border-primary ring-1 ring-primary' : 'border-surface-border'}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-surface-paper border-b border-surface-border" dir="rtl">
        <div className="flex items-center gap-1 border-l border-surface-border pl-2 ml-1">
          <ToolbarButton icon="hugeicons:text-bold" onClick={() => execCommand('bold')} title="تۆخ" />
          <ToolbarButton icon="hugeicons:text-italic" onClick={() => execCommand('italic')} title="لاری" />
          <ToolbarButton icon="hugeicons:text-underline" onClick={() => execCommand('underline')} title="هێڵی ژێرەوە" />
          <ToolbarButton icon="hugeicons:text-strikethrough" onClick={() => execCommand('strikeThrough')} title="هێڵی ناوەڕاست" />
        </div>
        
        <div className="flex items-center gap-1 border-l border-surface-border pl-2 ml-1">
          <ToolbarButton icon="hugeicons:align-right" onClick={() => execCommand('justifyRight')} title="ڕاست" />
          <ToolbarButton icon="hugeicons:align-horizontal-center" onClick={() => execCommand('justifyCenter')} title="ناوەڕاست" />
          <ToolbarButton icon="hugeicons:align-left" onClick={() => execCommand('justifyLeft')} title="چەپ" />
          <ToolbarButton icon="hugeicons:align-box-bottom-center" onClick={() => execCommand('justifyFull')} title="ڕێککردن" />
        </div>
        
        <div className="flex items-center gap-1 border-l border-surface-border pl-2 ml-1">
          <ToolbarButton icon="hugeicons:list-view" onClick={() => execCommand('insertUnorderedList')} title="لیستە" />
          <ToolbarButton icon="hugeicons:list-number" onClick={() => execCommand('insertOrderedList')} title="لیستەی ژمارەیی" />
        </div>
        
        <div className="flex items-center gap-1">
          <ToolbarButton icon="hugeicons:quote-up" onClick={() => execCommand('formatBlock', 'blockquote')} title="وتە" />
          <ToolbarButton icon="hugeicons:link-01" onClick={() => {
            const url = prompt('بەستەر بنووسە:');
            if (url) execCommand('createLink', url);
          }} title="بەستەر" />
          <ToolbarButton icon="hugeicons:image-01" onClick={() => {
            const url = prompt('بەستەری وێنە بنووسە:');
            if (url) execCommand('insertImage', url);
          }} title="وێنە" />
          <ToolbarButton icon="hugeicons:eraser" onClick={() => execCommand('removeFormat')} title="سڕینەوەی شێواز" />
        </div>
      </div>
      
      {/* Editor Area */}
      <div 
        className="relative"
        onClick={() => {
          if (editorRef.current) editorRef.current.focus();
        }}
      >
        {!value && !isFocused && (
          <div className="absolute top-4 right-4 text-neutral-400 pointer-events-none z-0">
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          dir="rtl"
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="min-h-[300px] max-h-[500px] overflow-y-auto p-4 focus:outline-none prose prose-sm md:prose-base max-w-none text-neutral-800 z-10 relative"
          style={{ whiteSpace: 'pre-wrap' }}
        />
      </div>
    </div>
  );
}
