"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push("/");
    } else {
      setError("Username atau password salah");
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">

        <div className="mb-6">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white sm:text-title-md">
            Faunatic Dashboard Login
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Only team members can access this dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="space-y-6">

            {/* USERNAME */}
            <div>
              <Label>
                Username <span className="text-error-500">*</span>
              </Label>

              <Input
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}

            {/* LOGIN BUTTON */}
            <Button className="w-full" size="sm">
              Sign In
            </Button>

          </div>
        </form>
      </div>
    </div>
  );
}