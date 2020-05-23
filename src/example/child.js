import { useToConsumeSharedProps } from '../sharedState';
import React, { useEffect, memo } from 'react';

function DisplayCounter ({ counterId }) {
  let counter = useToConsumeSharedProps('App', `counter${counterId}`); // this is where the magic happens.
  useEffect(() => {
    console.log(`<< re-render counter${counterId}: `, counter );
  })
  return (<p>counter{counterId}: {counter}</p>)
}


const Display = () => (
  <>
    <DisplayCounter counterId={1} />
    <DisplayCounter counterId={2} />
    <DisplayCounter counterId={3} />
  </>
)
/**
 * Since parent is getting updated by setInterval child will re-render since function components aren't pure by default.
 * Hence we are stopping it with memo
 * */ 
const MemoizedDisplay = memo(Display);
export default MemoizedDisplay;
