import React, { useState } from "react";
import { ShoppingCart, AlertCircle, X, CheckCircle } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../Context/authContext";

const LoginPage = ({ onNavigate }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateField = (name, value) => {
    const errors = { ...fieldErrors };

    switch (name) {
      case "email":
        if (value.length > 0 && !/\S+@\S+\.\S+/.test(value)) {
          errors.email = "Please enter a valid email address";
        } else {
          delete errors.email;
        }
        break;
      case "password":
        if (value.length > 0 && value.length < 6) {
          errors.password = "Password must be at least 6 characters";
        } else {
          delete errors.password;
        }
        break;
      default:
        break;
    }

    setFieldErrors(errors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (Object.keys(fieldErrors).length > 0) {
      setError("Please fix all errors before submitting");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/login", formData);

      // Backend returns user in response
      if (response.data.user) {
        setSuccess(true);
        setTimeout(() => {
          login(response.data.user);
        }, 800);
      } else {
        throw new Error("User data not received from server");
      }
    } catch (err) {
      // Handle different error scenarios
      let errorMessage = "Login failed. Please try again.";

      if (err.response) {
        // Server responded with error status
        if (err.response.status === 401 || err.response.status === 400) {
          errorMessage =
            err.response.data?.message || "Invalid email or password";
        } else if (err.response.status === 500) {
          errorMessage =
            err.response.data?.message ||
            "Server error. Please try again later.";
        } else {
          errorMessage = err.response.data?.message || errorMessage;
        }
      } else if (err.request) {
        // Request made but no response
        errorMessage = "Network error. Please check your connection.";
      } else {
        // Other errors
        errorMessage = err.message || errorMessage;
      }

      setError(errorMessage);

      // Handle specific field errors from backend if provided
      if (err.response?.data?.errors) {
        const backendErrors = {};
        err.response.data.errors.forEach((error) => {
          backendErrors[error.field] = error.message;
        });
        setFieldErrors(backendErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-4 shadow-lg">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to your event platform account
          </p>
        </div>

        <div className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-sm">Error</p>
                <p className="text-sm">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => setError("")}
                className="text-red-700 hover:text-red-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-sm">Success!</p>
                <p className="text-sm">
                  Logged in successfully. Redirecting...
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                fieldErrors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-purple-500"
              }`}
              placeholder="you@example.com"
            />
            {fieldErrors.email && (
              <p className="text-red-600 text-xs mt-1 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{fieldErrors.email}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                fieldErrors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-purple-500"
              }`}
              placeholder="••••••••"
            />
            {fieldErrors.password && (
              <p className="text-red-600 text-xs mt-1 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{fieldErrors.password}</span>
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || success}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
          >
            {loading ? "Signing in..." : success ? "Success!" : "Sign In"}
          </button>
        </div>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <button
            onClick={() => onNavigate("register")}
            className="text-purple-600 font-semibold hover:text-purple-700 hover:underline"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};
export { LoginPage };
