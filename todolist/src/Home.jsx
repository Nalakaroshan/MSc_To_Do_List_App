import React, { useEffect, useState } from "react";
import Create from './Create';
import axios from "axios";
import "./App.css";
import { BsCircleFill, BsFillCCircleFill, BsFillTrashFill, BsPencil } from 'react-icons/bs';

function Home() {
    const [todos, setTodos] = useState([]);
    const [editTask, setEditTask] = useState(null);
    const [editedText, setEditedText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Desplay all tasks
    const fetchTodos = () => {
        axios.get("http://localhost:3001/get")
            .then(result => setTodos(result.data))
            .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchTodos(); // Fetch the task list on component mount
    }, []);

    // Handle search query change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter tasks based on search query
    const filteredTodos = todos.filter(todo =>
        todo.task.toLowerCase().includes(searchQuery.toLowerCase()) // Case insensitive search
    );

    // Toggle done/undone status of a task
    const handleToggleDone = (id, doneStatus) => {
        axios.put(`http://localhost:3001/update/${id}`, { done: !doneStatus })
            .then(result => {
                const updatedTodos = todos.map(todo =>
                    todo._id === id ? { ...todo, done: !doneStatus } : todo
                );
                setTodos(updatedTodos);
            })
            .catch(err => console.log(err));
    };

    // Handle task delete
    const handleDelete = (id) => {
        axios.delete(`http://localhost:3001/delete/${id}`)
            .then(() => fetchTodos())
             alert("Task delete successfully!") // Notify user of successful addition
            .catch(err => console.log(err));
    };

    // Handle editing a task
    const handleEditClick = (todo) => {
        setEditTask(todo._id);
        setEditedText(todo.task);
    };

    // Handle updating a task
    const handleUpdate = (id) => {
        if (editedText.trim() === "") return;

        axios.put(`http://localhost:3001/edit/${id}`, { task: editedText })
            .then(result => {
                const updatedTodos = todos.map(todo =>
                    todo._id === id ? { ...todo, task: editedText } : todo
                );
                setTodos(updatedTodos);
                setEditTask(null);
                setEditedText('');
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="home">
            <h2 className="home-title">To Do List</h2>
            <Create fetchTodos={fetchTodos} />
            
            {/* Search bar */}
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                />
            </div>

            <div className="todo-list">
                {
                    filteredTodos.length === 0 ? (
                        <div className="no-records">
                            <h2>No Records</h2>
                        </div>
                    ) : (
                        filteredTodos.map((todo, index) => (
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
                                                <BsPencil className="icon" />
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