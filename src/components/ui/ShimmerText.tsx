"use client"

import { motion } from "framer-motion"
import React from "react"

interface ShimmerTextProps {
    text: string
    className?: string
    shimmerColor?: string
    duration?: number
    delay?: number
}

const ShimmerText: React.FC<ShimmerTextProps> = ({
    text,
    className = "",
    shimmerColor = "#3b82f6",
    duration = 2,
    delay = 0.1,
}) => {
    const characters = text.split("")

    return (
        <span className={`inline-block ${className}`}>
            {characters.map((char, i) => (
                <motion.span
                    key={i}
                    animate={{
                        color: [null, shimmerColor, null],
                        opacity: [1, 0.5, 1],
                    }}
                    transition={{
                        duration: duration,
                        repeat: Infinity,
                        delay: i * delay,
                        ease: "easeInOut",
                    }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </span>
    )
}

export default ShimmerText;
