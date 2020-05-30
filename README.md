# Problem
Flags such as `isOpened, toBeShown, wasXChanged, isXValid, isDataProperToFetch and whatever you name it` plays a major role in development process and there are times where I hit a point to nest these flags 3 to 4 component  throughout the tree sad truth is all connected components re-renders.

# Existing Solutions
Resolving nested props requires either of 
 - flux based architecture such as [redux](https://redux.js.org/), [mobx](https://mobx.js.org/README.html)
 - sharing the react state with context
 - [Using composition to avoid props drilling](https://www.youtube.com/watch?v=3XaXKiXtNjw&feature=emb_title)

## Problems
### flux based architecture
one linear: `you are affecting the whole store`

IMHO, one can put anything in store but take a step back and question how many places you need to refactors before shipping a single state to store especially in hooks. 
To name a few
- look for dependency
- create reducer(s)
- updating mapStateToProps
- updating corresponding parts of the component 
- rewriting hooks to call a function in mapDispatchToProps


### Sharing the react state with context
Works fine expect it re-render consumers for unnecessary state updates
```
const AppContext = createContext();
Parent = () => {
  const [flags, setFlags] = useState({a: 1, b: 2});
  const [timeOfMount, setToM] = useState();
  useEffect(() => setToM(new Date()), [])
  return (
    <>
      // renders values are only for single `setFlags` and does not include mounting phase
      <p>{timeOfMount}</p> // renders onces
      <AppContext.Provider value=flags>
        <Child> // renders twice and also for `setToM`
      </AppContext.Provider>
    </>
  )
}
```

Besides it re-renders for unnecessary state; update a single change(such as key `a`) in context value triggers re-renders in all the child component which also a wasted render

### Using composition to avoid props drilling
Yea it works again refactoring matters and the same problem with context follows


# My Idea
Create a observer whenever you want to share your state and listen to the changes in the consumer. 

## Example
```
import { useToCreateSharedProps, useToConsumeSharedProps } from 'shared-state';
const Parent = () => {
    const [counter1, setCounter1] = useState(1);
    const [counter2, setCounter2] = useState(1);

      useToCreateSharedProps('Parent', {
        counter1, counter2,
      });
      return (
        <>
          <MemoCounter id=1 /> // you can go with dynamic ids as well
          <MemoCounter id=2 />
        </>
      )
}

const Counter = ({ id }) => {
  let counter = useToConsumeSharedProps('Parent', `counter${id}`);
  return(<p>Counter1: {counter1}<p/>)
}
const MemoCounter = React.memo(Counter); // since counter is not a part of props we don't need this component to re-render
```


## How it works

`useToCreateSharedProps` create a object with an ability to track changed values and update the corresponding observer which are added with `useToConsumeSharedProps`. This library uses `===` to check if something has changed. So read bonus tip for custom part of `useToConsumeSharedProps`

For eg: 
`useToCreateSharedProps('key', {counter1, counter2});` create a sharedStateManager object. 
`useToConsumeSharedProps('key', 'counter1');` create a listener for `counter1`. First Parameter `key` lets you to use same object names `counter1` for different parts of the react tree (basically to avoid conflicts of using same flag name such as `isOpened` and all those). But since you are sharing the your state you have to be descriptive with what was `isOpened` referring to, or you could go wild with `useToCreateSharedProps('TopHeaderDropBox', {isOpened});` which ever approach works fine for  you.

## Bonus Tip
Third arg of `useToConsumeSharedProps` accepts a callback. If it returns true the consumer will be updated.
```
const user = {
  id1: {
    name: 'harry potter',
    canCastSpellOutsideSchool: false
  }
  id2: {
    name: 'George Weasley',
    canCastSpellOutsideSchool: true
  }
}
useToCreateSharedProps('Magicians', {users}); // in the sharing part
const updateOnlyIfUserAdds = (oldVal, newVal) => Object.keys(oldVal).length !== Object.keys(newVal).length
const userList = useToConsumeSharedProps('Magicians', 'users', updateOnlyIfUserAdds)
```