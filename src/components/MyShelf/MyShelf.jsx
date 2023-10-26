import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Table, Button, Input } from "reactstrap";
import axios from "axios";
import "./MyShelf.css";

export default function ShelfPage() {
  const dispatch = useDispatch();
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskValue, setEditedTaskValue] = useState("");

  // State to track clicked status of "Complete" buttons
  const [completedButtons, setCompletedButtons] = useState({});

  useEffect(() => {
    dispatch({ type: "FETCH_MY_SHELF" });
  }, []);

  const itemList = useSelector((store) => store.myItemsReducer);

  const handleAddTask = () => {
    axios
      .post("/api/myShelf", { task: newTask })
      .then(() => {
        dispatch({ type: "FETCH_MY_SHELF" });
        setNewTask("");
      })
      .catch((error) => {
        console.log("Error adding task:", error);
      });
  };

  const handleEditTask = (taskId) => {
    axios
      .put(`/api/myShelf/${taskId}`, { task: editedTaskValue })
      .then(() => {
        dispatch({ type: "FETCH_MY_SHELF" });
        setEditingTaskId(null);
        setEditedTaskValue("");
      })
      .catch((error) => {
        console.log("Error editing task:", error);
      });
  };

const handleCompleteTask = (taskId) => {
  axios
    .put(`/api/myShelf/complete/${taskId}`)
    .then(() => {
      dispatch({ type: "FETCH_MY_SHELF" });
      setCompletedButtons((prevState) => ({
        ...prevState,
        [taskId]: true,
      }));
    })
    .catch((error) => {
      console.log("Error completing task:", error);
    });
};

  const handleDeleteTask = (taskId) => {
    axios
      .delete(`/api/myShelf/${taskId}`)
      .then(() => {
        dispatch({ type: "FETCH_MY_SHELF" });
      })
      .catch((error) => {
        console.log("Error deleting task:", error);
      });
  };

  return (
    <Container className="my-shelf-container">
      <h2>My List</h2>
      <Row>
        <Col md={8} className="add-task">
          <Input
            type="text"
            placeholder="Add new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            required
          />
        </Col>
        <Col md={4}>
          <Button color="primary" onClick={handleAddTask} type="glumbo">
            Add
          </Button>
        </Col>
      </Row>

      <Table>
        <thead>
          <tr>
            <th type="myshelf-page-header">Task Name</th>
            <th type="myshelf-page-header">Complete</th>
            <th type="myshelf-page-header">Edit</th>
            <th type="myshelf-page-header">Delete</th>
          </tr>
        </thead>
        <tbody>
          {itemList.map((item, index) => {
            const isCompleted = completedButtons[item.id] || false;
            return (
              <tr
                key={item.id || index}
                className={isCompleted ? "completed-row" : ""}
              >
                <td type="myshelf-page-body">
                  {editingTaskId === item.id ? (
                    <>
                      <Input
                        type="text"
                        value={editedTaskValue}
                        onChange={(e) => setEditedTaskValue(e.target.value)}
                      />
                      <Button
                        color="primary"
                        onClick={() => handleEditTask(item.id)}
                        type="save"
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <>{item.task}</>
                  )}
                </td>
                <td type="myshelf-page-body">
                  <Button
                    type="glumbo"
                    color="primary"
                    onClick={() => handleCompleteTask(item.id)}
                    id="complete"
                  >
                    Complete
                  </Button>
                </td>
                <td type="myshelf-page-body">
                  {editingTaskId !== item.id && (
                    <Button
                      color="primary"
                      onClick={() => setEditingTaskId(item.id)}
                      type="glumbo"
                    >
                      Edit
                    </Button>
                  )}
                </td>
                <td type="myshelf-page-body">
                  <Button
                    color="primary"
                    onClick={() => handleDeleteTask(item.id)}
                    type="glumbo"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}
