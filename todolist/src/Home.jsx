import React, { useEffect, useState } from "react";
import Create from './Create';
import axios from "axios";
import "./App.css";
import { BsCircleFill, BsFillCCircleFill, BsFillTrashFill, BsPencil } from 'react-icons/bs'; // Add pencil icon

function Home() {
    const [todos, setTodos] = useState([]);
    const [editTask, setEditTask] = useState(null); // State to track the task being edited
    const [editedText, setEditedText] = useState(''); // State for the new task text

    // Fetch todos from the server
    const fetchTodos = () => {
        axios.get("http://localhost:3001/get")
            .then(result => setTodos(result.data))
            .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchTodos(); // Fetch the task list on component mount
    }, []);

    // Toggle done/undone status of a task
    const handleToggleDone = (id, doneStatus) => {
        axios.put(`http://localhost:3001/update/${id}`, { done: !doneStatus })
            .then(result => {
                const updatedTodos = todos.map(todo =>
                    todo._id === id ? { ...todo, done: !doneStatus } : todo
                );
                setTodos(updatedTodos); // Update state to re-render
            })
            .catch(err => console.log(err));
    };

    // Handle task delete
    const handleDelete = (id) => {
        axios.delete(`http://localhost:3001/delete/${id}`)
            .then(() => fetchTodos())
            .catch(err => console.log(err));
    };

    // Handle editing a task
    const handleEditClick = (todo) => {
        setEditTask(todo._id); // Set the task being edited
        setEditedText(todo.task); // Set the current text of the task to be edited
    };

    // Handle updating a task
    const handleUpdate = (id) => {
        if (editedText.trim() === "") return; // Don't update if the input is empty

        axios.put(`http://localhost:3001/update/${id}`, { task: editedText })
            .then(result => {
                // Update the task in the todos state
                const updatedTodos = todos.map(todo =>
                    todo._id === id ? { ...todo, task: editedText } : todo
                );
                setTodos(updatedTodos);
                setEditTask(null); // Clear the editing state
                setEditedText(''); // Clear the edited text input
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="home">
            <h2 className="home-title">To Do List</h2>
            <Create fetchTodos={fetchTodos} /> {/* Pass fetchTodos function to Create */}
            <div className="todo-list">
                {
                    todos.length === 0 ? (
                        <div className="no-records">
                            <h2>No Records</h2>
                        </div>
                    ) : (
                        todos.map((todo, index) => (
                            <div className="todo-item" key={index}>
                                <div className="task">
                                    <div className="checkbox" onClick={() => handleToggleDone(todo._id, todo.done)}>
                                        {todo.done ? (
                                            <BsFillCCircleFill className="icon" />
                                        ) : (
                                            <BsCircleFill className="icon" />
                                        )}
                                        <p className={todo.done ? "line-through" : ""}>{todo.task}</p>
                                    </div>

                                    {editTask === todo._id ? (
                                        <div className="edit-task">
                                            <input
                                                type="text"
                                                value={editedText}
                                                onChange={(e) => setEditedText(e.target.value)}
                                            />
                                            <button onClick={() => handleUpdate(todo._id)}>Update</button>
                                        </div>
                                    ) : (
                                        <div className="button-container">
                                            <button className="update-btn" onClick={() => handleEditClick(todo)}>
                                                <BsPencil className="icon" /> {/* Pencil icon for editing */}
                                            </button>
                                            <button className="delete-btn" onClick={() => handleDelete(todo._id)}>
                                                <BsFillTrashFill className="icon" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )
                }
            </div>
        </div>
    );
}

export default Home;
