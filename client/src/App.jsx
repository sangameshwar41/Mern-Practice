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
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PageNotFound from "./pages/404Error";

function App() {
    return (
        <BrowserRouter>
            <div className="app-layout">
                <Navbar />

                <main>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<Aboutus />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/contact" element={<Contactus />} />

                        <Route
                            path="/privacy-policy"
                            element={<PrivacyPolicies />}
                        />

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

                        {/* Protected routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route
                                path="/students"
                                element={<StudentManagement />}
                            />

                            <Route
                                path="/profile"
                                element={<Profile />}
                            />

                            <Route
                                path="/change-password"
                                element={<ChangePassword />}
                            />
                        </Route>

                        {/* Page for invalid URLs */}
                        <Route
                            path="*"
                            element={<PageNotFound />}
                        />
                    </Routes>
                </main>

                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;