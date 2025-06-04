import React from 'react'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-morphism dark:glass-morphism-dark border-b border-surface-200/20 dark:border-surface-700/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-soft">
                <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gradient">FlowTask</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-surface-600 dark:text-surface-400">
                <ApperIcon name="Target" className="w-4 h-4" />
                <span>Stay Organized</span>
              </div>
              
              <button
                className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all duration-200 focus-ring"
                onClick={() => {
                  document.documentElement.classList.toggle('dark')
                }}
              >
                <ApperIcon name="Moon" className="w-5 h-5 text-surface-700 dark:text-surface-300 dark:hidden" />
                <ApperIcon name="Sun" className="w-5 h-5 text-surface-300 hidden dark:block" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-surface-100 mb-4">
            Transform Your Productivity
          </h2>
          <p className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
            Experience the next generation of task management with FlowTask. 
            Organize, prioritize, and complete your tasks with elegant simplicity.
          </p>
        </div>

        {/* Task Management Interface */}
        <MainFeature />
        
        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <ApperIcon name="Zap" className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
              Lightning Fast
            </h3>
            <p className="text-surface-600 dark:text-surface-400">
              Add, edit, and organize tasks instantly with keyboard shortcuts and smooth animations.
            </p>
          </div>
          
          <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-300">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
              <ApperIcon name="Brain" className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
              Smart Organization
            </h3>
            <p className="text-surface-600 dark:text-surface-400">
              Categorize with colors, set priorities, and track due dates to stay on top of everything.
            </p>
          </div>
          
          <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-300">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
              <ApperIcon name="Palette" className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
              Beautiful Design
            </h3>
            <p className="text-surface-600 dark:text-surface-400">
              Enjoy a premium interface with glass morphism effects and delightful micro-interactions.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home