class ContextManager {
  _state = {}
  _context = {}
  updateState = (key, state) => {
    this._state[key] = state;
    return this._state[key];
  }
  _createContext = (state) => createContext(state)
  createContextAndState = (key, value) => this._createContext(this.updateState(key, value))
  createContext = (key, value) => {
    this._context[key] = this.createContextAndState(key, value)
    return this._context[key];
  }
  getContext = (key) => this._context[key]
  getState = (key) => this._state[key]
}