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
          <h2 className="about-heading">Why I created BucketHub?</h2>
          <p className="about-text">I always wanted to create a way to provide my friend group with a way of tracking milestones that we've always wanted to hit, it's like a progress tracker!</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="about-heading">How Do I Use It?</h2>
          <p className="about-text">Simply click the My List tracker to access your personal list to add or view your goals or click the Group List to do the same! Only you can add to your personal list, but everyone can add to the group list</p>
        </Col>
      </Row>
    </Container>
  );
}

export default About;