import React from 'react';
import './AboutPage.css';
import { Container, Row, Col } from 'reactstrap';

function About() {
  return (
    <Container>
      <Row>
        <Col>
          <h2 className="about-heading">What Is BucketHub?</h2>
          <p className="about-text">BucketHub is a group task tracker where you can create, share, and combine your wildest dreams and bucket list adventures with your pals or for yourself. Whether it's climbing a mountain, going on a skiing trip, or skydiving we're your planning partner!</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="about-heading">Why Did I Create BucketHub?</h2>
          <p className="about-text">I always wanted to create a way to provide my friend group with a way of tracking milestones that we've always wanted to hit together. BucketHub is the culmination of that dream.</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="about-heading">How Do I Use It?</h2>
          <p className="about-text">Click the Brigades tab to see all of the available Brigades that you can join. Make sure you join the right Brigade, but if you join the wrong one you can just press "Leave Brigade" to go back and join a new one. once you're on the right Brigade, you can add, complete, and edit bucket list items with your friends! You also have a personal bucket list that you can add to or edit on your own, your secret is safe!</p>
        </Col>
      </Row>
    </Container>
  );
}

export default About;