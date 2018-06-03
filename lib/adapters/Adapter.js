class Adapter {
  constructor(config) {
    const { type, qs, name, path } = config;
    this.type = type;
    this.qs = qs;
    this.name = name;
    this.path = path;    
  }

  create() {
    throw new Error('Must be implements by subclasses');
  }

  read() {
    throw new Error('Must be implements by subclasses');
  }

  update() {
    throw new Error('Must be implements by subclasses');
  }

  destroy() {
    throw new Error('Must be implements by subclasses');
  }
}

module.exports = Adapter;