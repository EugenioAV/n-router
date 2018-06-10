class Adapter {
  constructor(path) {
    this.path =  path;
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

  delete() {
    throw new Error('Must be implements by subclasses');
  }
}

module.exports = Adapter;