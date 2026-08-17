"use client";

import { useState } from "react";
import GithubLogo from "@/components/githubLogo";
import GoogleLogo from "@/components/googleLogo";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { RegisterSchema } from "@/lib/validations/auth";

import RegisterUser from "@/actions/register";
import { useRouter } from "next/navigation";

export default function () {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    identifier: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = RegisterSchema.safeParse({
      identifier,
      name,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        identifier: fieldErrors.identifier?.[0] ?? "",
        name: fieldErrors.name?.[0] ?? "",
        email: fieldErrors.email?.[0] ?? "",
        password: fieldErrors.password?.[0] ?? "",
        confirmPassword: fieldErrors.confirmPassword?.[0] ?? "",
      });
      return;
    }

    const response = await RegisterUser({
      identifier,
      name,
      email,
      password,
      confirmPassword,
    });

    if (!response.success) {
      setErrors({
        identifier: response.errors?.identifier?.[0] ?? "",
        name: response.errors?.name?.[0] ?? "",
        email: response.errors?.email?.[0] ?? "",
        password: response.errors?.password?.[0] ?? "",
        confirmPassword: response.errors?.confirmPassword?.[0] ?? "",
      });
      return;
    }

    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1d1c20]">
      <div className="w-full max-w-md border border-gray-600 rounded-xl p-6 bg-[#131212]">
        <div className="flex flex-col items-center gap-2 mt-2">
          <h1 className="text-4xl font-bold">Syncboard</h1>
          <p className="text-gray-500">Create Your Account</p>
        </div>

        <form className="mt-8 flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="font-bold">
              Username
            </label>
            <input
              type="text"
              placeholder="Username"
              className={`border  outline-none bg-[#2f2e34] rounded-md p-2 ${
                errors.identifier
                  ? "border-red-500"
                  : "border-gray-500 focus:border-blue-300"
              } `}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            {errors.identifier && (
              <p className="text-sm text-red-500">{errors.identifier}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="fullname" className="font-bold">
              Full Name
            </label>
            <input
              type="text"
              placeholder="full name"
              className={`border  outline-none bg-[#2f2e34] rounded-md p-2 ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-500 focus:border-blue-300"
              } `}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-bold">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Email Address"
              className={`border  outline-none bg-[#2f2e34] rounded-md p-2 ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-500 focus:border-blue-300"
              } `}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-bold">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`border  outline-none bg-[#2f2e34] rounded-md p-2  w-full ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-500 focus:border-blue-300"
                } `}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirmpassword" className="font-bold">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                className={`border  outline-none bg-[#2f2e34] rounded-md p-2 w-full ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-500 focus:border-blue-300"
                } `}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
          <button
            type="submit"
            className="mt-2 rounded-md bg-blue-600 p-2 text-white cursor-pointer hover:bg-blue-700"
          >
            Register
          </button>
        </form>

        <div className="flex items-center gap-3 mt-6">
          <div className="h-px flex-1 bg-gray-400"></div>
          <span className="text-sm text-gray-400">Or continue with</span>
          <div className="h-px flex-1 bg-gray-400"></div>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <button
            className="rounded-md border border-gray-500 p-2 cursor-pointer hover:bg-gray-800"
            onClick={async () => {
              await signIn("google");
            }}
          >
            <div className="flex gap-2 justify-center">
              <GoogleLogo />
              <p className="font-bold"> Sign In With Google</p>
            </div>
          </button>

          <button
            className="rounded-md border border-gray-500 p-2 cursor-pointer hover:bg-gray-700"
            onClick={async () => {
              await signIn("github");
            }}
          >
            <div className="flex gap-2 justify-center">
              <GithubLogo />
              <p className="font-bold">Sign In With GitHub</p>
            </div>
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already Have An Account ?{" "}
          <a href="/login" className="ml-1 text-blue-500">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
