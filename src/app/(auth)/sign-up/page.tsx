"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import logoImage from "../../../../public/Images/Screenshot 2024-11-28 105955.png";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signupSchema } from "@/app/schemas/signup.schemas";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FormItem {
  name: "profile" | "firstName" | "lastName" | "email" | "Mobile_number" | "gender" | "age" | "date_of_birth" | "zip_code" | "role"   | "address";
  itemno: number;
  type: string;
  label: string;
  placeholder: string;
  buttonname: string;
}

const Page = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const form: FormItem[] = [
    {
      itemno: 1,
      name: "profile",
      label: "Upload your profile picture",
      type:"file",
      placeholder: "Upload your profile picture",
      buttonname: "Upload"
    },
    {
      itemno: 2,
      name: "firstName",
      label: "What is your first name?",
      type:"text",
  
      placeholder: "Enter your first name",
      buttonname: "Continue"
    },
    {
      itemno: 3,
      name: "lastName",
      label: "What is your last name?",
      type:"text",
      placeholder: "Enter your last name",
      buttonname: "Continue"
    },
    {
      itemno: 4,
      name: "email",
      label: "What is your email?",
      type:"email",
      placeholder: "Enter your email example: 9Q2Tt@example.com",
      buttonname: "Continue"
    },
    {
      itemno: 5,
      name: "Mobile_number",
      label: "What is your mobile number?",
      type:"number",
  
      placeholder: "Enter your mobile number",
      buttonname: "Continue"
    },
    {
      itemno: 6,
      name: "gender",
      label: "What is your gender?",
      type:"text",
  
      placeholder: "Enter your gender",
      buttonname: "Next"
    },
    {
      itemno: 7,
      name: "age",
      label: "What is your age?",
      type:"number",
  
      placeholder: "Enter your age",
      buttonname: "Continue"
     },
     {
      itemno: 8,
      name: "zip_code",
      label: "What is your location  zip code?",
      type:"number",
  
      placeholder: "Enter your zip code",
      buttonname: "Continue"
     },
     {
      itemno: 9,
      name: "address",
      label: "What is your address?",
      type:"text",
  
      placeholder: "Enter your address",
      buttonname: "Submit"
     },
  ];

  const register = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      profile:"",
      firstName: "",
      lastName: "",
      email: "",
      Mobile_number: "",
      gender: "male",
      age: 0,
      zip_code: 111111,
      role: "patient",
      address: ""
    },
  });


  const handleNext = async () => {
    const isValid =  await register.trigger(form[currentStep].name as "profile" | "firstName" | "lastName" | "email" | "Mobile_number" | "gender" | "age" | "date_of_birth" | "zip_code" | "role"   | "address" );
    if (isValid) {
      console.log()
      setCurrentStep((prev) => Math.min(prev + 1, form.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    try {
      setIsSubmitting(true);
      console.log(data)
      alert("data")
      const response = await axios.post("/api/signup", data);
      if (response.status === 200) {
        toast({
          title: "Account created successfully!",
          description: "Please complete your profile.",
        });
      }
    } catch (error) {
      console.error("Signup Error", error);
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-white">
      <div className="flex w-full h-auto">
        <Image
          src={logoImage}
          alt="logo"
          width={200}
          height={100}
          priority
        />
      </div>
      <div className="flex flex-1 justify-center items-center">
        <div className="w-full lg:w-3/6 flex flex-col p-6 text-center">
          <h1 className="text-3xl font-semibold">Sign up</h1>
          <Form {...register}>
            <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-6">
              <div className="relative overflow-hidden w-full h-36">
                <AnimatePresence mode="wait">
                  {form.map(
                    (step, index) =>
                      index === currentStep && (
                        <motion.div
                          key={step.name}
                          initial={{ x: "100%", opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: "-100%", opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-0"
                        >
                          <FormField
                            control={register.control}

                            name={step.name}
                            render={({ field,fieldState }) => (
                              <FormItem>
                                <FormLabel>{step.label}</FormLabel>
                                <FormControl>
                                  <Input
                                    type={step.type}
                                    placeholder={step.placeholder}
                                    {...field}
                                    onChange={(e) => {
                                      if (step.name === "age"|| step.name === "zip_code") {
                                        field.onChange(Number(e.target.value)); 
                                      }
                                      if(step.name === "profile"){
                                        if (e.target.files?.[0]) {
                                          field.onChange(e.target.files[0]);
                                        }
                                      }
                                      else {
                                        field.onChange(e.target.value); // Keep string value for text fields
                                      }
                                    }
                                  }
                                    value={field.value as string | number}
                                  />
                                </FormControl>
                                <FormMessage>{fieldState.error?.message}</FormMessage>
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )
                  )}
                </AnimatePresence>
              </div>
              <div className="flex justify-between">
                {currentStep > 0 && (
                  <Button type="button" onClick={handlePrevious}>
                    Back
                  </Button>
                )}
                {/* <Button
                  type={currentStep === form.length - 1 ? "submit" : "button"}
                  onClick={currentStep !== form.length - 1 ? handleNext : undefined}
                  disabled={isSubmitting}
                >
                  {currentStep === form.length - 1 ? "Submit" : form[currentStep].buttonname}
                </Button> */}
                <Button
                type={currentStep === form.length - 1 ? "submit" : "button"}
                onClick={currentStep === form.length - 1 ? undefined : handleNext}
                  disabled={isSubmitting}
                     >
              {currentStep === form.length - 1 ? "Submit" : form[currentStep].buttonname}
               </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Page;
