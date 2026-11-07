
import {
    render,
    screen,
    fireEvent,
    waitFor
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
    describe,
    it,
    expect,
    vi,
    beforeEach
} from "vitest";

import StudentForm from "./StudentForm";

import {
    createStudent,
    getStudentById,
    updateStudent,
    uploadStudentPhoto
} from "../api/studentApi";

import {
    getAllCourses
} from "../api/courseApi";

// Mock course API
vi.mock("../api/courseApi", function () {
    return {
        getAllCourses: vi.fn()
    };
});

// Mock student API
vi.mock("../api/studentApi", function () {
    return {
        createStudent: vi.fn(),
        getStudentById: vi.fn(),
        updateStudent: vi.fn(),
        uploadStudentPhoto: vi.fn()
    };
});

describe("StudentForm Component", function () {

    beforeEach(function () {
        vi.clearAllMocks();

        getAllCourses.mockResolvedValue({
            courses: [
                {
                    _id: "course123",
                    courseName: "MERN Stack Development",
                    courseCode: "MERN101",
                    status: "active"
                }
            ]
        });
    });

    // Test 1: Display registration heading
    it("should display the student registration heading", async function () {
        render(<StudentForm />);

        expect(
            screen.getByRole("heading", {
                name: "Student Registration Form"
            })
        ).toBeInTheDocument();
    });

    // Test 2: Display active courses
    it("should display active courses in the course dropdown", async function () {
        render(<StudentForm />);

        expect(
            await screen.findByRole("option", {
                name: "MERN Stack Development (MERN101)"
            })
        ).toBeInTheDocument();
    });

    // Test 3: Display validation errors
    it("should display validation errors when form is submitted empty", async function () {
        render(<StudentForm />);

        const registerButton = await screen.findByRole("button", {
            name: "Register"
        });

        fireEvent.click(registerButton);

        expect(
            screen.getByText("Name must contain at least 2 characters")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Email is required")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Enter a valid 10-digit mobile number")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Please select a valid gender")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Please select a course")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Address must contain at least 5 characters")
        ).toBeInTheDocument();
    });

    // Test 4: Prevent API call when validation fails
    it("should not create a student when form validation fails", async function () {
        render(<StudentForm />);

        const registerButton = await screen.findByRole("button", {
            name: "Register"
        });

        fireEvent.click(registerButton);

        expect(createStudent).not.toHaveBeenCalled();
    });

    // Test 5: Successfully register a student
    it("should register a student successfully with valid details", async function () {
        const user = userEvent.setup();

        createStudent.mockResolvedValue({
            data: {
                _id: "student123"
            }
        });

        render(<StudentForm />);

        // Wait for active course
        await screen.findByRole("option", {
            name: "MERN Stack Development (MERN101)"
        });

        // Enter full name
        await user.type(
            screen.getByPlaceholderText("Enter your name"),
            "Test Student"
        );

        // Enter email
        await user.type(
            screen.getByPlaceholderText("Enter your email"),
            "teststudent@example.com"
        );

        // Enter mobile number
        await user.type(
            screen.getByPlaceholderText("Enter your mobile number"),
            "9876543210"
        );

        // Select gender
        await user.selectOptions(
            screen.getByLabelText("Gender"),
            "male"
        );

        // Select course
        await user.selectOptions(
            screen.getByLabelText("Course"),
            "course123"
        );

        // Enter address
        await user.type(
            screen.getByPlaceholderText("Enter your address"),
            "Hyderabad Telangana"
        );

        // Submit form
        await user.click(
            screen.getByRole("button", {
                name: "Register"
            })
        );

        // Check API request data
        await waitFor(function () {
            expect(createStudent).toHaveBeenCalledWith({
                fullName: "Test Student",
                email: "teststudent@example.com",
                mobileNumber: "9876543210",
                gender: "male",
                course: "course123",
                address: "Hyderabad Telangana"
            });
        });

        // Check success message
        expect(
            await screen.findByText("Student registered successfully!")
        ).toBeInTheDocument();
    });
    it("should display an error when student registration fails", async function () {
    const user = userEvent.setup();

    createStudent.mockRejectedValue(
        new Error("A student with this email already exists")
    );

    render(<StudentForm />);

    await screen.findByRole("option", {
        name: "MERN Stack Development (MERN101)"
    });

    await user.type(
        screen.getByPlaceholderText("Enter your name"),
        "Test Student"
    );

    await user.type(
        screen.getByPlaceholderText("Enter your email"),
        "teststudent@example.com"
    );

    await user.type(
        screen.getByPlaceholderText("Enter your mobile number"),
        "9876543210"
    );

    await user.selectOptions(
        screen.getByLabelText("Gender"),
        "male"
    );

    await user.selectOptions(
        screen.getByLabelText("Course"),
        "course123"
    );

    await user.type(
        screen.getByPlaceholderText("Enter your address"),
        "Hyderabad Telangana"
    );

    await user.click(
        screen.getByRole("button", {
            name: "Register"
        })
    );

    expect(
        await screen.findByText(
            "A student with this email already exists"
        )
    ).toBeInTheDocument();
});
it("should convert email to lowercase before registration", async function () {
    const user = userEvent.setup();

    createStudent.mockResolvedValue({
        data: {
            _id: "student123"
        }
    });

    render(<StudentForm />);

    await screen.findByRole("option", {
        name: "MERN Stack Development (MERN101)"
    });

    await user.type(
        screen.getByPlaceholderText("Enter your name"),
        "Test Student"
    );

    await user.type(
        screen.getByPlaceholderText("Enter your email"),
        "TESTSTUDENT@EXAMPLE.COM"
    );

    await user.type(
        screen.getByPlaceholderText("Enter your mobile number"),
        "9876543210"
    );

    await user.selectOptions(
        screen.getByLabelText("Gender"),
        "male"
    );

    await user.selectOptions(
        screen.getByLabelText("Course"),
        "course123"
    );

    await user.type(
        screen.getByPlaceholderText("Enter your address"),
        "Hyderabad Telangana"
    );

    await user.click(
        screen.getByRole("button", {
            name: "Register"
        })
    );

    await waitFor(function () {
        expect(createStudent).toHaveBeenCalledWith(
            expect.objectContaining({
                email: "teststudent@example.com"
            })
        );
    });
});
it("should not display inactive courses", async function () {
    getAllCourses.mockResolvedValue({
        courses: [
            {
                _id: "course123",
                courseName: "MERN Stack Development",
                courseCode: "MERN101",
                status: "active"
            },
            {
                _id: "course456",
                courseName: "Java Development",
                courseCode: "JAVA101",
                status: "inactive"
            }
        ]
    });

    render(<StudentForm />);

    await screen.findByRole("option", {
        name: "MERN Stack Development (MERN101)"
    });

    expect(
        screen.queryByRole("option", {
            name: "Java Development (JAVA101)"
        })
    ).not.toBeInTheDocument();
});
it("should reject an unsupported photo format", async function () {
    const user = userEvent.setup({
        applyAccept: false
    });

    render(<StudentForm />);

    await screen.findByRole("option", {
        name: "MERN Stack Development (MERN101)"
    });

    // Enter student name
    await user.type(
        screen.getByPlaceholderText("Enter your name"),
        "Test Student"
    );

    // Enter email
    await user.type(
        screen.getByPlaceholderText("Enter your email"),
        "teststudent@example.com"
    );

    // Enter mobile number
    await user.type(
        screen.getByPlaceholderText("Enter your mobile number"),
        "9876543210"
    );

    // Select gender
    await user.selectOptions(
        screen.getByLabelText("Gender"),
        "male"
    );

    // Select course
    await user.selectOptions(
        screen.getByLabelText("Course"),
        "course123"
    );

    // Enter address
    await user.type(
        screen.getByPlaceholderText("Enter your address"),
        "Hyderabad Telangana"
    );

    // Create an unsupported text file
    const invalidFile = new File(
        ["sample text"],
        "document.txt",
        {
            type: "text/plain"
        }
    );

    // Select the unsupported file
    await user.upload(
        screen.getByLabelText("Student Photo"),
        invalidFile
    );

    // Submit form
    await user.click(
        screen.getByRole("button", {
            name: "Register"
        })
    );

    // Check photo validation error
    expect(
        await screen.findByText(
            "Select a JPG, PNG or WebP image"
        )
    ).toBeInTheDocument();

    // Student API should not be called
    expect(createStudent).not.toHaveBeenCalled();
});
it("should reject a photo larger than 2 MB", async function () {
    const user = userEvent.setup();

    render(<StudentForm />);

    await screen.findByRole("option", {
        name: "MERN Stack Development (MERN101)"
    });

    await user.type(
        screen.getByPlaceholderText("Enter your name"),
        "Test Student"
    );

    await user.type(
        screen.getByPlaceholderText("Enter your email"),
        "teststudent@example.com"
    );

    await user.type(
        screen.getByPlaceholderText("Enter your mobile number"),
        "9876543210"
    );

    await user.selectOptions(
        screen.getByLabelText("Gender"),
        "male"
    );

    await user.selectOptions(
        screen.getByLabelText("Course"),
        "course123"
    );

    await user.type(
        screen.getByPlaceholderText("Enter your address"),
        "Hyderabad Telangana"
    );

    const largePhoto = new File(
        [new Uint8Array(2 * 1024 * 1024 + 1)],
        "large-photo.jpg",
        { type: "image/jpeg" }
    );

    await user.upload(
        screen.getByLabelText("Student Photo"),
        largePhoto
    );

    await user.click(
        screen.getByRole("button", { name: "Register" })
    );

    expect(
        await screen.findByText("Photo size must not exceed 2 MB")
    ).toBeInTheDocument();

    expect(createStudent).not.toHaveBeenCalled();
});
it("should load existing student details when editing", async function () {
    getStudentById.mockResolvedValue({
        data: {
            _id: "student123",
            fullName: "Existing Student",
            email: "existing@example.com",
            mobileNumber: "9876543210",
            gender: "male",
            course: "course123",
            address: "Hyderabad Telangana"
        }
    });

    render(<StudentForm studentId="student123" />);

    expect(
        await screen.findByDisplayValue("Existing Student")
    ).toBeInTheDocument();

    expect(
        screen.getByDisplayValue("existing@example.com")
    ).toBeInTheDocument();

    expect(
        screen.getByDisplayValue("9876543210")
    ).toBeInTheDocument();

    expect(
        screen.getByDisplayValue("Hyderabad Telangana")
    ).toBeInTheDocument();

    expect(
        screen.getByRole("heading", { name: "Edit Student" })
    ).toBeInTheDocument();

    expect(getStudentById).toHaveBeenCalledWith("student123");
});
// Test 12: Successfully update an existing student
it("should update an existing student successfully", async function () {
    const user = userEvent.setup();
    const onUpdateSuccess = vi.fn();

    getStudentById.mockResolvedValue({
        data: {
            _id: "student123",
            fullName: "Existing Student",
            email: "existing@example.com",
            mobileNumber: "9876543210",
            gender: "male",
            course: "course123",
            address: "Hyderabad Telangana"
        }
    });

    updateStudent.mockResolvedValue({
        success: true
    });

    render(
        <StudentForm
            studentId="student123"
            onUpdateSuccess={onUpdateSuccess}
        />
    );

    await screen.findByDisplayValue("Existing Student");

    await screen.findByRole("option", {
        name: "MERN Stack Development (MERN101)"
    });

    const nameInput = screen.getByPlaceholderText("Enter your name");

    await user.clear(nameInput);
    await user.type(nameInput, "Updated Student");

    await user.click(
        screen.getByRole("button", {
            name: "Update Student"
        })
    );

    expect(
        await screen.findByText("Student updated successfully!")
    ).toBeInTheDocument();

    expect(onUpdateSuccess).toHaveBeenCalled();
});

