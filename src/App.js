import React, { useState, memo, useEffect } from 'react';

import './App.css';
import { useInterval } from './customHooks';
import { useToCreateSharedProps, useToConsumeSharedProps, disableLogger as disableSharedStateLogger } from './sharedState';

disableSharedStateLogger();

function A () {
  const a = useToConsumeSharedProps('App', 'a');
  useEffect(() => {
    console.log('re-render a: ', a);
  })
  return (<p>child: {a}</p>)
}

function B () {
  const b = useToConsumeSharedProps('App', 'b');
  useEffect(() => {
    console.log('re-render b: ', b);
  })
  return (<p>child: {b}</p>)
}

const MemoA = memo(A);
const MemoB = memo(B);

function App () {
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  useToCreateSharedProps('App', { a, b });

  useInterval(() => {
    console.log('>>>>>> trigging a: with', a + 1);
    setA(a + 1)
  }, 5000);

  useInterval(() => {
    console.log('>>>>>> trigging b: with', a + 1);
    setB(b + 1)
  }, 11000);

  return (<>
    <p>parent: a: {a} b: {b}</p>
    <MemoA />
    <MemoB />
  </>);
}

export default App;
