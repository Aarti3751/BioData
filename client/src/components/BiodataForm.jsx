import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns'; // Importing date-fns to format time

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './Biodata.css'; // Import custom CSS file

const BiodataForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: null,
    placeOfBirth: '',
    timeOfBirth: '', // Default time
    rashi: '',
    height: '',
    education: '',
    salary: '',
    contactNo: ''
  });

  const [photo, setPhoto] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert to 12-hour format (e.g., 12:00 AM)
    const formattedTime = format(new Date(`1970-01-01T${formData.timeOfBirth}:00`), 'hh:mm a');

    const form = new FormData();
    form.append('name', formData.name);
    form.append('dateOfBirth', formData.dateOfBirth.toLocaleDateString('en-GB')); // Format as DD-MM-YYYY
    form.append('placeOfBirth', formData.placeOfBirth);
    form.append('timeOfBirth', formattedTime); // Use formatted time
    form.append('rashi', formData.rashi);
    form.append('height', formData.height);
    form.append('education', formData.education);
    form.append('salary', formData.salary);
    form.append('contactNo', formData.contactNo);
    if (photo) form.append('photo', photo);

    try {
      const response = await axios.post('http://localhost:4000/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log(response.data);
      setAlertMessage('Biodata uploaded successfully!');
      setAlertType('success');
    } catch (error) {
      console.error('Error uploading biodata', error);
      setAlertMessage('Error uploading biodata');
      setAlertType('danger');
    }
  };

  return (
    <Container className="mt-5 biodata-form-container">
      <h1 className="text-center mb-4">Biodata Form</h1>

      {alertMessage && (
        <Alert variant={alertType} onClose={() => setAlertMessage(null)} dismissible>
          {alertMessage}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Control
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={6}>
            <DatePicker
              selected={formData.dateOfBirth}
              onChange={(date) => setFormData({ ...formData, dateOfBirth: date })}
              dateFormat="dd-MM-yyyy"
              className="form-control"
              placeholderText="DD-MM-YYYY"
              required
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Control
              type="text"
              name="placeOfBirth"
              placeholder="Place of Birth"
              value={formData.placeOfBirth}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={6}>
            <Form.Control
              type="time" // Use time input for birth time
              name="timeOfBirth"
              value={formData.timeOfBirth}
              onChange={handleChange}
              placeholder="Time of Birth"
              className="form-control"
              required
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Control
              type="text"
              name="rashi"
              placeholder="Rashi"
              value={formData.rashi}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={6}>
            <Form.Control
              type="text"
              name="height"
              placeholder="Height"
              value={formData.height}
              onChange={handleChange}
              required
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Control
              type="text"
              name="education"
              placeholder="Education"
              value={formData.education}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={6}>
            <Form.Control
              type="text"
              name="salary"
              placeholder="Salary"
              value={formData.salary}
              onChange={handleChange}
              required
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Control
              type="text"
              name="contactNo"
              placeholder="Contact No"
              value={formData.contactNo}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={6}>
            <Form.Control type="file" name="photo" onChange={handleFileChange} />
          </Col>
        </Row>

        <Button variant="primary" type="submit" className="w-100">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default BiodataForm;
