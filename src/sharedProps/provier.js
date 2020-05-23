import { useEffect, useRef, useState } from 'react';
import SharedObserver from './observerProps';


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
  const render = useRef(({ newValue }) => setState(newValue));

  useEffect(() => {
    const updateCb = render.current;
    setTimeout(() => {
      console.log('subscribing to key: ', key, ' depId: ', depId, ' with cb: ', updateCb);
      SharedObserver.subscribe({ key, depId }, updateCb);
    })
    return () => {
      console.log('unsubscribing to key: ', key, ' depId: ', depId, ' with cb: ', updateCb);
      SharedObserver.unsubscribe({ key, depId }, updateCb);
    }
  }, [key, depId]);

  return state;
}