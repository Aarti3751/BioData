
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // To get the ID from URL
import { Button, Container, Card } from 'react-bootstrap';
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation

const ProfileDetails = () => {
  const { id } = useParams(); // Get the profile ID from the URL
  const [profile, setProfile] = useState(null);
  const [imageData, setImageData] = useState(null); // State to store the image data

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/profiles/${id}`);
        setProfile(response.data);
        
        // Fetching the profile's image (using `axios` to get the image as base64)
        if (response.data.photo) {
          const imageUrl = `http://localhost:4000/${response.data.photo.replace(/\\/g, '/')}`;
          
          // Get the image as a blob, convert to base64
          const imageResponse = await axios.get(imageUrl, { responseType: 'blob' });
          const reader = new FileReader();
          
          reader.onloadend = () => {
            setImageData(reader.result); // Base64 string will be available here
          };

          reader.readAsDataURL(imageResponse.data);
        }
      } catch (error) {
        console.error('Error fetching profile details', error);
      }
    };

    fetchProfile();
  }, [id]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");

    // Add profile text information
    doc.text(`Name: ${profile.name}`, 20, 20);
    doc.text(`Date of Birth: ${profile.dateOfBirth}`, 20, 30);
    doc.text(`Place of Birth: ${profile.placeOfBirth}`, 20, 40);
    doc.text(`Time of Birth: ${profile.timeOfBirth}`, 20, 50);
    doc.text(`Rashi: ${profile.rashi}`, 20, 60);
    doc.text(`Height: ${profile.height}`, 20, 70);
    doc.text(`Education: ${profile.education}`, 20, 80);
    doc.text(`Salary: ${profile.salary}`, 20, 90);
    doc.text(`Contact No: ${profile.contactNo}`, 20, 100);

    // If there's an image, add it to the PDF
    if (imageData) {
      // Adding image as base64
      doc.addImage(imageData, 'JPEG', 150, 20, 40, 40); // Adjust the position and size as needed
    }

    doc.save(`${profile.name}_Biodata.pdf`);
  };

  return (
    <Container className="mt-5">
      {profile ? (
        <Card>
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
              <strong>Height:</strong> {profile.height}
              <br />
              <strong>Education:</strong> {profile.education}
              <br />
              <strong>Salary:</strong> {profile.salary}
              <br />
              <strong>Contact No:</strong> {profile.contactNo}
            </Card.Text>
            <Button variant="primary" onClick={generatePDF}>
              Download PDF
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <p>Loading profile...</p>
      )}
    </Container>
  );
};

export default ProfileDetails;
