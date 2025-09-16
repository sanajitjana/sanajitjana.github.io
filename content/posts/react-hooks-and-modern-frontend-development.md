+++
title = 'React Hooks and Modern Frontend Development'
date = '2025-09-27T09:24:00+05:30'
draft = true
categories = ["Frontend"]
tags = ["React", "JavaScript", "Hooks", "Frontend", "Web Development"]
+++

# React Hooks and Modern Frontend Development

React Hooks revolutionized how we write React components. In this post, we'll explore the most important hooks and modern React patterns.

## What are React Hooks?

Hooks are functions that let you use state and other React features in functional components. They were introduced in React 16.8 to solve problems with class components.

## Essential React Hooks

### 1. useState - Managing Component State

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### 2. useEffect - Side Effects

```jsx
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data when userId changes
    fetch(`/api/users/${userId}`)
      .then(response => response.json())
      .then(data => setUser(data));

    // Cleanup function
    return () => {
      console.log('Cleanup');
    };
  }, [userId]); // Dependency array

  if (!user) return <div>Loading...</div>;

  return <div>{user.name}</div>;
}
```

### 3. useContext - Context API

```jsx
import React, { useContext, createContext } from 'react';

// Create context
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return <ThemeButton />;
}

function ThemeButton() {
  const theme = useContext(ThemeContext);
  return <button theme={theme}>Toggle Theme</button>;
}
```

### 4. useReducer - Complex State Logic

```jsx
import React, { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
}
```

## Custom Hooks

Create reusable logic with custom hooks:

```jsx
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

// Usage
function App() {
  const [name, setName] = useLocalStorage('name', 'John');

  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
}
```

## Modern React Patterns

### 1. Compound Components

```jsx
import React from 'react';

function Tabs({ children }) {
  const [activeTab, setActiveTab] = React.useState(0);

  return React.Children.map(children, (child, index) =>
    React.cloneElement(child, {
      isActive: index === activeTab,
      onClick: () => setActiveTab(index)
    })
  );
}

function Tab({ isActive, onClick, children }) {
  return (
    <button
      className={isActive ? 'active' : ''}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Usage
<Tabs>
  <Tab>Home</Tab>
  <Tab>About</Tab>
  <Tab>Contact</Tab>
</Tabs>
```

### 2. Render Props

```jsx
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    setPosition({
      x: event.clientX,
      y: event.clientY
    });
  };

  return (
    <div onMouseMove={handleMouseMove}>
      {render(position)}
    </div>
  );
}

// Usage
<MouseTracker
  render={({ x, y }) => (
    <p>The mouse position is ({x}, {y})</p>
  )}
/>
```

React Hooks have made functional components more powerful and easier to work with, enabling better code reuse and cleaner component logic.