
import { useEffect, useState } from "react";
import FormInput from "./FormInput";
import {
    createStudent,
    getStudentById,
    updateStudent
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

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [apiError, setApiError] = useState("");

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
                setGender(student.gender || "");

                // The backend populates course as an object.
                // Use its ID as the selected dropdown value.
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

    async function handleSubmit(event) {
        event.preventDefault();

        const newErrors = {};

        if (name.trim() === "") {
            newErrors.name = "Name is required";
        }

        if (email.trim() === "") {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (!/^[0-9]{10}$/.test(mobile)) {
            newErrors.mobile = "Enter a valid 10-digit mobile number";
        }

        if (gender === "") {
            newErrors.gender = "Please select gender";
        }

        if (course === "") {
            newErrors.course = "Please select a course";
        }

        if (address.trim() === "") {
            newErrors.address = "Address is required";
        }

        setErrors(newErrors);
        setApiError("");
        setSuccess("");

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

                setSuccess("Student updated successfully!");

                if (onUpdateSuccess) {
                    onUpdateSuccess();
                }
            } else {
                await createStudent(studentData);

                setSuccess("Student registered successfully!");

                if (onCreateSuccess) {
                    onCreateSuccess();
                }

                setName("");
                setEmail("");
                setMobile("");
                setGender("");
                setCourse("");
                setAddress("");
                setErrors({});
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
                            className={errors.gender ? "input-error" : ""}
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
                        <label htmlFor="course">Course</label>
                        <select
                            id="course"
                            value={course}
                            onChange={function (event) {
                                setCourse(event.target.value);
                            }}
                            className={errors.course ? "input-error" : ""}
                            disabled={coursesLoading || courses.length === 0}
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
                                    <option key={item._id} value={item._id}>
                                        {item.courseName} ({item.courseCode})
                                    </option>
                                );
                            })}
                        </select>

                        {errors.course && (
                            <p className="error-message">{errors.course}</p>
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
                            className={errors.address ? "input-error" : ""}
                            placeholder="Enter your address"
                        />

                        {errors.address && (
                            <p className="error-message">{errors.address}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading || coursesLoading || courses.length === 0}
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
