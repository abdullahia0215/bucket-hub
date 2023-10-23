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
