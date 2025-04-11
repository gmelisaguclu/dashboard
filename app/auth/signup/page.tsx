"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { signup } from "@/data/actions/authActions";

const formSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      await signup(data);

      toast.success(
        "Registration successful! Please check your email to verify your account."
      );

      setTimeout(() => {
        router.push("/auth/login");
      }, 1000);
    } catch (error: any) {
      if (error.message.includes("already registered")) {
        toast.error("This email is already registered");
      } else {
        toast.error("Registration failed: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left side - Image and text */}
      <div className="hidden md:flex w-1/2 bg-[#050A16] flex-col items-center justify-center px-12 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-900/30 to-[#050A16] opacity-80"></div>
        <div className="relative z-10 text-center max-w-md">
          <div className="size-24 rounded-full bg-white mx-auto mb-6 flex items-center justify-center">
            <span className="text-5xl font-bold text-black">S</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">SEPYA</h1>
          <p className="text-gray-300 text-lg mb-6">Join our platform today</p>
          <Separator className="my-8 bg-gray-700" />
          <p className="text-gray-400 italic">
            "Create an account to access all features and manage your events
            with our comprehensive dashboard solution."
          </p>
        </div>
      </div>

      {/* Right side - Signup form */}
      <div className="w-full md:w-1/2 bg-[#050A16] flex items-center justify-center p-8">
        <Card className="w-full max-w-md bg-[#111827] border-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription className="text-gray-400">
              Fill in your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="example@sepya.com"
                          type="email"
                          {...field}
                          className="border-gray-700 bg-[#1B2438] text-white h-12 px-4 rounded-md"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          {...field}
                          className="border-gray-700 bg-[#1B2438] text-white h-12 px-4 rounded-md"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          {...field}
                          className="border-gray-700 bg-[#1B2438] text-white h-12 px-4 rounded-md"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-gray-100 font-semibold h-12 rounded-md mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>

                <div className="mt-4 text-center text-sm text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-blue-400 hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
