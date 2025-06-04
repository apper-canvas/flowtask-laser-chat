import todoData from '../mockData/todos.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let todos = [...todoData]

const todoService = {
  async getAll() {
    await delay(300)
    return [...todos].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  async getById(id) {
    await delay(200)
    const todo = todos.find(t => t.id === id)
    return todo ? { ...todo } : null
  },

  async create(todoData) {
    await delay(250)
    const newTodo = {
      id: Date.now().toString(),
      ...todoData,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    todos.unshift(newTodo)
    return { ...newTodo }
  },

  async update(id, updateData) {
    await delay(200)
    const index = todos.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Todo not found')
    
    todos[index] = {
      ...todos[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    return { ...todos[index] }
  },

  async delete(id) {
    await delay(200)
    const index = todos.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Todo not found')
    
    const deleted = todos.splice(index, 1)[0]
    return { ...deleted }
  },

  async bulkUpdate(ids, updateData) {
    await delay(300)
    const updated = []
    ids.forEach(id => {
      const index = todos.findIndex(t => t.id === id)
      if (index !== -1) {
        todos[index] = {
          ...todos[index],
          ...updateData,
          updatedAt: new Date().toISOString()
        }
        updated.push({ ...todos[index] })
      }
    })
    return updated
  },

  async deleteCompleted() {
    await delay(250)
    const completed = todos.filter(t => t.completed)
    todos = todos.filter(t => !t.completed)
    return completed
  }
}

export default todoService