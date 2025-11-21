'use client'

import { TextareaHTMLAttributes, forwardRef, useState } from 'react'
import { cn } from '@/utils/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  showCharCount?: boolean
  maxLength?: number
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, showCharCount, maxLength, className, id, required, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [charCount, setCharCount] = useState(0)
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length)
      props.onChange?.(e)
    }

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            {label}
            {required && <span className="text-secondary-600 ml-1" aria-label="requis">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          className={cn(
            'w-full px-4 py-2.5 border rounded-lg transition-all duration-250',
            'bg-white text-neutral-900 placeholder:text-neutral-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed',
            'resize-vertical min-h-[100px]',
            error && 'border-secondary-500 focus:ring-secondary-500',
            !error && !isFocused && 'border-neutral-300',
            !error && isFocused && 'border-primary-500',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          {...props}
        />
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex-1">
            {error && (
              <p id={`${textareaId}-error`} className="text-sm text-secondary-600 flex items-center gap-1">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
            {!error && helperText && (
              <p id={`${textareaId}-helper`} className="text-sm text-neutral-500">
                {helperText}
              </p>
            )}
          </div>
          {showCharCount && maxLength && (
            <span className={cn(
              'text-xs',
              charCount > maxLength * 0.9 ? 'text-secondary-600' : 'text-neutral-500'
            )}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
