import { useState } from "react";
import { AlertCircle, User, CheckCircle, X } from "lucide-react";
import { useAuth } from "../context/authContext";
import axiosInstance from "../utils/axiosInstance";

const RegisterPage = ({ onNavigate }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateField = (name, value) => {
    const errors = { ...fieldErrors };

    switch (name) {
      case "username":
        if (value.length > 0 && value.length < 3) {
          errors.username = "Username must be at least 3 characters";
        } else {
          delete errors.username;
        }
        break;
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
        // Revalidate confirm password if it exists
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          errors.confirmPassword = "Passwords do not match";
        } else if (formData.confirmPassword) {
          delete errors.confirmPassword;
        }
        break;
      case "confirmPassword":
        if (value.length > 0 && value !== formData.password) {
          errors.confirmPassword = "Passwords do not match";
        } else {
          delete errors.confirmPassword;
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
    setError(""); // Clear general error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Final validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setFieldErrors({
        ...fieldErrors,
        confirmPassword: "Passwords do not match",
      });
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setFieldErrors({
        ...fieldErrors,
        password: "Password must be at least 6 characters",
      });
      return;
    }

    if (Object.keys(fieldErrors).length > 0) {
      setError("Please fix all errors before submitting");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await axiosInstance.post("/auth/register", registerData);

      // Backend returns user in response
      if (response.data.user) {
        setSuccess(true);
        setTimeout(() => {
          login(response.data.user);
        }, 1000);
      } else {
        throw new Error("User data not received from server");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Registration failed";
      setError(errorMessage);

      // Handle specific field errors from backend
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
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">Join our event platform community</p>
        </div>

        <div className="space-y-5">
          {/* General Error Message */}
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
                  Account created successfully. Redirecting...
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                fieldErrors.username
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-purple-500"
              }`}
              placeholder="johndoe"
            />
            {fieldErrors.username && (
              <p className="text-red-600 text-xs mt-1 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{fieldErrors.username}</span>
              </p>
            )}
          </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                fieldErrors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-purple-500"
              }`}
              placeholder="••••••••"
            />
            {fieldErrors.confirmPassword && (
              <p className="text-red-600 text-xs mt-1 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{fieldErrors.confirmPassword}</span>
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || success}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
          >
            {loading
              ? "Creating account..."
              : success
              ? "Success!"
              : "Create Account"}
          </button>
        </div>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <button
            onClick={() => onNavigate("login")}
            className="text-purple-600 font-semibold hover:text-purple-700 hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
export default RegisterPage;
