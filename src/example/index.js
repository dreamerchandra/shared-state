import React, { useState} from 'react';
import { useInterval } from './customHooks';
import { useToCreateSharedProps } from 'shared-state';
import Display from './child';


const incrementCounter = (preVal) => preVal + 1;
const divideCounterBy = (counter, n) => counter / n;

function App () {
  const [counter1, setCounter1] = useState(1);
  const [counter2, setCounter2] = useState(1);
  
  
  useToCreateSharedProps('App', {
    counter1, counter2,
    counter3:  divideCounterBy(counter2, 2),
  });


  useInterval(() => {
    console.log('>> changing the value of counter to: ', counter1 + 1);
    setCounter1(incrementCounter)
  }, 2000);

  useInterval(() => {
    console.log('>> changing the value of counter to: ', counter2 + 1);
    setCounter2(incrementCounter)
  }, 3000);

  return (<>
    <p>parent: counter1: {counter1} counter2: {counter2} counter 3: {divideCounterBy(2)}</p>
    <Display /> {/**remember we aren't passing any prop*/}
    counter 3 is not a part of state
  </>);
}

export default App;
