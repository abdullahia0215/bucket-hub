import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';

export default function ShelfPage() {
  const dispatch = useDispatch();
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskValue, setEditedTaskValue] = useState('');
  
  // State to track clicked status of "Complete" buttons
  const [completedButtons, setCompletedButtons] = useState({});

  useEffect(() => {
    dispatch({ type: "FETCH_MY_SHELF" });
  }, []);

  const itemList = useSelector((store) => store.myItemsReducer);

  const handleAddTask = () => {
    axios.post('/api/myShelf', { task: newTask })
        .then(() => {
            dispatch({ type: "FETCH_MY_SHELF" });
            setNewTask('');
        })
        .catch(error => {
            console.log('Error adding task:', error);
        });
  }

  const handleEditTask = (taskId) => {
    axios.put(`/api/myShelf/${taskId}`, { task: editedTaskValue })
        .then(() => {
            dispatch({ type: "FETCH_MY_SHELF" });
            setEditingTaskId(null);
            setEditedTaskValue('');
        })
        .catch(error => {
            console.log('Error editing task:', error);
        });
  }

  const handleCompleteTask = (taskId) => {
    axios.put(`/api/myShelf/complete/${taskId}`)
        .then(() => {
            dispatch({ type: "FETCH_MY_SHELF" });
            setCompletedButtons(prevState => ({
              ...prevState,
              [taskId]: true,
            }));
        })
        .catch(error => {
            console.log('Error completing task:', error);
        });
  }

  const handleDeleteTask = (taskId) => {
    axios.delete(`/api/myShelf/${taskId}`)
        .then(() => {
            dispatch({ type: "FETCH_MY_SHELF" });
        })
        .catch(error => {
            console.log('Error deleting task:', error);
        });
  }

  return (
    <div className="container">
      <h2>My List</h2>
      <input
        type="text"
        placeholder="Add new task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={handleAddTask}>Add</button>
      <ul>
        {itemList.map((item, index) => {
          return (
            <li key={item.id || index}>
              {editingTaskId === item.id ? (
                <>
                  <input
                    type="text"
                    value={editedTaskValue}
                    onChange={(e) => setEditedTaskValue(e.target.value)}
                  />
                  <button onClick={() => handleEditTask(item.id)}>Save</button>
                </>
              ) : (
                <>
                  {item.task}
                  <button
                    onClick={() => handleCompleteTask(item.id)}
                    style={{
                      backgroundColor: completedButtons[item.id] ? 'green' : 'white',
                    }}
                  >
                    Complete
                  </button>
                  <button onClick={() => setEditingTaskId(item.id)}>Edit</button>
                  <button onClick={() => handleDeleteTask(item.id)}>Delete</button>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );  
}
