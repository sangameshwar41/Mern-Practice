
import { useEffect, useState } from 'react';
import FormInput from './FormInput';
import {
    createStudent,
    getStudentById,
    updateStudent
} from '../api/studentApi';
import './StudentForm.css';

function StudentForm({ studentId, onUpdateSuccess }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [gender, setGender] = useState('');
    const [course, setCourse] = useState('');
    const [address, setAddress] = useState('');

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    useEffect(function () {
        async function fetchStudent() {
            if (!studentId) {
                return;
            }

            try {
                setLoading(true);
                setApiError('');
                setSuccess('');

                const result = await getStudentById(studentId);
                const student = result.data;

                setName(student.fullName);
                setEmail(student.email);
                setMobile(student.mobileNumber);
                setGender(student.gender);
                setCourse(student.course);
                setAddress(student.address);
            } catch (error) {
                setApiError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchStudent();
    }, [studentId]);

    async function handleSubmit(event) {
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
        setApiError('');
        setSuccess('');

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setLoading(true);

        try {
            const studentData = {
                fullName: name.trim(),
                email: email.trim(),
                mobileNumber: mobile,
                gender: gender,
                course: course,
                address: address.trim()
            };

            if (studentId) {
                await updateStudent(studentId, studentData);
                setSuccess('Student updated successfully!');

                if (onUpdateSuccess) {
                    onUpdateSuccess();
                }
            } else {
                await createStudent(studentData);
                setSuccess('Student registered successfully!');

                setName('');
                setEmail('');
                setMobile('');
                setGender('');
                setCourse('');
                setAddress('');
            }
        } catch (error) {
            setApiError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="student-form-container">
            <div className="student-form-card">
                <h2>
                    {studentId
                        ? 'Edit Student'
                        : 'Student Registration Form'}
                </h2>

                <form onSubmit={handleSubmit} noValidate>
                    <FormInput
                        label="Full Name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={function (event) {
                            setName(event.target.value);
                        }}
                        error={errors.name}
                        placeholder="Enter your name"
                    />

                    <FormInput
                        label="Email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={function (event) {
                            setEmail(event.target.value);
                        }}
                        error={errors.email}
                        placeholder="Enter your email"
                    />

                    <FormInput
                        label="Mobile Number"
                        name="mobile"
                        type="tel"
                        value={mobile}
                        onChange={function (event) {
                            setMobile(event.target.value);
                        }}
                        error={errors.mobile}
                        placeholder="Enter your mobile number"
                    />

                    <div className="form-group">
                        <label>Gender</label>
                        <select
                            value={gender}
                            onChange={function (event) {
                                setGender(event.target.value);
                            }}
                            className={errors.gender ? 'input-error' : ''}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>

                        {errors.gender && 
                            <p className="error-message">{errors.gender}</p>
                        }
                    </div>

                    <div className="form-group">
                        <label>Course</label>
                        <select
                            value={course}
                            onChange={function (event) {
                                setCourse(event.target.value);
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
                            onChange={function (event) {
                                setAddress(event.target.value);
                            }}
                            className={errors.address ? 'input-error' : ''}
                            placeholder="Enter your address"
                        />

                        {errors.address && (
                            <p className="error-message">{errors.address}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading}
                    >
                        {loading
                            ? (studentId ? 'Updating...' : 'Registering...')
                            : (studentId ? 'Update Student' : 'Register')}
                    </button>
                </form>

                {apiError && (
                    <p className="error-message">{apiError}</p>
                )}

                {success && (
                    <p className="success-message">{success}</p>
                )}
            </div>
        </div>
    );
}

export default StudentForm;
