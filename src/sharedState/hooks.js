import { useEffect, useRef, useState } from 'react';
import SharedObserver from './SharedObserver';
import console from './logger';

window.SharedObserver = SharedObserver
export function useToCreateSharedProps (key, newState) {
  useEffect(() => {
    console.log(`creating observer for key: ${key}`);
    SharedObserver.createObserver(key);
    return () => {
      console.log(`deleting observer for key: ${key}`);
      SharedObserver.deleteObserver(key);
    }
  }, [key]);
  
  useEffect(() => {
    console.log(`updating observer key: ${key} with dep: `, newState);
    SharedObserver.update(key, newState);
  }, [key, newState]);
}



export function useToConsumeSharedProps (key, depId) {
  const [state, setState] = useState();
  const render = useRef(({ newValue }) => {
    console.log('<<<<<< triggering re-render for key: ', key, 'depId', depId, ' with newVal: ', newValue)
    setState(newValue)
  });

  useEffect(() => {
    const updateCb = render.current;
    setTimeout(() => {
      console.log('subscribing to key: ', key, ' depId: ', depId);
      SharedObserver.subscribe({ key, depId }, updateCb);
    })
    return () => {
      console.log('unsubscribing to key: ', key, ' depId: ', depId);
      SharedObserver.unsubscribe({ key, depId }, updateCb);
    }
  }, [key, depId]);

  return state;
}