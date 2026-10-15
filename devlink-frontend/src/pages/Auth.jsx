import { useContext, useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Github,
  Linkedin,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// Simple UI Components
const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline:
      "border border-gray-600 bg-transparent text-white hover:bg-gray-700",
    ghost: "text-gray-300 hover:bg-gray-700 hover:text-white",
    secondary: "bg-gray-600 text-white hover:bg-gray-500",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    lg: "h-12 px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", error = false, ...props }) => (
  <input
    className={`flex h-10 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors ${
      error
        ? "border-red-500 bg-red-900/20 text-red-100 placeholder:text-red-300 focus:ring-red-500 focus:border-red-400"
        : "border-gray-600 bg-gray-800 text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-400"
    } ${className}`}
    {...props}
  />
);

const Textarea = ({ className = "", error = false, ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors resize-none ${
      error
        ? "border-red-500 bg-red-900/20 text-red-100 placeholder:text-red-300 focus:ring-red-500 focus:border-red-400"
        : "border-gray-600 bg-gray-800 text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-400"
    } ${className}`}
    {...props}
  />
);

const Label = ({ children, className = "", ...props }) => (
  <label
    className={`text-sm font-medium text-gray-300 ${className}`}
    {...props}
  >
    {children}
  </label>
);

const Checkbox = ({ className = "", ...props }) => (
  <input
    type="checkbox"
    className={`h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${className}`}
    {...props}
  />
);

// Error Alert Component
const ErrorAlert = ({ message, className = "" }) => (
  <div
    className={`flex items-center space-x-2 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 ${className}`}
  >
    <AlertCircle className="w-4 h-4 flex-shrink-0" />
    <span className="text-sm">{message}</span>
  </div>
);

// Success Alert Component
const SuccessAlert = ({ message, className = "" }) => (
  <div
    className={`flex items-center space-x-2 p-3 bg-green-900/30 border border-green-700/50 rounded-lg text-green-300 ${className}`}
  >
    <CheckCircle className="w-4 h-4 flex-shrink-0" />
    <span className="text-sm">{message}</span>
  </div>
);

// Field Error Component
const FieldError = ({ error }) => {
  if (!error) return null;
  return (
    <div className="flex items-center space-x-1 mt-1">
      <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
      <span className="text-xs text-red-400">{error}</span>
    </div>
  );
};

// Login Component
const Login = ({ onSwitchToSignup }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { apiLogin } = useContext(UserContext);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 3) {
      newErrors.password = "Password must be at least 3 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await apiLogin(formData.email, formData.password);
      if (res.success) {
        toast.success(res.message);
        navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Something went wrong. Please try again.";
      setGeneralError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear general error
    if (generalError) {
      setGeneralError("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-gray-400 mt-2">
              Sign in to your developer account
            </p>
          </div>

          {/* Alerts */}
          {generalError && (
            <ErrorAlert message={generalError} className="mb-6" />
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="mt-1 relative">
                <Mail
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    errors.email ? "text-red-400" : "text-gray-400"
                  }`}
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  error={!!errors.email}
                  disabled={isLoading}
                />
              </div>
              <FieldError error={errors.email} />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1 relative">
                <Lock
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    errors.password ? "text-red-400" : "text-gray-400"
                  }`}
                />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                  error={!!errors.password}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <FieldError error={errors.password} />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <button
                onClick={onSwitchToSignup}
                className="text-blue-400 hover:text-blue-300 font-medium"
                disabled={isLoading}
              >
                Sign up
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-gray-400 text-sm"
              disabled={isLoading}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Signup Component
const Signup = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [registeredUser, setRegisteredUser] = useState(null);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: "",
    email: "",
    password: "",

    // Step 2: Optional Profile Info
    title: "Frontend dev",
    location: "Cairo, Egypt",
    primarySkills: "HTML, CSS",
    bio: "Frontend Developer | JavaScript Enthusiast",
    education: "Business , Alexandria University",
    portfolio: "https://myprotfolio.com",
    github: "https://github.com/takyEhab",
    linkedIn: "https://www.linkedin.com/in/taky-gad",
  });
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Username is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.title) {
      newErrors.title = "Professional title is required";
    }
    if (!formData.location) {
      newErrors.location = "Location is required";
    }

    if (!formData.primarySkills) {
      newErrors.primarySkills = "Primary skills is required";
    }

    if (!formData.bio) {
      newErrors.bio = "Professional Bio is required";
    }

    if (formData.portfolio && !/^https?:\/\/.+/.test(formData.portfolio)) {
      newErrors.portfolio =
        "Please enter a valid URL (starting with http:// or https://)";
    }

    if (
      formData.primarySkills &&
      formData.primarySkills.split(",").length > 10
    ) {
      newErrors.primarySkills = "Please limit to 10 skills maximum";
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = "Bio must be 500 characters or less";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setErrors({});

    if (currentStep === 1) {
      const validationErrors = validateStep1();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsLoading(true);

      try {
        const res = await api.post("/users/register/", {
          email: formData.email,
          name: formData.name,
          password: formData.password,
        });
        if (res.data.success) {
          if (res.data.data?.token) {
            localStorage.setItem("devlink_token", res.data.data.token);
          }
          setRegisteredUser(res.data.data.user);
          toast.success(res.data.message);
        }
        setCurrentStep(2);
      } catch (error) {
        console.log(error.response);

        setGeneralError(
          error.response?.data?.error ||
            "Something went wrong. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      // Step 2 - edit account
      const validationErrors = validateStep2();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsLoading(true);

      try {
        // // Simulate account creation
        // await new Promise((resolve) => setTimeout(resolve, 1500));

        const userData = {
          title: formData.title || "Developer",
          location: formData.location || "Remote",
          bio:
            formData.bio ||
            "New to the platform and excited to work on amazing projects!",
          education: formData.education,
          skills: formData.primarySkills
            ? formData.primarySkills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
            : ["JavaScript", "React", "CSS"],
          portfolio: formData.portfolio,
          github: formData.github,
          linkedIn: formData.linkedIn,
        };

        let res = await api.post("/profile/", userData);
        res = res.data;
        if (res.success) {
          setUser(registeredUser);
          toast.success(res.message);
          navigate("/");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.error ||
          "Failed to add account info. Please try again.";
        setGeneralError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };
  // `/developer/${formData.name ? formData.name : "taky"}`

  const handleSkip = async () => {
    setUser(registeredUser);
    toast.success("You are now logged in.");
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear general error
    if (generalError) setGeneralError("");
  };

  const goBack = () => {
    if (currentStep === 1) {
      navigate("/");
    } else {
      setCurrentStep(1);
      setErrors({});
      setGeneralError("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              {currentStep === 1 ? "Join DevLink" : "Complete Your Profile"}
            </h1>
            <p className="text-gray-400 mt-2">
              {currentStep === 1
                ? "Create your developer account"
                : "Add more details to stand out (optional)"}
            </p>

            {/* Progress Indicator */}
            <div className="flex justify-center mt-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                    currentStep >= 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-600 text-gray-400"
                  }`}
                >
                  1
                </div>
                <div
                  className={`w-8 h-1 ${
                    currentStep >= 2 ? "bg-blue-600" : "bg-gray-600"
                  }`}
                ></div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                    currentStep >= 2
                      ? "bg-blue-600 text-white"
                      : "bg-gray-600 text-gray-400"
                  }`}
                >
                  2
                </div>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {generalError && (
            <ErrorAlert message={generalError} className="mb-6" />
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <>
                {/* Basic Information */}
                <div>
                  <Label htmlFor="name">Username *</Label>
                  <div className="mt-1 relative">
                    <User
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                        errors.name ? "text-red-400" : "text-gray-400"
                      }`}
                    />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your username"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10"
                      error={!!errors.name}
                      disabled={isLoading}
                    />
                  </div>
                  <FieldError error={errors.name} />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <div className="mt-1 relative">
                    <Mail
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                        errors.email ? "text-red-400" : "text-gray-400"
                      }`}
                    />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10"
                      error={!!errors.email}
                      disabled={isLoading}
                    />
                  </div>
                  <FieldError error={errors.email} />
                </div>

                <div>
                  <Label htmlFor="password">Password *</Label>
                  <div className="mt-1 relative">
                    <Lock
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                        errors.password ? "text-red-400" : "text-gray-400"
                      }`}
                    />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-10"
                      error={!!errors.password}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <FieldError error={errors.password} />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 6 characters
                  </p>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                {/* Optional Profile Information */}
                <div>
                  <Label htmlFor="title">Professional Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Full Stack Developer"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={isLoading}
                    error={!!errors.title}
                  />
                  <FieldError error={errors.title} />
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g., San Francisco, CA or Remote"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={isLoading}
                    error={!!errors.location}
                  />
                  <FieldError error={errors.title} />
                </div>

                <div>
                  <Label htmlFor="primarySkills">
                    Primary Skills (comma-separated) *
                  </Label>
                  <Input
                    id="primarySkills"
                    name="primarySkills"
                    placeholder="React, Node.js, TypeScript"
                    value={formData.primarySkills}
                    onChange={handleChange}
                    error={!!errors.primarySkills}
                    disabled={isLoading}
                  />
                  <FieldError error={errors.primarySkills} />
                  <p className="text-xs text-gray-500 mt-1">
                    List your strongest technical skills (max 10)
                  </p>
                </div>

                <div>
                  <Label htmlFor="bio">Professional Bio *</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell potential clients about your experience and what makes you unique..."
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    error={!!errors.bio}
                    disabled={isLoading}
                  />
                  <FieldError error={errors.bio} />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.bio.length}/500 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="education">Education</Label>
                  <Textarea
                    id="education"
                    name="education"
                    placeholder="e.g. Business, Alexandria University"
                    value={formData.education}
                    onChange={handleChange}
                    rows={3}
                    error={!!errors.education}
                    disabled={isLoading}
                  />
                  <FieldError error={errors.education} />
                </div>

                <div>
                  <Label htmlFor="portfolio">Portfolio Website</Label>
                  <Input
                    id="portfolio"
                    name="portfolio"
                    type="url"
                    placeholder="https://yourportfolio.com"
                    value={formData.portfolio}
                    onChange={handleChange}
                    error={!!errors.portfolio}
                    disabled={isLoading}
                  />
                  <FieldError error={errors.portfolio} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="github">GitHub Username</Label>
                    <div className="mt-1 relative">
                      <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="github"
                        name="github"
                        placeholder="yourusername"
                        value={formData.github}
                        onChange={handleChange}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn Profile</Label>
                    <div className="mt-1 relative">
                      <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="linkedin"
                        name="linkedin"
                        placeholder="linkedin.com/in/you"
                        value={formData.linkedIn}
                        onChange={handleChange}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading
                  ? currentStep === 1
                    ? "Validating..."
                    : "Creating Account..."
                  : currentStep === 1
                    ? "Continue"
                    : "Create Developer Account"}
              </Button>

              {currentStep === 2 && (
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  size="lg"
                  onClick={handleSkip}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Skip for now"}
                </Button>
              )}
            </div>
          </form>

          {/* Footer */}
          {currentStep === 1 && (
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <button
                  onClick={onSwitchToLogin}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                  disabled={isLoading}
                >
                  Sign in
                </button>
              </p>
            </div>
          )}

          <div className="mt-4 text-center">
            <button
              onClick={goBack}
              className="text-gray-500 hover:text-gray-400 text-sm"
              disabled={isLoading}
            >
              ← {currentStep === 1 ? "Back to Home" : "Back"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Auth Component
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (user) {
    return null;
  }

  return (
    <>
      {isLogin ? (
        <Login onSwitchToSignup={() => setIsLogin(false)} />
      ) : (
        <Signup onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </>
  );
};

export default Auth;
