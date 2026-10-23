
import { useState, useEffect } from 'react';
import FormInput from './FormInput';
import './StudentForm.css';

function StudentForm() 
{
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [gender, setGender] = useState('');
  const [course, setCourse] = useState('');
  const [address, setAddress] = useState('');

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  function handleSubmit(event)
   {
    event.preventDefault();

    const newErrors = {};

    if (name.trim() === '') {
      newErrors.name = 'Name is required';
    }

    if (email.trim() === '') {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }

    if (gender === '') {
      newErrors.gender = 'Please select gender';
    }

    if (course === '') {
      newErrors.course = 'Please select a course';
    }

    if (address.trim() === '') {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    console.log('Student Details:', {
      name,
      email,
      mobile,
      gender,
      course,
      address
    });

    setSuccess('Student registered successfully!');

    setName('');
    setEmail('');
    setMobile('');
    setGender('');
    setCourse('');
    setAddress('');
  }

  return (
    <div className="student-form-container">
      <div className="student-form-card">
        <h2>Student Registration Form</h2>

        <form onSubmit={handleSubmit} noValidate>
          <FormInput
            label="Full Name"
            name="name"
            type="text"
            value={name}
            onChange={function (e) {
              setName(e.target.value);
            }}
            error={errors.name}
            placeholder="Enter your name"
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={function (e) {
              setEmail(e.target.value);
            }}
            error={errors.email}
            placeholder="Enter your email"
          />

          <FormInput
            label="Mobile Number"
            name="mobile"
            type="tel"
            value={mobile}
            onChange={function (e) {
              setMobile(e.target.value);
            }}
            error={errors.mobile}
            placeholder="Enter your mobile number"
          />

          <div className="form-group">
            <label>Gender</label>
            <select
              value={gender}
              onChange={function (e) {
                setGender(e.target.value);
              }}
              className={errors.gender ? 'input-error' : ''}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="error-message">{errors.gender}</p>
            )}
          </div>

          <div className="form-group">
            <label>Course</label>
            <select
              value={course}
              onChange={function (e) {
                setCourse(e.target.value);
              }}
              className={errors.course ? 'input-error' : ''}
            >
              <option value="">Select Course</option>
              <option value="CSE">Computer Science</option>
              <option value="ECE">Electronics</option>
              <option value="EEE">Electrical</option>
            </select>
            {errors.course && (
              <p className="error-message">{errors.course}</p>
            )}
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              value={address}
              onChange={function (e) {
                setAddress(e.target.value);
              }}
              className={errors.address ? 'input-error' : ''}
              placeholder="Enter your address"
            />
            {errors.address && (
              <p className="error-message">{errors.address}</p>
            )}
          </div>

          <button type="submit" className="register-button">
            Register
          </button>
        </form>

        {success && (
          <p className="success-message">{success}</p>
        )}
      </div>
    </div>
  );
}

export default StudentForm;
