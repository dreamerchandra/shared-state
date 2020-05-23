import React, { useState, createRef, useRef, memo } from 'react';

import './App.css';
import { useInterval } from './customHooks';
import { useToCreateSharedProps, useToConsumeSharedProps } from './sharedProps';

function A () {
  const a = useToConsumeSharedProps('App', 'a');
  console.log('a: ', a);
  return (<p>child: {a}</p>)
}

const MemoA = memo(A);

function App () {
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  useToCreateSharedProps('App', { a, b });

  useInterval(() => {
    setA(a + 1)
  }, 2000);

  return (<>
    <p>parent: {a}</p>
    <MemoA />
  </>);
}

export default App;
