"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import phone input styles
import { useToast } from "@/hooks/use-toast";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/app/schemas/login.schemas";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ApiResponse } from "@/app/types/apiResponse";
import ImageLogo from "../../../../public/Images/Screenshot 2024-11-28 105955.png";
import { Button } from "@/components/ui/button";
import GoogleIcon from "../../../../public/Images/png-transparent-google-logo-google-logo-google-now-google-search-google-plus-search-engine-optimization-trademark-logo-thumbnail.png";
import EmblaCarousel from "@/components/customeComponets/EmblaCarousel";
import { EmblaOptionsType } from 'embla-carousel';
import Wallone from "../../../../public/Images/Imagewallpaper1.png";
import Wallsecond from "../../../../public/Images/Imagewallpaper2.png";
import Wallthird from "../../../../public/Images/Imagewallpaper3.png";
import Wallfour from "../../../../public/Images/hearthand.png"
import Wallfive from "../../../../public/Images/twodoctors.png"
import Wallsix from "../../../../public/Images/dctorwatching.png"
const slides: string[] = [
  Wallone.src,
  Wallsecond.src,
  Wallthird.src,
  Wallfour.src,
  Wallfive.src,
  Wallsix.src

];

const Page = () => {
  const OPTIONS: EmblaOptionsType = { loop: true };
  const [issubmitting, setIssubmitting] = React.useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  // Zod validation with react-hook-form
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  // Form submit handler
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      setIssubmitting(true);
      const updateNumber = data.phoneNumber.slice(2); // Remove country code prefix
      const response = await axios.post("/api/check-mobile-number", { phoneNumber: updateNumber });
      if (response.data.success===true||response.status===200) {
        toast({
          title: "Verification code sent",
          description: "A verification code has been sent to your email. Please verify it within an hour.",
          variant: "default",
          color:"green"
        });
        router.replace(`/verify/${updateNumber}`);
      } else {
        toast({
          title: "Error",
          description: response.data.message||"Failed to send verification code. Please try again.",
          variant: "destructive",
          color:"red"
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || "An error occurred while processing your request.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        color:"red"
      });
    } finally {
      setIssubmitting(false);
    }
  };


  return (
    <div className="flex h-full w-full bg-white absolute">
      <div className="flex flex-col space-y-6 w-full h-full relative font-rubik items-center justify-center lg:justify-start lg:items-center lg:w-1/2">
        <Image
          src={ImageLogo}
          alt="logo of EverDoseHealth"
          width={200}
          height={100}
          priority
          className="mt-7 mx-auto lg:relative lg:right-10"
        />
        <div className="flex flex-col mt-2 w-full text-center ">
          <h1 className="text-2xl font-bold font-rubik relative lg:right-24 lg:text-3xl">
            Log in
          </h1>
          <sub className="text-xs text-gray-500 relative lg:right-20">Log in to stay connected</sub>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <PhoneInput
                        placeholder="Enter mobile number"
                        country="us"
                        value={field.value}
                        onChange={(value) => {
                          form.setValue("phoneNumber", value); // Update React Hook Form value
                        }}
                        inputClass="w-full border border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        containerClass="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button
                type="submit"
                disabled={issubmitting}
                className="mt-4 px-4 py-2 w-full bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
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
                  "Log in"
                )}
              </button>
            </form>
          </Form>
          <h3 className="font-rubik font-extralight text-md mt-2">or log in with</h3>
          <Button
            type="button"
            variant="outline"
            className="w-full border border-gray-400 mt-2 py-2 px-1 flex items-center justify-center space-x-2"
          >
            <Image
              src={GoogleIcon}
              alt="google icon"
              width={20}
              height={20}
              className="h-5 w-5"
            />
            <span>Continue with Google</span>
          </Button>

          <div className="mt-2 w-full flex">
            <h1 className="text-md font-extralight font-rubik">Don't have an account?</h1>
            <Link href="/sign-up" className="text-md font-extralight text-blue-500">Click here to signup</Link>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="hidden lg:flex w-1/2 h-full relative font-rubik justify-center items-center">
        <div className="flex rounded-lg w-[72%] h-[95%] relative overflow-hidden">
          <EmblaCarousel slides={slides} options={OPTIONS} />
        </div>
      </div>
    </div>
  );
};

export default Page;
