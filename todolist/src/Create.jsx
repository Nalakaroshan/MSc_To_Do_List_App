import React, { useState } from "react";
import axios from "axios";

function Create({ fetchTodos }) {  // Receive fetchTodos function as a prop
    const [task, setTask] = useState(""); // Initialize task state with an empty string

    const handleAdd = () => {
        if (task.trim() === "") {
            alert("Task cannot be empty!"); // Validation for empty task
            return;
        }
        axios.post("http://localhost:3001/add", { task: task })
            .then(result => {
                console.log(result);
                alert("Task added successfully!"); // Notify user of successful addition
                fetchTodos(); // Fetch the updated task list
                setTask(""); // Clear the input field after successful submission
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="create_from">
            <input
                type="text"
                name="task"
                id="task"
                placeholder="Enter Task"
                value={task} // Bind input field value to state
                onChange={(e) => setTask(e.target.value)} // Update state on input change
            />
            <button type="button" onClick={handleAdd}>Add</button>
        </div>
    );
}

export default Create;
