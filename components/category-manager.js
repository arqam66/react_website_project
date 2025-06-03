"use client"

import { useState, useRef, useEffect } from "react"
import { useTaskContext } from "./task-context"
import { Plus, Edit2, Trash2, X, Save } from "lucide-react"

export default function CategoryManager() {
  const { state, dispatch } = useTaskContext()
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState("#3b82f6") // Default blue
  const [editCategoryName, setEditCategoryName] = useState("")
  const [editCategoryColor, setEditCategoryColor] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const inputRef = useRef(null)
  const editInputRef = useRef(null)

  // Focus input when showing add form
  useEffect(() => {
    if (showAddForm && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showAddForm])

  // Focus input when editing a category
  useEffect(() => {
    if (state.editingCategoryId && editInputRef.current) {
      const category = state.categories.find((c) => c.id === state.editingCategoryId)
      if (category) {
        setEditCategoryName(category.name)
        setEditCategoryColor(category.color)
        editInputRef.current.focus()
      }
    }
  }, [state.editingCategoryId, state.categories])

  const handleAddCategory = (e) => {
    e.preventDefault()
    if (newCategoryName.trim()) {
      dispatch({
        type: "ADD_CATEGORY",
        payload: {
          name: newCategoryName.trim(),
          color: newCategoryColor,
        },
      })
      setNewCategoryName("")
      setNewCategoryColor("#3b82f6")
      setShowAddForm(false)
    }
  }

  const handleUpdateCategory = (e, id) => {
    e.preventDefault()
    if (editCategoryName.trim()) {
      dispatch({
        type: "UPDATE_CATEGORY",
        payload: {
          id,
          name: editCategoryName.trim(),
          color: editCategoryColor,
        },
      })
    }
  }

  const startEditCategory = (id) => {
    dispatch({ type: "SET_EDITING_CATEGORY", payload: { id } })
  }

  const cancelEdit = () => {
    dispatch({ type: "CANCEL_EDIT" })
  }

  const deleteCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this category? Tasks will be set to 'No Category'.")) {
      dispatch({ type: "DELETE_CATEGORY", payload: { id } })
    }
  }

  // Predefined colors
  const colorOptions = [
    "#ef4444", // red
    "#f97316", // orange
    "#f59e0b", // amber
    "#84cc16", // lime
    "#10b981", // green
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#d946ef", // fuchsia
    "#ec4899", // pink
    "#6b7280", // gray
  ]

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Categories</h2>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Category
            </button>
          )}
        </div>

        {showAddForm && (
          <form onSubmit={handleAddCategory} className="mb-4 p-3 bg-gray-50 rounded-md">
            <div className="flex items-center mb-2">
              <input
                ref={inputRef}
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
                className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">Color</label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewCategoryColor(color)}
                    className={`w-6 h-6 rounded-full ${
                      newCategoryColor === color ? "ring-2 ring-offset-2 ring-blue-500" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  ></button>
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {state.categories.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No categories yet. Add some categories to organize your tasks!</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {state.categories.map((category) => (
              <li key={category.id} className="py-2">
                {state.editingCategoryId === category.id ? (
                  <form onSubmit={(e) => handleUpdateCategory(e, category.id)} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex space-x-1">
                        <button
                          type="submit"
                          className="p-1 text-green-500 hover:text-green-700 focus:outline-none"
                          aria-label="Save"
                        >
                          <Save className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="p-1 text-red-500 hover:text-red-700 focus:outline-none"
                          aria-label="Cancel"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-wrap gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setEditCategoryColor(color)}
                            className={`w-6 h-6 rounded-full ${
                              editCategoryColor === color ? "ring-2 ring-offset-2 ring-blue-500" : ""
                            }`}
                            style={{ backgroundColor: color }}
                            aria-label={`Select color ${color}`}
                          ></button>
                        ))}
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                      <span>{category.name}</span>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => startEditCategory(category.id)}
                        className="p-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                        aria-label="Edit category"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="p-1 text-red-500 hover:text-red-700 focus:outline-none"
                        aria-label="Delete category"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
