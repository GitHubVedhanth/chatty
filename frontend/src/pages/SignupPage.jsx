import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore.js";
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Mail,
  MessageSquare,
  User,
  Lock,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import ImagePattern from "../components/ImagePattern";

function SignupPage() {
  
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const { isSigningUp, signUp, setSignUp } = useAuthStore();
  const validateForm = () => {
    if (!formData.fullname.trim()) return toast.error("Full name is required");

    if (!formData.email.trim()) return toast.error("email is required");

    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("email not correct");

    if (!formData.password.trim()) return toast.error("password is required");

    return true
  };
  const handleSubmit = async (e) => {
  e.preventDefault(); // always stop default first

  const isValid = validateForm();
  if (!isValid) {
    toast.error("invalid form data")
    return; 
  }

  const redirect = await signUp(formData);
  if(redirect){
    navigate('/HomePage');
  }
};

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-gray-500">
                Get Started with your free account
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-gray-500 z-10" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="John Doe"
                  value={formData.fullname}
                  onChange={(e) =>
                    setFormData({ ...formData, fullname: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-gray-500 z-10" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10"
                  placeholder="you@gmail.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-gray-500 z-10 " />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {!showPassword ? (
                    <EyeOff className="size-5 text-gray-500" />
                  ) : (
                    <Eye className="size-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/** RIGHT SIDE */}
      <ImagePattern
        title="SIGINING IN"
        subtitle="chat with them ...Lorem ipsum dolor sit amet.
      "
      />
    </div>
  );
}

export default SignupPage;
