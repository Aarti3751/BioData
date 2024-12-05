// Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link to navigate
import './Profile.css';

const Profile = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('http://localhost:4000/profiles');
        setProfiles(response.data);
      } catch (error) {
        console.error('Error fetching profiles', error);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <Container className="profile-container">
      <h1 className="text-center">All Profiles</h1>
      <Row>
        {profiles.length > 0 ? (
          profiles.map((profile, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={
                    profile.photo
                      ? `http://localhost:4000/${profile.photo.replace(/\\/g, '/')}`
                      : "http://localhost:4000/uploads/default-avatar.png"
                  }
                  alt={profile.name}
                />
                <Card.Body>
                  <Card.Title>{profile.name}</Card.Title>
                  <Card.Text>
                    <strong>Date of Birth:</strong> {profile.dateOfBirth}
                    <br />
                    <strong>Place of Birth:</strong> {profile.placeOfBirth}
                    <br />
                    <strong>Time of Birth:</strong> {profile.timeOfBirth}
                    <br />
                    <strong>Rashi:</strong> {profile.rashi}
                    <br />
                  </Card.Text>
                  <Link to={`/profile/${profile._id}`}>
                    <Button variant="primary">View Details</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="no-profiles text-center">No profiles available</p>
        )}
      </Row>
    </Container>
  );
};

export default Profile;
