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
  const [flags, setflags] = uS({a: 1, b: 2});
  const [timeOfMount, setToM] = us();
  useEffect(() => setToM(new Date()), [])
  return (
    <AppContext.Provider value=flags>
      <Child> // Will child component re-render for setCDM ?
    </AppContext.Provider>
  )
}
```

### Using composition to avoid props drilling
Yea it works again refactoring matters and the same problem with context follows


# My Idea
Create a observer whenever you want to share your state and listen to the changes in the consumer. 

# 