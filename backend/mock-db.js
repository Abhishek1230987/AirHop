/**
 * Mock In-Memory MongoDB for Development
 * This provides a simple in-memory store that mimics MongoDB when the server cannot connect
 * Useful for development without a local MongoDB or Atlas connectivity
 */

class MockCollection {
  constructor(name) {
    this.name = name;
    this.data = [];
    this.counter = 0;
  }

  async insertOne(doc) {
    const id = this.counter++;
    const newDoc = { _id: id.toString(), ...doc, createdAt: new Date() };
    this.data.push(newDoc);
    return { insertedId: id.toString() };
  }

  async find(query = {}) {
    let results = this.data;
    // Simple query matching
    for (const [key, value] of Object.entries(query)) {
      results = results.filter((doc) => doc[key] === value);
    }
    return {
      toArray: async () => results,
      limit: (n) => ({
        skip: (s) => ({
          toArray: async () => results.slice(s, s + n),
        }),
        toArray: async () => results.slice(0, n),
      }),
      skip: (n) => ({
        toArray: async () => results.slice(n),
      }),
    };
  }

  async findOne(query = {}) {
    for (const [key, value] of Object.entries(query)) {
      return this.data.find((doc) => doc[key] === value) || null;
    }
    return this.data[0] || null;
  }

  async updateOne(query, update) {
    const index = this.data.findIndex((doc) => {
      for (const [key, value] of Object.entries(query)) {
        if (doc[key] !== value) return false;
      }
      return true;
    });
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...update.$set };
      return { modifiedCount: 1 };
    }
    return { modifiedCount: 0 };
  }

  async deleteOne(query) {
    const index = this.data.findIndex((doc) => {
      for (const [key, value] of Object.entries(query)) {
        if (doc[key] !== value) return false;
      }
      return true;
    });
    if (index !== -1) {
      this.data.splice(index, 1);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  async deleteMany(query) {
    const initialLength = this.data.length;
    this.data = this.data.filter((doc) => {
      for (const [key, value] of Object.entries(query)) {
        if (doc[key] === value) return false;
      }
      return true;
    });
    return { deletedCount: initialLength - this.data.length };
  }

  async countDocuments(query = {}) {
    let count = this.data.length;
    for (const [key, value] of Object.entries(query)) {
      count = this.data.filter((doc) => doc[key] === value).length;
    }
    return count;
  }
}

class MockDatabase {
  constructor() {
    this.collections = {};
  }

  collection(name) {
    if (!this.collections[name]) {
      this.collections[name] = new MockCollection(name);
    }
    return this.collections[name];
  }
}

export const mockDB = new MockDatabase();
