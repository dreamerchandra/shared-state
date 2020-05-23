
/**
 * @typedef {Map<String, Array<Function>} DependencyObserver
 */

export default class StateManager {

  state = {};
  /**@type {DependencyObserver} */
  depObservers = new Map();

  cleanUp = () => {
    delete this.depObservers;
    delete this.state;
  }

  getChangedEntities = ({ oldState = JSON.parse(JSON.stringify(this.state)) , newState}) => {
    const entitiesChanged = {};
    for (const [key, value] of Object.entries(newState)) {
      if (value !== oldState[key]) {
        entitiesChanged[key] = {
          oldValue: oldState[key],
          newValue: value,
        };
      }
    }
    console.log(`changed entities: entitiesChanged`, entitiesChanged);
    return entitiesChanged;
  }

  _update = (newState) => ({
      ...this.state,
      ...newState,
  });

  notifyObservers (entitiesChanged) {
    for (const [key, { oldValue, newValue }] of Object.entries(entitiesChanged)) {
      const observers = this.depObservers.get(key) || [];
      console.log('notifying key: ', key, ' with old Values: ', oldValue, ' newVal: ', newValue, ' and observers are: ', this.depObservers.get(key));
      
      observers.forEach(observer => {
        observer && observer({oldValue, newValue})
      })

    }
  }

  update = (newState) => {
    this.notifyObservers(this.getChangedEntities({ newState }));
    const updateState = this._update(newState);
    console.log('old state', this.state);
    console.log('state to be updated', updateState)
    this.state = updateState;
    return this.state;
  }

  subscribe (depId, newCallBack) {
    const callBacks = this.depObservers.get(depId) || [];
    this.depObservers.set(depId, [...callBacks, newCallBack]);
    const updatedObservers = this.depObservers.get(depId);
    console.log('subscribed for depId: ', depId, ' is successful and new depObservers are', updatedObservers);
    newCallBack && newCallBack({ newValue: this.state[depId]})
    return updatedObservers;
  }

  unsubscribe (depId, oldCallBack) {
    const existingCallBacks = this.depObservers.get(depId);
    const updatedCallBack = existingCallBacks.filter((callBack) => callBack !== oldCallBack)
    this.depObservers.set(depId, updatedCallBack);
    return updatedCallBack
  }
}