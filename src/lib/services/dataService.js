// Data Service Layer - Mimics Mongoose query patterns with in-memory data
// This service provides a consistent API for CRUD operations on dummy data

import {
    users,
    products,
    staff,
    drivers,
    orders,
    payments,
    carts,
    dispatches,
    deliveries,
    notifications,
    getUserStatus
} from '../data/dummyData';

import {
    generateId,
    generateOrderNumber,
    generateStaffNumber,
    generateDriverNumber,
    generatePaymentNumber,
    generateDeliveryNumber
} from '../data/idGenerator';

// In-memory data stores (mutable copies)
let dataStore = {
    users: [...users],
    products: [...products],
    staff: [...staff],
    drivers: [...drivers],
    orders: [...orders],
    payments: [...payments],
    carts: [...carts],
    dispatches: [...dispatches],
    deliveries: [...deliveries],
    notifications: [...notifications]
};

// Helper function to deep clone objects
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// Helper function to match query filters
const matchesQuery = (item, query) => {
    if (!query || Object.keys(query).length === 0) return true;

    for (const [key, value] of Object.entries(query)) {
        // Handle special MongoDB operators
        if (key === '$or') {
            const orMatch = value.some(condition => matchesQuery(item, condition));
            if (!orMatch) return false;
            continue;
        }

        if (key === '$and') {
            const andMatch = value.every(condition => matchesQuery(item, condition));
            if (!andMatch) return false;
            continue;
        }

        // Handle nested object queries (e.g., "location.city")
        if (key.includes('.')) {
            const keys = key.split('.');
            let nestedValue = item;
            for (const k of keys) {
                nestedValue = nestedValue?.[k];
            }

            if (typeof value === 'object' && value !== null) {
                if (!matchesOperator(nestedValue, value)) return false;
            } else if (nestedValue !== value) {
                return false;
            }
            continue;
        }

        // Handle operator objects ($gte, $lte, $regex, etc.)
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            if (!matchesOperator(item[key], value)) return false;
        } else {
            // Direct value comparison
            if (item[key] !== value) return false;
        }
    }

    return true;
};

// Helper function to match MongoDB operators
const matchesOperator = (itemValue, operatorObj) => {
    for (const [operator, value] of Object.entries(operatorObj)) {
        switch (operator) {
            case '$gte':
                if (new Date(itemValue) < new Date(value)) return false;
                break;
            case '$lte':
                if (new Date(itemValue) > new Date(value)) return false;
                break;
            case '$gt':
                if (itemValue <= value) return false;
                break;
            case '$lt':
                if (itemValue >= value) return false;
                break;
            case '$ne':
                if (itemValue === value) return false;
                break;
            case '$in':
                if (!value.includes(itemValue)) return false;
                break;
            case '$nin':
                if (value.includes(itemValue)) return false;
                break;
            case '$regex':
                const regex = new RegExp(value, operatorObj.$options || '');
                if (!regex.test(itemValue)) return false;
                break;
            case '$exists':
                const exists = itemValue !== undefined && itemValue !== null;
                if (exists !== value) return false;
                break;
            default:
                break;
        }
    }
    return true;
};

// Helper function to populate referenced data
const populate = (items, populateFields) => {
    if (!populateFields || items.length === 0) return items;

    const fieldsArray = Array.isArray(populateFields) ? populateFields : [populateFields];

    return items.map(item => {
        const populatedItem = { ...item };

        fieldsArray.forEach(field => {
            const fieldName = typeof field === 'string' ? field : field.path;
            const selectFields = typeof field === 'object' ? field.select : null;

            if (populatedItem[fieldName]) {
                let refData = null;

                // Determine which collection to populate from
                switch (fieldName) {
                    case 'user':
                        refData = dataStore.users.find(u => u._id === populatedItem[fieldName]);
                        break;
                    case 'order':
                        refData = dataStore.orders.find(o => o._id === populatedItem[fieldName]);
                        break;
                    case 'payment':
                        refData = dataStore.payments.find(p => p._id === populatedItem[fieldName]);
                        break;
                    case 'dispatch':
                        refData = dataStore.dispatches.find(d => d._id === populatedItem[fieldName]);
                        break;
                    default:
                        break;
                }

                if (refData) {
                    // Apply field selection if specified
                    if (selectFields) {
                        const selectedData = {};
                        selectFields.split(' ').forEach(f => {
                            if (f && refData[f] !== undefined) {
                                selectedData[f] = refData[f];
                            }
                        });
                        populatedItem[fieldName] = selectedData;
                    } else {
                        populatedItem[fieldName] = refData;
                    }
                }
            }
        });

        return populatedItem;
    });
};

