"use client"
import { useState } from "react"
import  React from "react"

import { motion } from "framer-motion"


export const CardStack = ({
  items,
  offset,
  scaleFactor,
}) => {
  const CARD_OFFSET = offset || 10
  const SCALE_FACTOR = scaleFactor || 0.06
  const [cards, setCards] = useState(items)

  const moveToNext = () => {
    setCards((prevCards) => {
      const newArray = [...prevCards]
      newArray.unshift(newArray.pop())
      return newArray
    })
  }

  const moveToPrevious = () => {
    setCards((prevCards) => {
      const newArray = [...prevCards]
      newArray.push(newArray.shift())
      return newArray
    })
  }

  return (
    <div className="relative h-60 w-80 md:h-60 md:w-96">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className="absolute overflow-hidden dark:bg-black bg-white h-64 w-80 md:h-60 md:w-96 rounded-3xl p-4 shadow-xl border border-neutral-200 dark:border-white/[0.1] shadow-black/[0.1] dark:shadow-white/[0.05] flex flex-col justify-between cursor-grab active:cursor-grabbing"
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR,
              zIndex: cards.length - index,
            }}
            drag={index === 0 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(event, info) => {
              if (index === 0) {
                if (info.offset.x < -100 || info.velocity.x < -500) {
                  moveToNext()
                } else if (info.offset.x > 100 || info.velocity.x > 500) {
                  moveToPrevious()
                }
              }
            }}
            whileDrag={{
              scale: 1.05,
              rotate: (info) => info.offset.x / 10,
            }}
          >
            <div className="font-normal text-neutral-700 dark:text-neutral-200">{card.content}</div>
            <div>
              <p className="text-neutral-500 font-medium dark:text-white">{card.name}</p>
              <p className="text-neutral-400 font-normal dark:text-neutral-200">{card.designation}</p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
