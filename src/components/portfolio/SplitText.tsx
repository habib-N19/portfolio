import React from 'react'

interface SplitTextProps {
  text: string
  className?: string
  charClassName?: string
}

export const SplitText = React.forwardRef<HTMLDivElement, SplitTextProps>(
  ({ text, className, charClassName }, ref) => {
    // Split text by words, then by characters, preserving spaces
    const words = text.split(' ')

    return (
      <div ref={ref} className={`inline-block ${className || ''}`}>
        {words.map((word, wordIndex) => (
          <span
            key={`word-${wordIndex}`}
            className="inline-block whitespace-nowrap"
            style={{ marginRight: wordIndex !== words.length - 1 ? '0.25em' : '0' }}
          >
            {word.split('').map((char, charIndex) => (
              <span
                key={`char-${wordIndex}-${charIndex}`}
                className={`inline-block split-char ${charClassName || ''}`}
              >
                {char}
              </span>
            ))}
          </span>
        ))}
      </div>
    )
  }
)

SplitText.displayName = 'SplitText'