// Helper function to sort items
const sortItems = (items, sortObj) => {
    if (!sortObj || Object.keys(sortObj).length === 0) return items;

    return [...items].sort((a, b) => {
        for (const [key, order] of Object.entries(sortObj)) {
            const aVal = a[key];
            const bVal = b[key];

            if (aVal === bVal) continue;

            if (aVal === null || aVal === undefined) return order === 1 ? 1 : -1;
            if (bVal === null || bVal === undefined) return order === 1 ? -1 : 1;

            // Handle dates
            if (aVal instanceof Date || bVal instanceof Date) {
                const aTime = new Date(aVal).getTime();
                const bTime = new Date(bVal).getTime();
                return order === 1 ? aTime - bTime : bTime - aTime;
            }

            // Handle strings
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return order === 1 ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }

            // Handle numbers
            return order === 1 ? aVal - bVal : bVal - aVal;
        }
        return 0;
    });
};

// ==================== DATA SERVICE CLASS ====================

class DataService {
    constructor(collectionName) {
        this.collectionName = collectionName;
        this.query = {};
        this.populateFields = null;
        this.sortObj = null;
        this.limitNum = null;
        this.skipNum = 0;
        this.selectFields = null;
    }

    // Find multiple documents
    find(query = {}) {
        this.query = query;
        return this;
    }

    // Find one document
    async findOne(query = {}) {
        const results = dataStore[this.collectionName].filter(item => matchesQuery(item, query));
        return results.length > 0 ? deepClone(results[0]) : null;
    }

    // Find by ID
    async findById(id) {
        const item = dataStore[this.collectionName].find(item => item._id === id);
        return item ? deepClone(item) : null;
    }

