"use client"

import React, { useEffect, useState } from "react"

interface ShuffleTextProps {
    text: string
    className?: string
    speed?: number
    maxIterations?: number
    characters?: string
}

const ShuffleText: React.FC<ShuffleTextProps> = ({
    text,
    className = "",
    speed = 50,
    maxIterations = 8,
    characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
}) => {
    const [displayText, setDisplayText] = useState(text)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        if (!isHovered) {
            setDisplayText(text)
            return
        }

        let iterations = 0
        const interval = setInterval(() => {
            setDisplayText(() =>
                text
                    .split("")
                    .map((char, i) => {
                        if (char === " ") return " "
                        if (iterations > i + maxIterations) return text[i]
                        return characters[Math.floor(Math.random() * characters.length)]
                    })
                    .join("")
            )

            iterations += 0.5
            if (iterations > text.length + maxIterations) {
                clearInterval(interval)
                setDisplayText(text)
            }
        }, speed)

        return () => clearInterval(interval)
    }, [isHovered, text, speed, maxIterations, characters])

    return (
        <span
            className={`inline-block cursor-default ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {displayText}
        </span>
    )
}

export default ShuffleText;