// Test 13: Convert updated email to lowercase
it("should convert updated email to lowercase", async function () {
    const user = userEvent.setup();

    getStudentById.mockResolvedValue({
        data: {
            _id: "student123",
            fullName: "Existing Student",
            email: "existing@example.com",
            mobileNumber: "9876543210",
            gender: "male",
            course: "course123",
            address: "Hyderabad Telangana"
        }
    });

    updateStudent.mockResolvedValue({
        success: true
    });

    render(<StudentForm studentId="student123" />);

    await screen.findByDisplayValue("Existing Student");

    await screen.findByRole("option", {
        name: "MERN Stack Development (MERN101)"
    });

    const emailInput = screen.getByPlaceholderText("Enter your email");

    await user.clear(emailInput);
    await user.type(emailInput, "UPDATED@EXAMPLE.COM");

    await user.click(
        screen.getByRole("button", {
            name: "Update Student"
        })
    );

    await waitFor(function () {
        expect(updateStudent).toHaveBeenCalledWith(
            "student123",
            expect.objectContaining({
                email: "updated@example.com"
            })
        );
    });
});

// Test 14: Handle student update failure
it("should display an error when student update fails", async function () {
    const user = userEvent.setup();

    getStudentById.mockResolvedValue({
        data: {
            _id: "student123",
            fullName: "Existing Student",
            email: "existing@example.com",
            mobileNumber: "9876543210",
            gender: "male",
            course: "course123",
            address: "Hyderabad Telangana"
        }
    });

    updateStudent.mockRejectedValue(
        new Error("Unable to update student")
    );

    render(<StudentForm studentId="student123" />);

    await screen.findByDisplayValue("Existing Student");

    await screen.findByRole("option", {
        name: "MERN Stack Development (MERN101)"
    });

    await user.click(
        screen.getByRole("button", {
            name: "Update Student"
        })
    );

    expect(
        await screen.findByText("Unable to update student")
    ).toBeInTheDocument();
});

