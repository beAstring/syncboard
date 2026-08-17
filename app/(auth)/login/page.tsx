"use client";

import GithubLogo from "@/components/githubLogo";
import GoogleLogo from "@/components/googleLogo";
import { LoginSchema } from "@/lib/validations/auth";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { safeParse } from "zod";

export default function () {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
    general: "",
  });
  const handleSubmit = async (e: React.SubmitEvent<HTMLElement>) => {
    e.preventDefault();

    const result = LoginSchema.safeParse({
      identifier,
      password,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        identifier: fieldErrors.identifier?.[0] ?? "",
        password: fieldErrors.password?.[0] ?? "",
        general: "",
      });
      return;
    }

    setErrors({
      identifier: "",
      password: "",
      general: "",
    });

    const response = await signIn("credentials", {
      identifier,
      password,
      redirect: false,
    });
    if (response?.error) {
      setErrors({
        identifier: "",
        password: "",
        general: "Invalid username/email or password",
      });

      return;
    }

    router.push("/projects");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1d1c20]">
      <div className="border border-gray-600 w-full max-w-md p-6 rounded-xl bg-[#131212]">
        <div className="flex flex-col gap-2 items-center mt-2">
          <h1 className="text-4xl font-bold">Syncboard</h1>
          <p className="text-gray-500">Sign in to your Account</p>
        </div>

        <form className="mt-8 flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="identifier">Username or Email</label>
            <input
              className={`w-full border outline-none bg-[#2f2e34] rounded-md p-2 ${
                errors.identifier
                  ? "border-red-500"
                  : "border-gray-500 focus:border-blue-300"
              }`}
              type="text"
              placeholder="Username or Email"
              onChange={(e) => {
                setIdentifier(e.target.value);
              }}
            />
            {errors.identifier && (
              <p className="text-sm text-red-500">{errors.identifier}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full border outline-none bg-[#2f2e34] rounded-md p-2 pr-10 ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-500 focus:border-blue-300"
                }`}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2  -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {errors.general && (
            <p className="text-sm text-red-500">{errors.general}</p>
          )}

          <button
            type="submit"
            className="mt-2 font-bold w-full p-2 rounded-md bg-blue-600 cursor-pointer hover:bg-blue-700 "
          >
            Sign In
          </button>
        </form>

        <div className="flex items-center gap-3 mt-6">
          <div className="h-px flex-1 bg-gray-400"></div>
          <p className="text-sm text-gray-400">Or continue with</p>
          <div className="h-px flex-1 bg-gray-400"></div>
        </div>

        <div className="mt-3 flex flex-col gap-3">
          <button
            className="p-2 rounded-md border border-gray-500 cursor-pointer hover:bg-gray-700"
            onClick={() => signIn("google")}
          >
            <div className="flex justify-center gap-3">
              <GoogleLogo />
              <p className="font-bold">Sign In With Google</p>
            </div>
          </button>
          <button
            className="p-2 rounded-md border border-gray-500 cursor-pointer hover:bg-gray-700"
            onClick={() => signIn("github")}
          >
            <div className="flex justify-center gap-3">
              <GithubLogo />
              <p className="font-bold ">Sign In With GitHub</p>
            </div>
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't Have An Account ?{" "}
          <a href="/register" className="ml-1 text-blue-500">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
