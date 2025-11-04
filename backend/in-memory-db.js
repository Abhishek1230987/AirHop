/**
 * In-Memory MongoDB Emulator for Development
 * Provides Mongoose-compatible API using in-memory storage
 * Usage: Import this module and use with Mongoose schemas
 */

class InMemoryDB {
  constructor() {
    this.collections = new Map();
    this.counters = new Map();
  }

  collection(name) {
    if (!this.collections.has(name)) {
      this.collections.set(name, []);
      this.counters.set(name, 0);
    }
    return {
      data: this.collections.get(name),
      counter: this.counters.get(name),
    };
  }

  getCounter(name) {
    return this.counters.get(name) || 0;
  }

  incrementCounter(name) {
    const current = this.counters.get(name) || 0;
    this.counters.set(name, current + 1);
    return current + 1;
  }

  reset() {
    this.collections.clear();
    this.counters.clear();
  }
}

const memoryDB = new InMemoryDB();

// In-Memory Document Class
class InMemoryDocument {
  constructor(data, schema, collectionName) {
    this._id = data._id || `${collectionName}_${Date.now()}_${Math.random()}`;
    this.schema = schema;
    this.collectionName = collectionName;
    Object.assign(this, data);
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = new Date();
  }

  async save() {
    const col = memoryDB.collection(this.collectionName);
    const existing = col.data.findIndex((d) => d._id === this._id);
    if (existing !== -1) {
      col.data[existing] = { ...this };
    } else {
      col.data.push({ ...this });
    }
    return this;
  }

  async deleteOne() {
    const col = memoryDB.collection(this.collectionName);
    const idx = col.data.findIndex((d) => d._id === this._id);
    if (idx !== -1) {
      col.data.splice(idx, 1);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  toObject() {
    return { ...this };
  }

  toJSON() {
    return this.toObject();
  }
}

// In-Memory Model Class
class InMemoryModel {
  constructor(name, schema) {
    this.modelName = name;
    this.schema = schema;
    this.collectionName = name.toLowerCase() + "s";
  }

  create(data) {
    const doc = new InMemoryDocument(data, this.schema, this.collectionName);
    return doc.save();
  }

  async findById(id) {
    const col = memoryDB.collection(this.collectionName);
    const doc = col.data.find((d) => d._id == id);
    return doc
      ? new InMemoryDocument(doc, this.schema, this.collectionName)
      : null;
  }

  async findOne(query = {}) {
    const col = memoryDB.collection(this.collectionName);
    const doc = col.data.find((d) => this._matchesQuery(d, query));
    return doc
      ? new InMemoryDocument(doc, this.schema, this.collectionName)
      : null;
  }

  async find(query = {}) {
    const col = memoryDB.collection(this.collectionName);
    const results = col.data
      .filter((d) => this._matchesQuery(d, query))
      .map((d) => new InMemoryDocument(d, this.schema, this.collectionName));

    return {
      exec: async () => results,
      limit: (n) => ({
        skip: (s) => ({
          exec: async () => results.slice(s, s + n),
          lean: () => ({
            exec: async () => results.slice(s, s + n).map((r) => r.toObject()),
          }),
        }),
        exec: async () => results.slice(0, n),
        lean: () => ({
          exec: async () => results.slice(0, n).map((r) => r.toObject()),
        }),
      }),
      skip: (n) => ({
        exec: async () => results.slice(n),
        lean: () => ({
          exec: async () => results.slice(n).map((r) => r.toObject()),
        }),
      }),
      lean: () => ({
        exec: async () => results.map((r) => r.toObject()),
      }),
    };
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const col = memoryDB.collection(this.collectionName);
    const idx = col.data.findIndex((d) => d._id == id);
    if (idx !== -1) {
      col.data[idx] = {
        ...col.data[idx],
        ...update.$set,
        updatedAt: new Date(),
      };
      const doc = new InMemoryDocument(
        col.data[idx],
        this.schema,
        this.collectionName
      );
      return options.new ? doc : null;
    }
    return null;
  }

  async updateOne(query, update) {
    const col = memoryDB.collection(this.collectionName);
    const idx = col.data.findIndex((d) => this._matchesQuery(d, query));
    if (idx !== -1) {
      col.data[idx] = {
        ...col.data[idx],
        ...update.$set,
        updatedAt: new Date(),
      };
      return { modifiedCount: 1 };
    }
    return { modifiedCount: 0 };
  }

  async deleteOne(query) {
    const col = memoryDB.collection(this.collectionName);
    const idx = col.data.findIndex((d) => this._matchesQuery(d, query));
    if (idx !== -1) {
      col.data.splice(idx, 1);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  async deleteMany(query) {
    const col = memoryDB.collection(this.collectionName);
    const initialLength = col.data.length;
    col.data = col.data.filter((d) => !this._matchesQuery(d, query));
    return { deletedCount: initialLength - col.data.length };
  }

  async countDocuments(query = {}) {
    const col = memoryDB.collection(this.collectionName);
    return col.data.filter((d) => this._matchesQuery(d, query)).length;
  }

  _matchesQuery(doc, query) {
    for (const [key, value] of Object.entries(query)) {
      if (key === "_id") {
        if (doc[key] != value) return false;
      } else if (typeof value === "object" && value !== null) {
        if (JSON.stringify(doc[key]) !== JSON.stringify(value)) return false;
      } else {
        if (doc[key] !== value) return false;
      }
    }
    return true;
  }
}

// Mock Mongoose Connection
export const createMockConnection = () => {
  return {
    model: (name, schema) => new InMemoryModel(name, schema),
    connect: async () => {
      console.log("✅ Connected to In-Memory Database (Development Mode)");
      return { connection: { readyState: 1 } };
    },
    disconnect: async () => {
      memoryDB.reset();
      return true;
    },
  };
};

export const mockConnection = createMockConnection();
export default mockConnection;