// Test 15: Upload photo after registration
it("should upload a photo after successful registration", async function () {
    const user = userEvent.setup();

    createStudent.mockResolvedValue({
        data: {
            _id: "student123"
        }
    });

    uploadStudentPhoto.mockResolvedValue({
        success: true
    });

    render(<StudentForm />);

    await screen.findByRole("option", {
        name: "MERN Stack Development (MERN101)"
    });

    await user.type(
        screen.getByPlaceholderText("Enter your name"),
        "Test Student"
    );

    await user.type(
        screen.getByPlaceholderText("Enter your email"),
        "teststudent@example.com"
    );

    await user.type(
        screen.getByPlaceholderText("Enter your mobile number"),
        "9876543210"
    );

    await user.selectOptions(
        screen.getByLabelText("Gender"),
        "male"
    );

    await user.selectOptions(
        screen.getByLabelText("Course"),
        "course123"
    );

    await user.type(
        screen.getByPlaceholderText("Enter your address"),
        "Hyderabad Telangana"
    );

    const photo = new File(
        ["sample image"],
        "student.jpg",
        { type: "image/jpeg" }
    );

    await user.upload(
        screen.getByLabelText("Student Photo"),
        photo
    );

    await user.click(
        screen.getByRole("button", {
            name: "Register"
        })
    );

    await waitFor(function () {
        expect(uploadStudentPhoto).toHaveBeenCalledWith(
            "student123",
            photo
        );
    });
});

