import StateManager from "./StateManager";
import console from './logger';

/**
 * @typedef {Map<String, StateManager>} SharedObserverStateManger
 */

export default class SharedObserver{
  /** @type {SharedObserverStateManger}*/
  static stateManager = new Map();
  
  static createObserver (key) {
    const stateManager = new StateManager();
    this.stateManager.set(key, stateManager);
    return this.stateManager.get(key);
  }
  
  static deleteObserver (key) {
    const stateManger = this.stateManager.get(key);
    if (!stateManger) return;

    stateManger.cleanUp();
    this.stateManager.delete(key);
    return key;
  }

  static update (key, newState) {
    const stateManager = this.stateManager.get(key)
    if (!stateManager) return;

    return stateManager.update(newState);
  }

  static subscribe ({ key, depId }, updateCb) {
    const stateManager = this.stateManager.get(key);
    if (!stateManager) return;

    return stateManager.subscribe(depId, updateCb);
  }

  static unsubscribe ({ key, depId }, updateCb) {
    const stateManager = this.stateManager.get(key);
    if (!stateManager) return;

    return stateManager.unsubscribe(depId, updateCb);
  }
}

window.SharedObserver = SharedObserver;