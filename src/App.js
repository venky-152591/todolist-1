

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/users/1/todos'
      );
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTask = () => {
    if (newTask.trim() !== '') {
      const newTodo = {
        id: todos.length + 1,
        title: newTask,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setNewTask('');
    }
  };

  const toggleComplete = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  const startEditing = (id, title) => {
    setEditingTaskId(id);
    setEditingTaskTitle(title);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingTaskTitle('');
  };

  const saveEditing = (id) => {
    if (editingTaskTitle.trim() !== '') {
      editTask(id, editingTaskTitle);
      setEditingTaskId(null);
      setEditingTaskTitle('');
    }
  };

  const editTask = (id, newTitle) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, title: newTitle } : todo
    );
    setTodos(updatedTodos);
  };

  const deleteTask = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };
  const confirmCompletion = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: true } : todo
    );
    setTodos(updatedTodos);
  };

  const undoCompletion = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: false } : todo
    );
    setTodos(updatedTodos);
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      
      <div className="add-task">
        <input
          type="text"
          placeholder="Enter task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <ul>
        {todos
          .filter((todo) => !showCompleted || todo.completed)
          .map((todo) => (
            <li key={todo.id} className="task">
              {editingTaskId === todo.id ? (
                <input
                  type="text"
                  value={editingTaskTitle}
                  onChange={(e) => setEditingTaskTitle(e.target.value)}
                  onBlur={cancelEditing}
                  autoFocus
                />
              ) : (
                <span
                  className={todo.completed ? 'completed' : ''}
                  onClick={() => toggleComplete(todo.id)}
                >
                  {todo.title}
                </span>
              )}
              {editingTaskId === todo.id ? (
                <div className="edit-buttons">
                  <button onClick={() => saveEditing(todo.id)}>
                    Save
                  </button>
                  <button onClick={cancelEditing}>Cancel</button>
                </div>
              ) : (
                <div className="action-buttons">
                  <button onClick={() => startEditing(todo.id, todo.title)}>
                    Edit
                  </button>
                  <button onClick={() => deleteTask(todo.id)}>
                    Delete
                  </button>
                  {todo.completed ? (
                    <button className="undo-button" onClick={() => undoCompletion(todo.id)}>
                      Undo
                    </button>
                  ) : (
                    <button className="finish-button" onClick={() => confirmCompletion(todo.id)}>
                      Finish
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
      </ul>

      <label>
        Show Completed
        <input
          type="checkbox"
          checked={showCompleted}
          onChange={() => setShowCompleted(!showCompleted)}
        />
      </label>
    </div>
  );
}

export default App;