// Test 16: Handle photo upload failure
it("should display an error when photo upload fails", async function () {
    const user = userEvent.setup();

    createStudent.mockResolvedValue({
        data: {
            _id: "student123"
        }
    });

    uploadStudentPhoto.mockRejectedValue(
        new Error("Photo upload failed")
    );

    render(<StudentForm />);

    await screen.findByRole("option", {
        name: "MERN Stack Development (MERN101)"
    });

    await user.type(
        screen.getByPlaceholderText("Enter your name"),
        "Test Student"
    );

    await user.type(
        screen.getByPlaceholderText("Enter your email"),
        "teststudent@example.com"
    );

    await user.type(
        screen.getByPlaceholderText("Enter your mobile number"),
        "9876543210"
    );

    await user.selectOptions(
        screen.getByLabelText("Gender"),
        "male"
    );

    await user.selectOptions(
        screen.getByLabelText("Course"),
        "course123"
    );

    await user.type(
        screen.getByPlaceholderText("Enter your address"),
        "Hyderabad Telangana"
    );

    const photo = new File(
        ["sample image"],
        "student.jpg",
        { type: "image/jpeg" }
    );

    await user.upload(
        screen.getByLabelText("Student Photo"),
        photo
    );

    await user.click(
        screen.getByRole("button", {
            name: "Register"
        })
    );

    expect(
        await screen.findByText("Photo upload failed")
    ).toBeInTheDocument();
});

// Test 17: Handle no active courses
it("should display a message when no active courses are available", async function () {
    getAllCourses.mockResolvedValue({
        courses: []
    });

    render(<StudentForm />);

    expect(
        await screen.findByText("No active courses available")
    ).toBeInTheDocument();

    expect(
        screen.getByRole("button", {
            name: "Register"
        })
    ).toBeDisabled();
});

// Test 18: Handle failure when loading student details
it("should display an error when existing student details cannot be loaded", async function () {
    getStudentById.mockRejectedValue(
        new Error("Unable to load student details")
    );

    render(<StudentForm studentId="student123" />);

    expect(
        await screen.findByText("Unable to load student details")
    ).toBeInTheDocument();
});

});