    // Create new document
    async create(data) {
        const newItem = {
            _id: generateId(),
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Auto-generate numbers based on collection
        switch (this.collectionName) {
            case 'orders':
                if (!newItem.orderNumber) {
                    newItem.orderNumber = generateOrderNumber();
                }
                break;
            case 'staff':
                if (!newItem.staffNumber) {
                    newItem.staffNumber = generateStaffNumber();
                }
                break;
            case 'drivers':
                if (!newItem.driverNumber) {
                    newItem.driverNumber = generateDriverNumber();
                }
                break;
            case 'payments':
                if (!newItem.paymentNumber) {
                    newItem.paymentNumber = generatePaymentNumber(newItem.orderNumber);
                }
                break;
            case 'deliveries':
                if (!newItem.deliveryNumber) {
                    newItem.deliveryNumber = generateDeliveryNumber(newItem.orderNumber);
                }
                break;
        }

        dataStore[this.collectionName].push(newItem);
        return deepClone(newItem);
    }

    // Update document by ID
    async findByIdAndUpdate(id, update, options = {}) {
        const index = dataStore[this.collectionName].findIndex(item => item._id === id);

        if (index === -1) {
            return null;
        }

        const currentItem = dataStore[this.collectionName][index];
        const updatedItem = {
            ...currentItem,
            ...update,
            updatedAt: new Date()
        };

        dataStore[this.collectionName][index] = updatedItem;
        return options.new !== false ? deepClone(updatedItem) : deepClone(currentItem);
    }

    // Update one document
    async findOneAndUpdate(query, update, options = {}) {
        const index = dataStore[this.collectionName].findIndex(item => matchesQuery(item, query));

        if (index === -1) {
            return null;
        }

        const currentItem = dataStore[this.collectionName][index];
        const updatedItem = {
            ...currentItem,
            ...update,
            updatedAt: new Date()
        };

        dataStore[this.collectionName][index] = updatedItem;
        return options.new !== false ? deepClone(updatedItem) : deepClone(currentItem);
    }

    // Update many documents
    async updateMany(query, update) {
        let modifiedCount = 0;

        dataStore[this.collectionName] = dataStore[this.collectionName].map(item => {
            if (matchesQuery(item, query)) {
                modifiedCount++;
                return {
                    ...item,
                    ...update,
                    updatedAt: new Date()
                };
            }
            return item;
        });

        return { modifiedCount, acknowledged: true };
    }

    // Delete document by ID
    async findByIdAndDelete(id) {
        const index = dataStore[this.collectionName].findIndex(item => item._id === id);

        if (index === -1) {
            return null;
        }

        const deletedItem = dataStore[this.collectionName][index];
        dataStore[this.collectionName].splice(index, 1);
        return deepClone(deletedItem);
    }

    // Delete one document
    async findOneAndDelete(query) {
        const index = dataStore[this.collectionName].findIndex(item => matchesQuery(item, query));

        if (index === -1) {
            return null;
        }

        const deletedItem = dataStore[this.collectionName][index];
        dataStore[this.collectionName].splice(index, 1);
        return deepClone(deletedItem);
    }

    // Delete many documents
    async deleteMany(query) {
        const initialLength = dataStore[this.collectionName].length;
        dataStore[this.collectionName] = dataStore[this.collectionName].filter(
            item => !matchesQuery(item, query)
        );
        const deletedCount = initialLength - dataStore[this.collectionName].length;
        return { deletedCount, acknowledged: true };
    }

    // Count documents
    async countDocuments(query = {}) {
        return dataStore[this.collectionName].filter(item => matchesQuery(item, query)).length;
    }

    // Populate referenced fields
    populate(fields) {
        this.populateFields = fields;
        return this;
    }

    // Sort results
    sort(sortObj) {
        this.sortObj = sortObj;
        return this;
    }

    // Limit results
    limit(num) {
        this.limitNum = num;
        return this;
    }

    // Skip results
    skip(num) {
        this.skipNum = num;
        return this;
    }

    // Select specific fields
    select(fields) {
        this.selectFields = fields;
        return this;
    }

    // Execute the query (for chained operations)
    async exec() {
        let results = dataStore[this.collectionName].filter(item => matchesQuery(item, this.query));

        // Apply sorting
        if (this.sortObj) {
            results = sortItems(results, this.sortObj);
        }

        // Apply skip and limit
        if (this.skipNum > 0) {
            results = results.slice(this.skipNum);
        }
        if (this.limitNum !== null) {
            results = results.slice(0, this.limitNum);
        }

        // Apply population
        if (this.populateFields) {
            results = populate(results, this.populateFields);
        }

        // Apply field selection
        if (this.selectFields) {
            const fields = this.selectFields.split(' ');
            results = results.map(item => {
                const selected = {};
                fields.forEach(field => {
                    if (field && item[field] !== undefined) {
                        selected[field] = item[field];
                    }
                });
                return selected;
            });
        }

        return deepClone(results);
    }

    // Make the query thenable (allows await without .exec())
    then(resolve, reject) {
        return this.exec().then(resolve, reject);
    }
}

// ==================== EXPORTED MODEL INTERFACES ====================

export const User = {
    find: (query) => new DataService('users').find(query),
    findOne: (query) => new DataService('users').findOne(query),
    findById: (id) => new DataService('users').findById(id),
    create: (data) => new DataService('users').create(data),
    findByIdAndUpdate: (id, update, options) => new DataService('users').findByIdAndUpdate(id, update, options),
    findOneAndUpdate: (query, update, options) => new DataService('users').findOneAndUpdate(query, update, options),
    updateMany: (query, update) => new DataService('users').updateMany(query, update),
    findByIdAndDelete: (id) => new DataService('users').findByIdAndDelete(id),
    deleteMany: (query) => new DataService('users').deleteMany(query),
    countDocuments: (query) => new DataService('users').countDocuments(query),
};

export const Product = {
    find: (query) => new DataService('products').find(query),
    findOne: (query) => new DataService('products').findOne(query),
    findById: (id) => new DataService('products').findById(id),
    create: (data) => new DataService('products').create(data),
    findByIdAndUpdate: (id, update, options) => new DataService('products').findByIdAndUpdate(id, update, options),
    findOneAndUpdate: (query, update, options) => new DataService('products').findOneAndUpdate(query, update, options),
    updateMany: (query, update) => new DataService('products').updateMany(query, update),
    findByIdAndDelete: (id) => new DataService('products').findByIdAndDelete(id),
    deleteMany: (query) => new DataService('products').deleteMany(query),
    countDocuments: (query) => new DataService('products').countDocuments(query),
};

export const Staff = {
    find: (query) => new DataService('staff').find(query),
    findOne: (query) => new DataService('staff').findOne(query),
    findById: (id) => new DataService('staff').findById(id),
    create: (data) => new DataService('staff').create(data),
    findByIdAndUpdate: (id, update, options) => new DataService('staff').findByIdAndUpdate(id, update, options),
    findOneAndUpdate: (query, update, options) => new DataService('staff').findOneAndUpdate(query, update, options),
    updateMany: (query, update) => new DataService('staff').updateMany(query, update),
    findByIdAndDelete: (id) => new DataService('staff').findByIdAndDelete(id),
    deleteMany: (query) => new DataService('staff').deleteMany(query),
    countDocuments: (query) => new DataService('staff').countDocuments(query),
};

export const Driver = {
    find: (query) => new DataService('drivers').find(query),
    findOne: (query) => new DataService('drivers').findOne(query),
    findById: (id) => new DataService('drivers').findById(id),
    create: (data) => new DataService('drivers').create(data),
    findByIdAndUpdate: (id, update, options) => new DataService('drivers').findByIdAndUpdate(id, update, options),
    findOneAndUpdate: (query, update, options) => new DataService('drivers').findOneAndUpdate(query, update, options),
    updateMany: (query, update) => new DataService('drivers').updateMany(query, update),
    findByIdAndDelete: (id) => new DataService('drivers').findByIdAndDelete(id),
    deleteMany: (query) => new DataService('drivers').deleteMany(query),
    countDocuments: (query) => new DataService('drivers').countDocuments(query),
};

export const Order = {
    find: (query) => new DataService('orders').find(query),
    findOne: (query) => new DataService('orders').findOne(query),
    findById: (id) => new DataService('orders').findById(id),
    create: (data) => new DataService('orders').create(data),
    findByIdAndUpdate: (id, update, options) => new DataService('orders').findByIdAndUpdate(id, update, options),
    findOneAndUpdate: (query, update, options) => new DataService('orders').findOneAndUpdate(query, update, options),
    updateMany: (query, update) => new DataService('orders').updateMany(query, update),
    findByIdAndDelete: (id) => new DataService('orders').findByIdAndDelete(id),
    deleteMany: (query) => new DataService('orders').deleteMany(query),
    countDocuments: (query) => new DataService('orders').countDocuments(query),
};

export const Payment = {
    find: (query) => new DataService('payments').find(query),
    findOne: (query) => new DataService('payments').findOne(query),
    findById: (id) => new DataService('payments').findById(id),
    create: (data) => new DataService('payments').create(data),
    findByIdAndUpdate: (id, update, options) => new DataService('payments').findByIdAndUpdate(id, update, options),
    findOneAndUpdate: (query, update, options) => new DataService('payments').findOneAndUpdate(query, update, options),
    updateMany: (query, update) => new DataService('payments').updateMany(query, update),
    findByIdAndDelete: (id) => new DataService('payments').findByIdAndDelete(id),
    deleteMany: (query) => new DataService('payments').deleteMany(query),
    countDocuments: (query) => new DataService('payments').countDocuments(query),
};

export const Cart = {
    find: (query) => new DataService('carts').find(query),
    findOne: (query) => new DataService('carts').findOne(query),
    findById: (id) => new DataService('carts').findById(id),
    create: (data) => new DataService('carts').create(data),
    findByIdAndUpdate: (id, update, options) => new DataService('carts').findByIdAndUpdate(id, update, options),
    findOneAndUpdate: (query, update, options) => new DataService('carts').findOneAndUpdate(query, update, options),
    updateMany: (query, update) => new DataService('carts').updateMany(query, update),
    findByIdAndDelete: (id) => new DataService('carts').findByIdAndDelete(id),
    deleteMany: (query) => new DataService('carts').deleteMany(query),
    countDocuments: (query) => new DataService('carts').countDocuments(query),
};

export const Dispatch = {
    find: (query) => new DataService('dispatches').find(query),
    findOne: (query) => new DataService('dispatches').findOne(query),
    findById: (id) => new DataService('dispatches').findById(id),
    create: (data) => new DataService('dispatches').create(data),
    findByIdAndUpdate: (id, update, options) => new DataService('dispatches').findByIdAndUpdate(id, update, options),
    findOneAndUpdate: (query, update, options) => new DataService('dispatches').findOneAndUpdate(query, update, options),
    updateMany: (query, update) => new DataService('dispatches').updateMany(query, update),
    findByIdAndDelete: (id) => new DataService('dispatches').findByIdAndDelete(id),
    deleteMany: (query) => new DataService('dispatches').deleteMany(query),
    countDocuments: (query) => new DataService('dispatches').countDocuments(query),
};

export const Delivery = {
    find: (query) => new DataService('deliveries').find(query),
    findOne: (query) => new DataService('deliveries').findOne(query),
    findById: (id) => new DataService('deliveries').findById(id),
    create: (data) => new DataService('deliveries').create(data),
    findByIdAndUpdate: (id, update, options) => new DataService('deliveries').findByIdAndUpdate(id, update, options),
    findOneAndUpdate: (query, update, options) => new DataService('deliveries').findOneAndUpdate(query, update, options),
    updateMany: (query, update) => new DataService('deliveries').updateMany(query, update),
    findByIdAndDelete: (id) => new DataService('deliveries').findByIdAndDelete(id),
    deleteMany: (query) => new DataService('deliveries').deleteMany(query),
    countDocuments: (query) => new DataService('deliveries').countDocuments(query),
};

export const Notification = {
    find: (query) => new DataService('notifications').find(query),
    findOne: (query) => new DataService('notifications').findOne(query),
    findById: (id) => new DataService('notifications').findById(id),
    create: (data) => new DataService('notifications').create(data),
    findByIdAndUpdate: (id, update, options) => new DataService('notifications').findByIdAndUpdate(id, update, options),
    findOneAndUpdate: (query, update, options) => new DataService('notifications').findOneAndUpdate(query, update, options),
    updateMany: (query, update) => new DataService('notifications').updateMany(query, update),
    findByIdAndDelete: (id) => new DataService('notifications').findByIdAndDelete(id),
    deleteMany: (query) => new DataService('notifications').deleteMany(query),
    countDocuments: (query) => new DataService('notifications').countDocuments(query),
};

// Export helper to reset data (useful for testing)
export const resetDataStore = () => {
    dataStore = {
        users: [...users],
        products: [...products],
        staff: [...staff],
        drivers: [...drivers],
        orders: [...orders],
        payments: [...payments],
        carts: [...carts],
        dispatches: [...dispatches],
        deliveries: [...deliveries],
        notifications: [...notifications]
    };
};

// Export data store for direct access if needed
export { dataStore };
