"use client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyvalidation } from "@/app/schemas/verify.schemas";
import * as z from "zod";
import { ApiResponse } from "@/app/types/apiResponse";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Imagelogo from "../../../../../public/Images/Screenshot 2024-11-28 105955.png";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const page = () => {
  const [issubmitting, setIssubmitting] = React.useState<boolean>(false);
  const { phoneNumber } = useParams<{ phoneNumber: string }>();
  const updateNumber = phoneNumber;
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(verifyvalidation),
    defaultValues: {
      verifycode: "",
    },
  });

  // OnSubmit to handle verify code
  const onSubmit = async (data: z.infer<typeof verifyvalidation>) => {
    setIssubmitting(true);
    try {
      const result = await axios.post("/api/verify-code", {
        Mobile_number: updateNumber,
        verifycode: data.verifycode,
      });
      console.log(result)
      if (result.data.success || result.status === 200) {
        const response = await signIn("Credentials", {
          mobile: updateNumber,
          otp: data.verifycode,
          redirect: false,
        });
        if (response?.error) {
          toast({
            title: "Error in login",
            description: response.error,
            variant: "destructive",
            color: "red",
          });
        }
        if (response?.ok) {
          toast({
            title: "Welcome, back!",
            description: "You have been successfully logged in.",
            variant: "default",
            color: "green",
          });
          router.replace("/dashboard");
        }
      } else {
        toast({
          title: "Invalid verification code",
          description: result.data.message || "Unknown error during verification",
          variant: "destructive",
          color: "red",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError?.response?.data?.message || "An unexpected error occurred";
      toast({
        title: "Error during verification",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Verification error:", error);
    } finally {
      setIssubmitting(false);
    }
  };

  // Resend OTP function
  const resendOtp = async () => {
    try {
      const result = await axios.post("/api/resend-otp", {
        Mobile_number: updateNumber,
      });
      if (result.data.success) {
        toast({
          title: "OTP Sent",
          description: "A new OTP has been sent to your phone number.",
          variant: "default",
          color: "green",
        });

        router.replace("/dashboard")
      } else {
        toast({
          title: "Error sending OTP",
          description: result.data.message || "Unknown error while sending OTP.",
          variant: "destructive",
          color: "red",
        });
      }
    } catch (error) {
      toast({
        title: "Error sending OTP",
        description: "An unexpected error occurred while resending OTP.",
        variant: "destructive",
        color: "red",
      });
      console.error("Resend OTP error:", error);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-white">
      {/* First container: Logo */}
      <div className="flex w-full h-auto">
        <Image
          src={Imagelogo}
          alt="logo of EverDoseHealth"
          width={200}
          height={100}
          priority
          className=""
        />
      </div>

      {/* Second container: Full-height container */}
      <div className="flex flex-1 justify-center items-center">
        {/* Centered Form Container */}
        <div className="w-full lg:w-3/6 h-auto flex flex-col justify-center space-y-10 lg:shadow-sm lg:shadow-gray-600 rounded-md p-6">
          <span className="flex flex-col text-center">
            <h1 className="text-2xl font-bold text-black mx-auto font-rubik">Check your Email</h1>
            <p className="text-md font-extralight font-rubik text-gray-500 max-w-sm mx-auto">
              Please type the verification code sent to your email in the box below
            </p>
          </span>

          {/* OTP form */}
          <div className="flex justify-center w-full h-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-auto mx-auto space-y-6">
                <FormField
                  control={form.control}
                  name="verifycode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup className="mx-auto">
                            <InputOTPSlot className="border border-black font-bold" index={0} />
                            <InputOTPSlot className="border border-black font-bold" index={1} />
                            <InputOTPSlot className="border border-black font-bold" index={2} />
                            <InputOTPSlot className="border border-black font-bold" index={3} />
                            <InputOTPSlot className="border border-black font-bold" index={4} />
                            <InputOTPSlot className="border border-black font-bold" index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription>
                        Please enter the one-time password sent to your phone.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={issubmitting}
                  className="mt-4 px-4 py-2 w-full bg-blue-500 text-white hover:bg-blue-600 rounded-md flex items-center justify-center font-semibold shadow-md hover:shadow-lg transition duration-300 ease-in-out"
                >
                  {issubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      <p className="ml-2 text-white font-bold opacity-75">Submitting</p>
                    </>
                  ) : (
                    "Continue"
                  )}
                </button>
              </form>
            </Form>
          </div>

          {/* Link for resend OTP */}
          <div className="flex justify-center items-center text-center">
            <h1 className="text-md font-rubik">Didn't receive the code?</h1>
            <Button variant="link" className="text-blue-500 text-md font-rubik ml-2" onClick={resendOtp}>
              Resend OTP
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
