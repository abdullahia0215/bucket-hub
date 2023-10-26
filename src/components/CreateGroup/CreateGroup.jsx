import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './CreateGroup.css';
import { useDispatch } from 'react-redux';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';

function CreateGroup() {
  const [groupName, setGroupName] = useState('');
  const [userID, setUserID] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get('/api/user')
      .then((response) => {
        console.log('User ID:', response.data.id);
        setUserID(response.data.id);
      })
      .catch((error) => {
        console.error('Error fetching user ID:', error);
      });
  }, []);

  console.log('userID:', userID);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .get('/api/groups/check')
      .then((response) => {
        if (response.data.hasCreatedGroup) {
          alert('You can only be in 1 group! Please leave your current group before creating a new one.');
        } else {
          const groupData = {
            group_name: groupName,
            user_id: userID,
            admin: true,
            creator_id: userID,
          };

          axios
            .post('/api/createGroup', groupData)
            .then((response) => {
              dispatch({ type: 'SET_GROUP', payload: { id: response.data.id } });
              console.log('Group and user group created successfully:', response.data);
              // Redirect to a success page or do something else
            })
            .catch((error) => {
              console.error('Error creating group and user group:', error);
            });
        }
      })
      .catch((error) => {
        console.error("Error checking user's group:", error);
      });
  };

  return (
    <Container>
      <Row>
        <Col md={{ size: 6, offset: 3 }}>
          <h2>Create a New Brigade</h2>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="groupName">Brigade Name:</Label>
              <Input
                type="text"
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Button color="primary" type="submit">
                Create Brigade
              </Button>
            </FormGroup>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateGroup;
