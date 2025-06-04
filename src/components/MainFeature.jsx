import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import todoService from '../services/api/todoService'
import categoryService from '../services/api/categoryService'

const MainFeature = () => {
  const [todos, setTodos] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [newTodo, setNewTodo] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('medium')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [dueDate, setDueDate] = useState('')
  
  const [filter, setFilter] = useState('all')
  const [searchText, setSearchText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [todosResult, categoriesResult] = await Promise.all([
          todoService.getAll(),
          categoryService.getAll()
        ])
        setTodos(todosResult || [])
        setCategories(categoriesResult || [])
      } catch (err) {
        setError(err.message)
        toast.error('Failed to load tasks')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Filter todos
  const filteredTodos = todos.filter(todo => {
    if (!todo) return false
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && !todo.completed) || 
      (filter === 'completed' && todo.completed)
    
    const matchesSearch = !searchText || 
      (todo.text && todo.text.toLowerCase().includes(searchText.toLowerCase()))
    
    return matchesFilter && matchesSearch
  })

  // Stats
  const totalTodos = todos.length
  const completedTodos = todos.filter(todo => todo?.completed).length
  const activeTodos = totalTodos - completedTodos
  const completionPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0

  // Add todo
  const handleAddTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    const todoData = {
      text: newTodo.trim(),
      priority: selectedPriority,
      category: selectedCategory || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      completed: false
    }

    try {
      const created = await todoService.create(todoData)
      setTodos(prev => [created, ...prev])
      setNewTodo('')
      setDueDate('')
      toast.success('Task created successfully!')
    } catch (err) {
      toast.error('Failed to create task')
    }
  }

  // Toggle completion
  const handleToggleComplete = async (id) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    try {
      const updated = await todoService.update(id, { completed: !todo.completed })
      setTodos(prev => prev.map(t => t.id === id ? updated : t))
      toast.success(updated.completed ? 'Task completed!' : 'Task reopened')
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  // Delete todo
  const handleDelete = async (id) => {
    try {
      await todoService.delete(id)
      setTodos(prev => prev.filter(t => t.id !== id))
      toast.success('Task deleted')
    } catch (err) {
      toast.error('Failed to delete task')
    }
  }

  // Edit todo
  const startEdit = (todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = async () => {
    if (!editText.trim()) {
      setEditingId(null)
      return
    }

    try {
      const updated = await todoService.update(editingId, { text: editText.trim() })
      setTodos(prev => prev.map(t => t.id === editingId ? updated : t))
      setEditingId(null)
      toast.success('Task updated!')
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  // Drag and drop
  const handleDragEnd = async (result) => {
    if (!result.destination) return

    const items = Array.from(filteredTodos)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order in state
    const newTodos = [...todos]
    items.forEach((item, index) => {
      const todoIndex = newTodos.findIndex(t => t.id === item.id)
      if (todoIndex !== -1) {
        newTodos[todoIndex] = { ...newTodos[todoIndex], order: index }
      }
    })
    setTodos(newTodos)
  }

  // Priority colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
      case 'low': return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400'
    }
  }

  // Category color
  const getCategoryColor = (categoryName) => {
    const category = categories.find(c => c.name === categoryName)
    return category?.color || '#64748b'
  }

  // Due date status
  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return null
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return { status: 'overdue', text: 'Overdue', class: 'text-red-600 dark:text-red-400' }
    if (diffDays === 0) return { status: 'today', text: 'Today', class: 'text-amber-600 dark:text-amber-400' }
    if (diffDays === 1) return { status: 'tomorrow', text: 'Tomorrow', class: 'text-blue-600 dark:text-blue-400' }
    return { status: 'future', text: `${diffDays} days`, class: 'text-surface-600 dark:text-surface-400' }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-surface-200 dark:bg-surface-700 rounded-xl"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-surface-200 dark:bg-surface-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card overflow-hidden">
      {/* Stats Header */}
      <div className="p-6 border-b border-surface-200 dark:border-surface-700 bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
              Your Tasks
            </h3>
            <p className="text-surface-600 dark:text-surface-400">
              {activeTodos} active, {completedTodos} completed
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                {completionPercentage}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Todo Form */}
      <div className="p-6 border-b border-surface-200 dark:border-surface-700">
        <form onSubmit={handleAddTodo} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-surface-900 dark:text-surface-100 placeholder-surface-500"
              />
            </div>
            
            <button
              type="submit"
              disabled={!newTodo.trim()}
              className="px-6 py-3 btn-gradient text-white rounded-xl font-medium hover:shadow-elevated disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus-ring flex items-center justify-center space-x-2"
            >
              <ApperIcon name="Plus" className="w-5 h-5" />
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-surface-900 dark:text-surface-100"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-surface-900 dark:text-surface-100"
            >
              <option value="">No Category</option>
              {categories.map(category => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="px-3 py-2 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-surface-900 dark:text-surface-100"
            />
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-surface-200 dark:border-surface-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex rounded-lg bg-surface-100 dark:bg-surface-900 p-1">
            {['all', 'active', 'completed'].map(filterType => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 capitalize ${
                  filter === filterType
                    ? 'bg-white dark:bg-surface-800 text-primary shadow-sm'
                    : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100'
                }`}
              >
                {filterType}
              </button>
            ))}
          </div>
          
          <div className="flex-1 relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-surface-900 dark:text-surface-100 placeholder-surface-500"
            />
          </div>
        </div>
      </div>

      {/* Todo List */}
      <div className="p-6">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-surface-100 dark:bg-surface-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="ListTodo" className="w-8 h-8 text-surface-400" />
            </div>
            <h3 className="text-lg font-medium text-surface-900 dark:text-surface-100 mb-2">
              {filter === 'completed' ? 'No completed tasks' : 
               filter === 'active' ? 'No active tasks' : 'No tasks yet'}
            </h3>
            <p className="text-surface-500 dark:text-surface-400">
              {filter === 'all' ? 'Add your first task to get started!' : 
               searchText ? 'Try adjusting your search.' : 'Great job staying organized!'}
            </p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="todos">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  <AnimatePresence>
                    {filteredTodos.map((todo, index) => {
                      if (!todo) return null
                      
                      const dueDateInfo = getDueDateStatus(todo.dueDate)
                      
                      return (
                        <Draggable key={todo.id} draggableId={todo.id} index={index}>
                          {(provided, snapshot) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -100 }}
                              className={`group flex items-center gap-4 p-4 bg-surface-50 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 hover:shadow-card transition-all duration-200 ${
                                snapshot.isDragging ? 'shadow-elevated transform rotate-1' : ''
                              } ${todo.completed ? 'opacity-60' : ''}`}
                            >
                              <div {...provided.dragHandleProps} className="drag-handle p-1">
                                <ApperIcon name="GripVertical" className="w-4 h-4 text-surface-400" />
                              </div>
                              
                              <button
                                onClick={() => handleToggleComplete(todo.id)}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                  todo.completed
                                    ? 'bg-secondary border-secondary'
                                    : 'border-surface-300 dark:border-surface-600 hover:border-secondary'
                                }`}
                              >
                                {todo.completed && (
                                  <ApperIcon name="Check" className="w-4 h-4 text-white animate-check" />
                                )}
                              </button>
                              
                              <div className="flex-1 min-w-0">
                                {editingId === todo.id ? (
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={editText}
                                      onChange={(e) => setEditText(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') saveEdit()
                                        if (e.key === 'Escape') cancelEdit()
                                      }}
                                      onBlur={saveEdit}
                                      autoFocus
                                      className="flex-1 px-2 py-1 bg-white dark:bg-surface-800 border border-primary rounded focus:outline-none text-surface-900 dark:text-surface-100"
                                    />
                                  </div>
                                ) : (
                                  <div>
                                    <p 
                                      className={`text-surface-900 dark:text-surface-100 ${
                                        todo.completed ? 'line-through' : ''
                                      }`}
                                      onDoubleClick={() => startEdit(todo)}
                                    >
                                      {todo.text}
                                    </p>
                                    
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                                        {todo.priority}
                                      </span>
                                      
                                      {todo.category && (
                                        <span 
                                          className="px-2 py-1 rounded-full text-xs font-medium text-white"
                                          style={{ backgroundColor: getCategoryColor(todo.category) }}
                                        >
                                          {todo.category}
                                        </span>
                                      )}
                                      
                                      {dueDateInfo && (
                                        <span className={`text-xs ${dueDateInfo.class}`}>
                                          {dueDateInfo.text}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                  onClick={() => startEdit(todo)}
                                  className="p-2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors duration-200"
                                >
                                  <ApperIcon name="Edit2" className="w-4 h-4" />
                                </button>
                                
                                <button
                                  onClick={() => handleDelete(todo.id)}
                                  className="p-2 text-surface-400 hover:text-red-500 transition-colors duration-200"
                                >
                                  <ApperIcon name="Trash2" className="w-4 h-4" />
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </Draggable>
                      )
                    })}
                  </AnimatePresence>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  )
}

export default MainFeature