"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { toast } from "sonner";

import { login } from "@/data/actions/authActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dt = await login({ email, password });

      if (!dt?.session) {
        throw new Error("Login failed");
      }

      console.log(dt, "dt");

      toast.success("Successfully logged in");
      router.push("/dashboard/about");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left side - Image and text */}
      <div className="hidden md:flex w-1/2 bg-[#050A16] flex-col items-center justify-center px-12 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/30 to-[#050A16] opacity-80"></div>
        <div className="relative z-10 text-center max-w-md">
          <div className="size-24 rounded-full bg-white mx-auto mb-6 flex items-center justify-center">
            <span className="text-5xl font-bold text-black">S</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">SEPYA</h1>
          <p className="text-gray-300 text-lg mb-6">
            Dashboard Management System
          </p>
          <Separator className="my-8 bg-gray-700" />
          <p className="text-gray-400 italic">
            "Manage your data with our comprehensive dashboard solution for
            streamlined business operations."
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 bg-[#050A16] flex items-center justify-center p-8">
        <Card className="w-full max-w-md bg-[#111827] border-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription className="text-gray-400">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@sepya.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-700 bg-[#1B2438] text-white h-12 px-4 rounded-md"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-blue-400 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-gray-700 bg-[#1B2438] text-white h-12 px-4 rounded-md"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-100 font-semibold h-12 rounded-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

              <div className="mt-4 text-center text-sm text-gray-400">
                Don't have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="text-blue-400 hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
