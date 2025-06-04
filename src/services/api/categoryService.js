import categoryData from '../mockData/categories.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let categories = [...categoryData]

const categoryService = {
  async getAll() {
    await delay(200)
    return [...categories]
  },

  async getById(name) {
    await delay(150)
    const category = categories.find(c => c.name === name)
    return category ? { ...category } : null
  },

  async create(categoryData) {
    await delay(200)
    const newCategory = {
      ...categoryData,
      createdAt: new Date().toISOString()
    }
    categories.push(newCategory)
    return { ...newCategory }
  },

  async update(name, updateData) {
    await delay(200)
    const index = categories.findIndex(c => c.name === name)
    if (index === -1) throw new Error('Category not found')
    
    categories[index] = {
      ...categories[index],
      ...updateData
    }
    return { ...categories[index] }
  },

  async delete(name) {
    await delay(200)
    const index = categories.findIndex(c => c.name === name)
    if (index === -1) throw new Error('Category not found')
    
    const deleted = categories.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default categoryService