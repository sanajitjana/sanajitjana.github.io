+++
title = 'Mobile App Development with React Native'
date = '2025-10-25T09:28:00+05:30'
draft = true
categories = ["Mobile"]
tags = ["React Native", "Mobile Development", "JavaScript", "iOS", "Android"]
+++

# Mobile App Development with React Native

React Native enables building native mobile apps using JavaScript and React. In this post, we'll explore the fundamentals and best practices for React Native development.

## What is React Native?

React Native is a framework for building native mobile applications using JavaScript and React. It allows you to write code once and deploy to both iOS and Android platforms.

## Setting Up a React Native Project

```bash
# Install React Native CLI
npm install -g @react-native-community/cli

# Create new project
npx react-native init MyApp

# Or with Expo (easier setup)
npx create-expo-app MyApp

# Start development server
cd MyApp
npm start
```

## Core Components

### Basic Components
```jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to React Native!</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Press Me</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
```

### State Management with Hooks
```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList } from 'react-native';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');

  const addTodo = () => {
    if (inputText.trim()) {
      setTodos([...todos, {
        id: Date.now().toString(),
        text: inputText,
        completed: false
      }]);
      setInputText('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 10,
          borderRadius: 5
        }}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Add a todo..."
        onSubmitEditing={addTodo}
      />

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleTodo(item.id)}
            style={{
              padding: 15,
              marginVertical: 5,
              backgroundColor: item.completed ? '#e0e0e0' : '#fff',
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#ddd'
            }}
          >
            <Text style={{
              textDecorationLine: item.completed ? 'line-through' : 'none',
              fontSize: 16
            }}>
              {item.text}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default TodoApp;
```

## Navigation

### React Navigation Setup
```bash
npm install @react-navigation/native
npm install @react-navigation/stack
npm install @react-navigation/bottom-tabs
```

```jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Details')}
        style={{ marginTop: 20, padding: 10, backgroundColor: '#007AFF' }}
      >
        <Text style={{ color: 'white' }}>Go to Details</Text>
      </TouchableOpacity>
    </View>
  );
}

function DetailsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
```

## API Integration

### Fetch API
```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{
          padding: 15,
          marginVertical: 5,
          marginHorizontal: 10,
          backgroundColor: '#fff',
          borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
          <Text style={{ color: '#666' }}>{item.email}</Text>
          <Text style={{ color: '#666' }}>{item.phone}</Text>
        </View>
      )}
    />
  );
};

export default UserList;
```

## Platform-Specific Code

```jsx
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        backgroundColor: '#f8f8f8',
      },
      android: {
        backgroundColor: '#fff',
      },
    }),
  },
  text: {
    ...Platform.select({
      ios: {
        fontFamily: 'Helvetica',
        fontSize: 16,
      },
      android: {
        fontFamily: 'Roboto',
        fontSize: 14,
      },
    }),
  },
});

// Platform-specific file extensions
// Component.android.js - Android specific
// Component.ios.js - iOS specific
```

## Performance Optimization

### Memoization
```jsx
import React, { memo, useMemo, useCallback } from 'react';

const TodoItem = memo(({ todo, onToggle }) => {
  console.log('TodoItem rendered:', todo.id);

  return (
    <TouchableOpacity
      onPress={() => onToggle(todo.id)}
      style={{
        padding: 15,
        marginVertical: 5,
        backgroundColor: todo.completed ? '#e0e0e0' : '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd'
      }}
    >
      <Text style={{
        textDecorationLine: todo.completed ? 'line-through' : 'none'
      }}>
        {todo.text}
      </Text>
    </TouchableOpacity>
  );
});

const TodoList = ({ todos }) => {
  const completedCount = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  const handleToggle = useCallback((id) => {
    // Toggle logic here
  }, []);

  return (
    <View>
      <Text>Completed: {completedCount}/{todos.length}</Text>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
        />
      ))}
    </View>
  );
};
```

## Testing

### Jest and React Native Testing Library
```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native
```

```jsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Counter from './Counter';

describe('Counter', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Counter />);
    expect(getByText('Count: 0')).toBeTruthy();
  });

  it('increments count when button is pressed', () => {
    const { getByText } = render(<Counter />);
    const button = getByText('Increment');

    fireEvent.press(button);
    expect(getByText('Count: 1')).toBeTruthy();
  });
});
```

## Deployment

### Build and Release
```bash
# For Android
cd android
./gradlew assembleRelease

# For iOS (on macOS)
cd ios
pod install
xcodebuild -workspace MyApp.xcworkspace -scheme MyApp -configuration Release -sdk iphoneos -archivePath ./build/MyApp.xcarchive archive

# Using Expo
expo build:android
expo build:ios
```

## Best Practices

1. **Use TypeScript**: Better type safety and developer experience
2. **Follow React Native Style Guide**: Consistent code structure
3. **Optimize Images**: Use appropriate image sizes and formats
4. **Handle Permissions Properly**: Request and handle device permissions
5. **Test on Real Devices**: Don't rely only on simulators/emulators
6. **Keep Dependencies Updated**: Regular security and performance updates
7. **Use Fast Refresh**: Leverage hot reloading for faster development
8. **Implement Error Boundaries**: Graceful error handling

React Native provides a powerful way to build cross-platform mobile applications with a single codebase, making it an excellent choice for modern mobile development.