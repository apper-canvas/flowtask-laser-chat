const { ApperClient } = window.ApperSDK;

// Initialize ApperClient with Project ID and Public Key
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const todoService = {
  async getAll() {
    try {
      const tableName = 'todo';
      const tableFields = [
        'Name', 'text', 'completed', 'priority', 'due_date', 'order', 'category_id',
        'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
      ];

      const params = {
        fields: tableFields,
        orderBy: [
          {
            fieldName: "CreatedOn",
            SortType: "DESC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords(tableName, params);

      if (!response || !response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(todo => ({
        id: todo.Id?.toString(),
        text: todo.text || todo.Name || '',
        completed: todo.completed || false,
        priority: todo.priority || 'medium',
        category: todo.category_id ? todo.category_id.displayValue : null,
        dueDate: todo.due_date || null,
        order: todo.order || 0,
        createdAt: todo.CreatedOn || new Date().toISOString(),
        updatedAt: todo.ModifiedOn || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching todos:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const tableName = 'todo';
      const tableFields = [
        'Name', 'text', 'completed', 'priority', 'due_date', 'order', 'category_id',
        'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
      ];

      const params = {
        fields: tableFields
      };

      const response = await apperClient.getRecordById(tableName, id, params);

      if (!response || !response.data) {
        return null;
      }

      const todo = response.data;
      return {
        id: todo.Id?.toString(),
        text: todo.text || todo.Name || '',
        completed: todo.completed || false,
        priority: todo.priority || 'medium',
        category: todo.category_id ? todo.category_id.displayValue : null,
        dueDate: todo.due_date || null,
        order: todo.order || 0,
        createdAt: todo.CreatedOn || new Date().toISOString(),
        updatedAt: todo.ModifiedOn || new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching todo with ID ${id}:`, error);
      return null;
    }
  },

  async create(todoData) {
    try {
      const tableName = 'todo';
      
      // Format data according to field types - only updateable fields
      const params = {
        records: [
          {
            Name: todoData.text || '',
            text: todoData.text || '',
            completed: todoData.completed || false,
            priority: todoData.priority || 'medium',
            due_date: todoData.dueDate ? new Date(todoData.dueDate).toISOString() : null,
            order: todoData.order || 0,
            category_id: todoData.category || null
          }
        ]
      };

      const response = await apperClient.createRecord(tableName, params);

      if (response && response.success && response.results && response.results[0]?.success) {
        const created = response.results[0].data;
        return {
          id: created.Id?.toString(),
          text: created.text || created.Name || '',
          completed: created.completed || false,
          priority: created.priority || 'medium',
          category: created.category_id ? created.category_id.displayValue : null,
          dueDate: created.due_date || null,
          order: created.order || 0,
          createdAt: created.CreatedOn || new Date().toISOString(),
          updatedAt: created.ModifiedOn || new Date().toISOString()
        };
      } else {
        throw new Error('Failed to create todo');
      }
    } catch (error) {
      console.error("Error creating todo:", error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const tableName = 'todo';
      
      // Only include updateable fields
      const updateFields = {};
      if (updateData.text !== undefined) {
        updateFields.Name = updateData.text;
        updateFields.text = updateData.text;
      }
      if (updateData.completed !== undefined) updateFields.completed = updateData.completed;
      if (updateData.priority !== undefined) updateFields.priority = updateData.priority;
      if (updateData.dueDate !== undefined) {
        updateFields.due_date = updateData.dueDate ? new Date(updateData.dueDate).toISOString() : null;
      }
      if (updateData.order !== undefined) updateFields.order = updateData.order;
      if (updateData.category !== undefined) updateFields.category_id = updateData.category;

      const params = {
        records: [
          {
            Id: parseInt(id),
            ...updateFields
          }
        ]
      };

      const response = await apperClient.updateRecord(tableName, params);

      if (response && response.success && response.results && response.results[0]?.success) {
        const updated = response.results[0].data;
        return {
          id: updated.Id?.toString(),
          text: updated.text || updated.Name || '',
          completed: updated.completed || false,
          priority: updated.priority || 'medium',
          category: updated.category_id ? updated.category_id.displayValue : null,
          dueDate: updated.due_date || null,
          order: updated.order || 0,
          createdAt: updated.CreatedOn || new Date().toISOString(),
          updatedAt: updated.ModifiedOn || new Date().toISOString()
        };
      } else {
        throw new Error('Failed to update todo');
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const tableName = 'todo';
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(tableName, params);

      if (response && response.success && response.results && response.results[0]?.success) {
        return true;
      } else {
        throw new Error('Failed to delete todo');
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      throw error;
    }
  },

  async bulkUpdate(ids, updateData) {
    try {
      const tableName = 'todo';
      
      const updateFields = {};
      if (updateData.completed !== undefined) updateFields.completed = updateData.completed;
      if (updateData.priority !== undefined) updateFields.priority = updateData.priority;
      if (updateData.category !== undefined) updateFields.category_id = updateData.category;

      const records = ids.map(id => ({
        Id: parseInt(id),
        ...updateFields
      }));

      const params = { records };

      const response = await apperClient.updateRecord(tableName, params);

      if (response && response.success && response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        return successfulUpdates.map(result => {
          const updated = result.data;
          return {
            id: updated.Id?.toString(),
            text: updated.text || updated.Name || '',
            completed: updated.completed || false,
            priority: updated.priority || 'medium',
            category: updated.category_id ? updated.category_id.displayValue : null,
            dueDate: updated.due_date || null,
            order: updated.order || 0,
            createdAt: updated.CreatedOn || new Date().toISOString(),
            updatedAt: updated.ModifiedOn || new Date().toISOString()
          };
        });
      } else {
        throw new Error('Failed to bulk update todos');
      }
    } catch (error) {
      console.error("Error bulk updating todos:", error);
      throw error;
    }
  },

  async deleteCompleted() {
    try {
      // First fetch completed todos
      const tableName = 'todo';
      const params = {
        fields: ['Name', 'text', 'completed'],
        where: [
          {
            fieldName: "completed",
            operator: "ExactMatch",
            values: [true]
          }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }

      const completedIds = response.data.map(todo => todo.Id);
      
      // Delete them
      const deleteParams = {
        RecordIds: completedIds
      };

      const deleteResponse = await apperClient.deleteRecord(tableName, deleteParams);
      
      if (deleteResponse && deleteResponse.success) {
        return response.data.map(todo => ({
          id: todo.Id?.toString(),
          text: todo.text || todo.Name || '',
          completed: todo.completed || false
        }));
      } else {
        throw new Error('Failed to delete completed todos');
      }
    } catch (error) {
      console.error("Error deleting completed todos:", error);
      throw error;
    }
  }
};

export default todoService;