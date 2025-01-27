// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const App = () => {
//   const [tasks, setTasks] = useState([]);
//   const [newTask, setNewTask] = useState("");

//   const fetchTasks = async () => {
//     const response = await axios.get("http://localhost:5004/tasks");
//     setTasks(response.data);
//   };

//   const addTask = async () => {
//     if (!newTask) return;
//     const response = await axios.post("http://localhost:5004/tasks", {
//       title: newTask,
//     });
//     setTasks([...tasks, response.data]);
//     setNewTask("");
//   };

//   const toggleComplete = async (id, completed) => {
//     const response = await axios.put(`http://localhost:5004/tasks/${id}`, {
//       completed: !completed,
//     });
//     setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
//   };

//   const deleteTask = async (id) => {
//     await axios.delete(`http://localhost:5004/tasks/${id}`);
//     setTasks(tasks.filter((task) => task._id !== id));
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 p-5">
//       <div className="max-w-md mx-auto bg-white rounded shadow p-5">
//         <h1 className="text-2xl font-bold mb-5">To-Do List</h1>
//         <div className="flex mb-5">
//           <input
//             type="text"
//             value={newTask}
//             onChange={(e) => setNewTask(e.target.value)}
//             className="border rounded-l px-3 py-2 flex-grow"
//             placeholder="Add a new task"
//           />
//           <button
//             onClick={addTask}
//             className="bg-blue-500 text-white px-4 py-2 rounded-r"
//           >
//             Add
//           </button>
//         </div>
//         <ul>
//           {tasks.map((task) => (
//             <li
//               key={task._id}
//               className="flex justify-between items-center mb-3 p-2 border rounded"
//             >
//               <div
//                 onClick={() => toggleComplete(task._id, task.completed)}
//                 className={`cursor-pointer ${
//                   task.completed ? "line-through text-gray-500" : ""
//                 }`}
//               >
//                 {task.title}
//               </div>
//               <button
//                 onClick={() => deleteTask(task._id)}
//                 className="text-red-500"
//               >
//                 Completed
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default App;

import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5004/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Add a new task
  const addTask = async () => {
    if (!newTask) return;
    try {
      const response = await axios.post("http://localhost:5004/tasks", {
        title: newTask,
      });
      setTasks([...tasks, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Edit a task
  const editTask = (id, title) => {
    setEditTaskId(id);
    setEditTaskTitle(title);
  };

  // Save edited task
  const saveTask = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5004/tasks/${id}`, {
        title: editTaskTitle,
      });
      setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
      setEditTaskId(null);
      setEditTaskTitle("");
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  // Toggle task completion
  const toggleComplete = async (id, completed) => {
    try {
      const response = await axios.put(`http://localhost:5004/tasks/${id}`, {
        completed: !completed,
      });
      setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5004/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-md mx-auto bg-white rounded shadow p-5">
        <h1 className="text-3xl font-bold mb-5 text-center text-gray-700">
          To-Do List
        </h1>

        {/* Add Task */}
        <div className="flex mb-5">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="border rounded-l px-3 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Add a new task"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r transition-all duration-200"
          >
            Add
          </button>
        </div>

        {/* Pending Tasks */}
        <h2 className="text-xl font-semibold mb-3 text-gray-700">
          Pending Tasks
        </h2>
        <ul>
          {tasks
            .filter((task) => !task.completed)
            .map((task) => (
              <li
                key={task._id}
                className="flex justify-between items-center mb-3 p-2 border rounded hover:bg-gray-100 transition-all duration-200"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task._id, task.completed)}
                    className="mr-3"
                  />
                  {editTaskId === task._id ? (
                    <input
                      type="text"
                      value={editTaskTitle}
                      onChange={(e) => setEditTaskTitle(e.target.value)}
                      className="border px-2 py-1 rounded flex-grow"
                    />
                  ) : (
                    <div className="text-gray-800">{task.title}</div>
                  )}
                </div>
                <div className="flex space-x-2">
                  {editTaskId === task._id ? (
                    <button
                      onClick={() => saveTask(task._id)}
                      className="text-green-500 hover:text-green-600"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => editTask(task._id, task.title)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
        </ul>

        {/* Completed Tasks */}
        <h2 className="text-xl font-semibold mt-5 mb-3 text-gray-700">
          Completed Tasks
        </h2>
        <ul>
          {tasks
            .filter((task) => task.completed)
            .map((task) => (
              <li
                key={task._id}
                className="flex justify-between items-center mb-3 p-2 border rounded bg-gray-50"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task._id, task.completed)}
                    className="mr-3"
                  />
                  <div className="line-through text-gray-500">{task.title}</div>
                </div>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
