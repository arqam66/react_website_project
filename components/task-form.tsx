"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useTaskContext } from "./task-context"

export default function TaskForm() {
  const [text, setText] = useState("")
  const { dispatch } = useTaskContext()
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus the input field when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (text.trim()) {
      dispatch({ type: "ADD_TASK", payload: { text: text.trim() } })
      setText("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add
      </button>
    </form>
  )
}
