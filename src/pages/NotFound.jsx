import React from 'react'
import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-soft">
          <ApperIcon name="Search" className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-6xl font-bold text-surface-900 dark:text-surface-100 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-surface-700 dark:text-surface-300 mb-4">
          Page Not Found
        </h2>
        <p className="text-surface-600 dark:text-surface-400 mb-8 max-w-md mx-auto">
          Looks like this task got lost in the void. Let's get you back to organizing your life!
        </p>
        
        <Link 
          to="/"
          className="inline-flex items-center space-x-2 btn-gradient text-white px-6 py-3 rounded-xl font-medium hover:shadow-elevated transition-all duration-200 focus-ring"
        >
          <ApperIcon name="Home" className="w-5 h-5" />
          <span>Back to FlowTask</span>
        </Link>
      </div>
    </div>
  )
}

export default NotFound