import React, { useEffect, useState } from "react";
import axios from "axios";
import { connect } from "react-redux"; // Import the connect function

function GroupList(props) {
  const [groups, setGroups] = useState([]);

  const userId = props.user.id; // Access the user's ID from props

  useEffect(() => {
    axios
      .get("/api/groups")
      .then((response) => {
        setGroups(response.data);
      })
      .catch((error) => {
        console.error("Error fetching groups:", error);
      });
  }, []);

  const handleJoinGroup = async (groupId) => {
    // Ensure userId is defined and accessible
    const userId = props.userId;  // Assuming userId is passed as a prop
  
    // Check if the user is already in a group before making the API call
    if (group && group.id === groupId) {
      alert("You are already in this group.");
      return;
    }
  
    const url = `/api/groups/join/${groupId}`;
    try {
      const response = await axios.put(url, { userId });
  
      console.log("Joined the group successfully!");
  
      // Dispatch the SET_GROUP action with the joined group's details
      const joinedGroup = { id: groupId, ...response.data };
      props.dispatch({ type: "SET_GROUP", payload: joinedGroup });
  
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Error message from server:", error.response.data);
      }
      console.error("Error joining the group:", error);
    }
  };
  

  return (
    <div>
      <h2>Groups</h2>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            {group.group_name}
            <button onClick={() => handleJoinGroup(group.id)}>Join</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user, // Map the user data from Redux state to props
});

export default connect(mapStateToProps)(GroupList); // Connect the component to the Redux store
