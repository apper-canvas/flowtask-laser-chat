const { ApperClient } = window.ApperSDK;

// Initialize ApperClient with Project ID and Public Key
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const categoryService = {
  async getAll() {
    try {
      const tableName = 'category';
      const tableFields = [
        'Name', 'color', 'icon', 'Tags', 'Owner', 
        'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
      ];

      const params = {
        fields: tableFields,
        orderBy: [
          {
            fieldName: "Name",
            SortType: "ASC"
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords(tableName, params);

      if (!response || !response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(category => ({
        name: category.Name || '',
        color: category.color || '#64748b',
        icon: category.icon || 'Tag',
        createdAt: category.CreatedOn || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const tableName = 'category';
      const tableFields = [
        'Name', 'color', 'icon', 'Tags', 'Owner',
        'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
      ];

      const params = {
        fields: tableFields
      };

      const response = await apperClient.getRecordById(tableName, id, params);

      if (!response || !response.data) {
        return null;
      }

      const category = response.data;
      return {
        name: category.Name || '',
        color: category.color || '#64748b',
        icon: category.icon || 'Tag',
        createdAt: category.CreatedOn || new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      return null;
    }
  },

  async create(categoryData) {
    try {
      const tableName = 'category';
      
      // Format data according to field types - only updateable fields
      const params = {
        records: [
          {
            Name: categoryData.name || '',
            color: categoryData.color || '#64748b',
            icon: categoryData.icon || 'Tag'
          }
        ]
      };

      const response = await apperClient.createRecord(tableName, params);

      if (response && response.success && response.results && response.results[0]?.success) {
        const created = response.results[0].data;
        return {
          name: created.Name || '',
          color: created.color || '#64748b',
          icon: created.icon || 'Tag',
          createdAt: created.CreatedOn || new Date().toISOString()
        };
      } else {
        throw new Error('Failed to create category');
      }
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const tableName = 'category';
      
      // Only include updateable fields
      const updateFields = {};
      if (updateData.name !== undefined) updateFields.Name = updateData.name;
      if (updateData.color !== undefined) updateFields.color = updateData.color;
      if (updateData.icon !== undefined) updateFields.icon = updateData.icon;

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
          name: updated.Name || '',
          color: updated.color || '#64748b',
          icon: updated.icon || 'Tag',
          createdAt: updated.CreatedOn || new Date().toISOString()
        };
      } else {
        throw new Error('Failed to update category');
      }
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const tableName = 'category';
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(tableName, params);

      if (response && response.success && response.results && response.results[0]?.success) {
        return true;
      } else {
        throw new Error('Failed to delete category');
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
};

export default categoryService;