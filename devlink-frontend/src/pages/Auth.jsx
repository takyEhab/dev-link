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
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Input = ({ className = "", error = false, ...props }) => (
  <input
    className={`flex h-10 w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none ${
      error
        ? "border-red-500/80 bg-red-950/20 text-red-100 placeholder:text-red-400/50 focus:border-red-500"
        : "border-zinc-800 bg-zinc-900/90 text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
    } ${className}`}
    {...props}
  />
);

const Textarea = ({ className = "", error = false, ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-lg border px-3 py-2 text-sm transition-colors resize-none focus:outline-none ${
      error
        ? "border-red-500/80 bg-red-950/20 text-red-100 placeholder:text-red-400/50 focus:border-red-500"
        : "border-zinc-800 bg-zinc-900/90 text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
    } ${className}`}
    {...props}
  />
);

const Label = ({ children, className = "", ...props }) => (
  <label
    className={`block text-xs font-medium text-zinc-300 mb-1.5 ${className}`}
    {...props}
  >
    {children}
  </label>
);

const ErrorAlert = ({ message, className = "" }) => (
  <div
    className={`flex items-start space-x-2.5 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs ${className}`}
  >
    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
    <span>{message}</span>
  </div>
);

const FieldError = ({ error }) => {
  if (!error) return null;
  return (
    <div className="flex items-center space-x-1 mt-1 text-red-400 text-xs">
      <AlertCircle className="w-3 h-3 shrink-0" />
      <span>{error}</span>
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
        toast.success(res.message || "Logged in successfully!");
        navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Something went wrong. Please check your credentials.";
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

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (generalError) {
      setGeneralError("");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Welcome Back
            </h1>
            <p className="text-xs text-zinc-400 mt-1.5">
              Sign in to manage your projects and profile
            </p>
          </div>

          {generalError && (
            <ErrorAlert message={generalError} className="mb-6" />
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    errors.email ? "text-red-400" : "text-zinc-500"
                  }`}
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-9"
                  error={!!errors.email}
                  disabled={isLoading}
                />
              </div>
              <FieldError error={errors.email} />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    errors.password ? "text-red-400" : "text-zinc-500"
                  }`}
                />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-9 pr-9"
                  error={!!errors.password}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 mt-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-zinc-400">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToSignup}
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              disabled={isLoading}
            >
              Create account
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-zinc-500 hover:text-zinc-400 text-xs transition-colors"
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
    name: "",
    email: "",
    password: "",
    title: "",
    location: "",
    primarySkills: "",
    bio: "",
    education: "",
    portfolio: "",
    github: "",
    linkedin: "",
  });

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name or username is required";
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

    if (!formData.title?.trim()) {
      newErrors.title = "Professional title is required";
    }
    if (!formData.location?.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.primarySkills?.trim()) {
      newErrors.primarySkills = "At least one skill is required";
    }

    if (!formData.bio?.trim()) {
      newErrors.bio = "Professional bio is required";
    }

    if (formData.portfolio && !/^https?:\/\/.+/.test(formData.portfolio)) {
      newErrors.portfolio = "Please enter a valid URL (https://...)";
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
          email: formData.email.trim(),
          name: formData.name.trim(),
          password: formData.password,
        });

        if (res.data?.success) {
          if (res.data.data?.token) {
            localStorage.setItem("devlink_token", res.data.data.token);
          }
          const userObj = res.data.data.user;
          setRegisteredUser(userObj);
          toast.success(res.data.message || "Account created!");
          setCurrentStep(2);
        } else {
          setGeneralError(res.data?.error || "Registration failed");
        }
      } catch (error) {
        setGeneralError(
          error.response?.data?.error ||
            "Something went wrong. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      // Step 2: Profile info
      const validationErrors = validateStep2();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsLoading(true);

      try {
        const skillsArray = formData.primarySkills
          ? formData.primarySkills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
          : ["JavaScript"];

        const userData = {
          title: formData.title.trim(),
          location: formData.location.trim(),
          bio: formData.bio.trim(),
          education: formData.education?.trim() || null,
          skills: skillsArray,
          portfolio: formData.portfolio?.trim() || null,
          github: formData.github?.trim() || null,
          linkedin: formData.linkedin?.trim() || null,
        };

        const res = await api.post("/profile/", userData);
        if (res.data?.success) {
          const profile = res.data.data?.profile;
          setUser({
            ...registeredUser,
            title: profile?.title || userData.title,
            location: profile?.location || userData.location,
            bio: profile?.bio || userData.bio,
            avatar: profile?.avatar || registeredUser?.avatar || null,
          });
          toast.success("Profile setup complete!");
          navigate("/");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.error ||
          "Failed to complete profile. You can finish it later from your profile.";
        setGeneralError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSkip = () => {
    setUser(registeredUser);
    toast.success("You are now signed in.");
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (generalError) setGeneralError("");
  };

  const goBack = () => {
    if (currentStep === 1) {
      navigate("/");
    } else {
      handleSkip();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {currentStep === 1 ? "Create an Account" : "Complete Your Profile"}
            </h1>
            <p className="text-xs text-zinc-400 mt-1.5">
              {currentStep === 1
                ? "Join DevLink to connect with developers worldwide"
                : "Help other developers and recruiters learn about your skills"}
            </p>
          </div>

          {generalError && (
            <ErrorAlert message={generalError} className="mb-6" />
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {currentStep === 1 && (
              <>
                <div>
                  <Label htmlFor="name">Full Name or Username *</Label>
                  <div className="relative">
                    <User
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                        errors.name ? "text-red-400" : "text-zinc-500"
                      }`}
                    />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Alex Developer"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-9"
                      error={!!errors.name}
                      disabled={isLoading}
                    />
                  </div>
                  <FieldError error={errors.name} />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                        errors.email ? "text-red-400" : "text-zinc-500"
                      }`}
                    />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-9"
                      error={!!errors.email}
                      disabled={isLoading}
                    />
                  </div>
                  <FieldError error={errors.email} />
                </div>

                <div>
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                        errors.password ? "text-red-400" : "text-zinc-500"
                      }`}
                    />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-9 pr-9"
                      error={!!errors.password}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
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
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g. Senior Full Stack Engineer"
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
                      placeholder="e.g. Remote, or City, Country"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={isLoading}
                      error={!!errors.location}
                    />
                    <FieldError error={errors.location} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="primarySkills">
                    Skills (comma-separated) *
                  </Label>
                  <Input
                    id="primarySkills"
                    name="primarySkills"
                    placeholder="React, TypeScript, Node.js, GraphQL"
                    value={formData.primarySkills}
                    onChange={handleChange}
                    error={!!errors.primarySkills}
                    disabled={isLoading}
                  />
                  <FieldError error={errors.primarySkills} />
                </div>

                <div>
                  <Label htmlFor="bio">Professional Bio *</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Briefly describe your experience and what projects you're interested in..."
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    error={!!errors.bio}
                    disabled={isLoading}
                  />
                  <FieldError error={errors.bio} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="github">GitHub Profile / Username</Label>
                    <Input
                      id="github"
                      name="github"
                      placeholder="https://github.com/username"
                      value={formData.github}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                    <Input
                      id="linkedin"
                      name="linkedin"
                      placeholder="https://linkedin.com/in/username"
                      value={formData.linkedin}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="portfolio">Portfolio Website</Label>
                  <Input
                    id="portfolio"
                    name="portfolio"
                    type="url"
                    placeholder="https://myportfolio.dev"
                    value={formData.portfolio}
                    onChange={handleChange}
                    error={!!errors.portfolio}
                    disabled={isLoading}
                  />
                  <FieldError error={errors.portfolio} />
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
              >
                {isLoading
                  ? currentStep === 1
                    ? "Creating Account..."
                    : "Saving Profile..."
                  : currentStep === 1
                    ? "Continue"
                    : "Complete Profile"}
              </button>

              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={isLoading}
                  className="w-full h-9 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition-colors"
                >
                  Skip for now
                </button>
              )}
            </div>
          </form>

          {/* Footer */}
          {currentStep === 1 && (
            <div className="mt-6 text-center text-xs text-zinc-400">
              Already have an account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                disabled={isLoading}
              >
                Sign in
              </button>
            </div>
          )}

          <div className="mt-4 text-center">
            <button
              onClick={goBack}
              className="text-zinc-500 hover:text-zinc-400 text-xs transition-colors"
              disabled={isLoading}
            >
              ← {currentStep === 1 ? "Back to Home" : "Skip setup"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Auth Page
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
