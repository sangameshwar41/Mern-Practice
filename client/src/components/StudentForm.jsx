
import { useEffect, useState } from "react";
import FormInput from "./FormInput";

import {
    createStudent,
    getStudentById,
    updateStudent,
    uploadStudentPhoto
} from "../api/studentApi";

import { getAllCourses } from "../api/courseApi";

import "./StudentForm.css";

function StudentForm({
    studentId,
    onUpdateSuccess,
    onCreateSuccess
}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [gender, setGender] = useState("");
    const [course, setCourse] = useState("");
    const [courses, setCourses] = useState([]);
    const [address, setAddress] = useState("");

    const [photoFile, setPhotoFile] = useState(null);

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [apiError, setApiError] = useState("");

    // Fetch active courses
    useEffect(function () {
        async function fetchCourses() {
            try {
                setCoursesLoading(true);
                setApiError("");

                const result = await getAllCourses();

                const activeCourses = (result.courses || []).filter(
                    function (item) {
                        return item.status === "active";
                    }
                );

                setCourses(activeCourses);
            } catch (error) {
                setApiError(error.message);
            } finally {
                setCoursesLoading(false);
            }
        }

        fetchCourses();
    }, []);

    // Fetch student details when editing
    useEffect(function () {
        async function fetchStudent() {
            if (!studentId) {
                return;
            }

            try {
                setLoading(true);
                setApiError("");
                setSuccess("");

                const result = await getStudentById(studentId);
                const student = result.data;

                setName(student.fullName || "");
                setEmail(student.email || "");
                setMobile(student.mobileNumber || "");

                setGender(
                    student.gender
                        ? student.gender.toLowerCase()
                        : ""
                );

                setCourse(
                    student.course && student.course._id
                        ? student.course._id
                        : student.course || ""
                );

                setAddress(student.address || "");
            } catch (error) {
                setApiError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchStudent();
    }, [studentId]);

    // Validate form and submit
    async function handleSubmit(event) {
        event.preventDefault();

        const newErrors = {};

        // Validate name
        if (name.trim().length < 2) {
            newErrors.name =
                "Name must contain at least 2 characters";
        } else if (name.trim().length > 50) {
            newErrors.name =
                "Name cannot exceed 50 characters";
        }

        // Validate email
        if (email.trim() === "") {
            newErrors.email = "Email is required";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ) {
            newErrors.email = "Enter a valid email address";
        }

        // Validate mobile number
        if (!/^[0-9]{10}$/.test(mobile)) {
            newErrors.mobile =
                "Enter a valid 10-digit mobile number";
        }

        // Validate gender
        if (!["male", "female", "other"].includes(gender)) {
            newErrors.gender = "Please select a valid gender";
        }

        // Validate course
        if (course.trim() === "") {
            newErrors.course = "Please select a course";
        }

        // Validate address
        if (address.trim().length < 5) {
            newErrors.address =
                "Address must contain at least 5 characters";
        } else if (address.trim().length > 200) {
            newErrors.address =
                "Address cannot exceed 200 characters";
        }

        // Validate selected photo
        if (photoFile) {
            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];

            if (!allowedTypes.includes(photoFile.type)) {
                newErrors.photo =
                    "Select a JPG, PNG or WebP image";
            } else if (photoFile.size > 2 * 1024 * 1024) {
                newErrors.photo =
                    "Photo size must not exceed 2 MB";
            }
        }

        setErrors(newErrors);
        setApiError("");
        setSuccess("");

        // Stop submission if validation errors exist
        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setLoading(true);

        try {
            const studentData = {
                fullName: name.trim(),
                email: email.trim().toLowerCase(),
                mobileNumber: mobile,
                gender: gender,
                course: course,
                address: address.trim()
            };

            let savedStudentId = studentId;

            if (studentId) {
                // Update existing student
                await updateStudent(studentId, studentData);
            } else {
                // Create new student
                const result = await createStudent(studentData);

                savedStudentId = result.data._id;
            }

            // Upload photo after saving student
            if (photoFile) {
                await uploadStudentPhoto(savedStudentId, photoFile);
            }

            if (studentId) {
                setSuccess("Student updated successfully!");
            } else {
                setSuccess("Student registered successfully!");

                setName("");
                setEmail("");
                setMobile("");
                setGender("");
                setCourse("");
                setAddress("");
                setErrors({});
            }

            setPhotoFile(null);

            // Clear file input
            event.target.reset();

            if (studentId && onUpdateSuccess) {
                onUpdateSuccess();
            }

            if (!studentId && onCreateSuccess) {
                onCreateSuccess();
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
                        ? "Edit Student"
                        : "Student Registration Form"}
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
                        <label htmlFor="gender">Gender</label>

                        <select
                            id="gender"
                            value={gender}
                            onChange={function (event) {
                                setGender(event.target.value);
                            }}
                            className={
                                errors.gender ? "input-error" : ""
                            }
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>

                        {errors.gender && (
                            <p className="error-message">
                                {errors.gender}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="course">Course</label>

                        <select
                            id="course"
                            value={course}
                            onChange={function (event) {
                                setCourse(event.target.value);
                            }}
                            className={
                                errors.course ? "input-error" : ""
                            }
                            disabled={
                                coursesLoading || courses.length === 0
                            }
                        >
                            <option value="">
                                {coursesLoading
                                    ? "Loading courses..."
                                    : courses.length === 0
                                        ? "No active courses available"
                                        : "Select Course"}
                            </option>

                            {courses.map(function (item) {
                                return (
                                    <option
                                        key={item._id}
                                        value={item._id}
                                    >
                                        {item.courseName} ({item.courseCode})
                                    </option>
                                );
                            })}
                        </select>

                        {errors.course && (
                            <p className="error-message">
                                {errors.course}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Address</label>

                        <textarea
                            id="address"
                            value={address}
                            onChange={function (event) {
                                setAddress(event.target.value);
                            }}
                            className={
                                errors.address ? "input-error" : ""
                            }
                            placeholder="Enter your address"
                        />

                        {errors.address && (
                            <p className="error-message">
                                {errors.address}
                            </p>
                        )}
                    </div>

                    {/* Student photo upload */}
                    <div className="form-group">
                        <label htmlFor="photo">Student Photo</label>

                        <input
                            id="photo"
                            name="photo"
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            onChange={function (event) {
                                const selectedFile =
                                    event.target.files[0] || null;

                                setPhotoFile(selectedFile);

                                setErrors(function (previousErrors) {
                                    return {
                                        ...previousErrors,
                                        photo: ""
                                    };
                                });
                            }}
                        />

                        <p>
                            Accepted formats: JPG, PNG and WebP.
                            Maximum size: 2 MB.
                        </p>

                        {photoFile && (
                            <p>
                                Selected file: {photoFile.name}
                            </p>
                        )}

                        {errors.photo && (
                            <p className="error-message">
                                {errors.photo}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="register-button"
                        disabled={
                            loading ||
                            coursesLoading ||
                            courses.length === 0
                        }
                    >
                        {loading
                            ? (studentId ? "Updating..." : "Registering...")
                            : (studentId ? "Update Student" : "Register")}
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
