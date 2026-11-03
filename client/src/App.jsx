
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import StudentManagement from "./components/StudentManagement";

import Home from "./pages/Home";
import Aboutus from "./pages/About-Us";
import Services from "./pages/Services";
import Contactus from "./pages/Contact-Us";
import PrivacyPolicies from "./pages/Privacy-Policies";
import PageNotFound from "./pages/404Error";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import CourseManagement from "./pages/CourseManagement";
import CourseDetails from "./pages/CourseDetails";
import InstructorManagement from "./pages/InstructorManagement";
import UserManagement from "./pages/UserManagement";
import Reports from "./pages/Reports";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                {/* Public pages */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<Aboutus />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contactus />} />
                <Route
                    path="/privacy-policy"
                    element={<PrivacyPolicies />}
                />

                {/* Authentication pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />
                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />

                {/* Protected pages */}
                <Route
                    path="/students"
                    element={
                        <ProtectedRoute>
                            <StudentManagement />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/courses"
                    element={
                        <ProtectedRoute>
                            <CourseManagement />
                        </ProtectedRoute>
                    }
                />

                {/* Details of one selected course */}
                <Route
                    path="/courses/:id"
                    element={
                        <ProtectedRoute>
                            <CourseDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/instructors"
                    element={
                        <ProtectedRoute>
                            <InstructorManagement />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/users"
                    element={
                        <ProtectedRoute>
                            <UserManagement />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/reports"
                    element={
                        <ProtectedRoute>
                            <Reports />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/change-password"
                    element={
                        <ProtectedRoute>
                            <ChangePassword />
                        </ProtectedRoute>
                    }
                />

                {/* 404 page */}
                <Route path="*" element={<PageNotFound />} />
            </Routes>

            <Footer />
        </BrowserRouter>
    );
}

export default App;
