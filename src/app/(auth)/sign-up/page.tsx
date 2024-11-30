"use client"
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import z from "zod"
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signupSchema } from "@/app/schemas/signup.schemas";
import axios, { AxiosError } from "axios";
import logoImage from "../../../../public/Images/Screenshot 2024-11-28 105955.png";
import GoogleIcon from "../../../../public/Images/png-transparent-google-logo-google-logo-google-now-google-search-google-plus-search-engine-optimization-trademark-logo-thumbnail.png";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Logo from '@/components/customeComponets/Logo';
import { Textarea } from '@/components/ui/textarea';
interface AddressDetails {
  Name: string;
  Description: string | null; // Description can be a string or null
  BranchType: string;
  DeliveryStatus: string;
  Circle: string;
  District: string;
  Division: string;
  Region: string;
  Block: string;
  State: string;
  Country: string;
  Pincode: string;
}


const page = () => {
const [currentStep,setCurrentStep] = React.useState<number>(0);
const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
const [showAddress,setshowAddress]=React.useState<string[]>([])
const [checked,setChecked]=React.useState<boolean>(false)
const {toast}=useToast()
const router=useRouter()

const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues:{
        profile:undefined,
        firstName: "",
        lastName: "",
        email: "",
      Mobile_number: "",
      gender: "male",
      age: 0,
      date_of_birth: "0000-00-00",
      zip_code: 111111,
      role: "Patient",
      address: ""
    }

})

  // Function to convert address object to a single-line string
  const convertToSingleLineString = (address: AddressDetails): string => {
    const formattedAddress = Object.entries(address)
      .map(([key, value]) => {
        if (value === null || value === "") return ""; // Skip null or empty values
        return `${key}: ${value}`;
      })
      .filter((item) => item !== "") // Filter out empty strings
      .join(", ");
    return formattedAddress;
  };

  // Function to fetch address by ZIP code
  const handleZipCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const zipCode = e.target.value;

    if (!zipCode) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid zip code.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await axios.get(
        `https://api.postalpincode.in/pincode/${zipCode}`
      );

      if (result.status === 200 && Array.isArray(result.data)) {
        const addresses = result.data[0].PostOffice;

        if (!addresses || addresses.length === 0) {
          toast({
            title: "No Addresses Found",
            description: "No addresses found for the entered ZIP code.",
            variant: "default",
          });
          return;
        }

        // Convert each address to a single-line string and add to state
        const formattedAddresses = addresses.map((address: any) => {
          const addressDetails: AddressDetails = {
            Name: address.Name,
            Description: address.Description,
            BranchType: address.BranchType,
            DeliveryStatus: address.DeliveryStatus,
            Circle: address.Circle,
            District: address.District,
            Division: address.Division,
            Region: address.Region,
            Block: address.Block,
            State: address.State,
            Country: address.Country,
            Pincode: zipCode,
          };
          return convertToSingleLineString(addressDetails);
        });

        // Update the state with the new addresses
        setshowAddress((prev) => [...prev, ...formattedAddresses]);

        toast({
          title: "Addresses Added",
          description: "The addresses have been added successfully.",
          variant: "default",
          color:"green"
        });
      } else {
        toast({
          title: "Failed to Fetch",
          description: "No addresses found for the entered ZIP code.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch address", error);
      toast({
        title: "Error",
        description: "Failed to fetch address. Please try again later.",
        variant: "destructive",
      });
    }
  };
const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setChecked(e.target.checked); // Update the checkbox state
};
const fileRef = form.register("profile")
const onSubmit = async (data: z.infer<typeof signupSchema>) => {
  try {
    setIsSubmitting(true);

    // Convert `data` to FormData
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof FileList) {
        // Handle FileList separately (e.g., for file inputs)
        Array.from(value).forEach((file) => formData.append(key, file));
      } else {
        formData.append(key, value as string);
      }
    });

    // Log FormData contents for debugging (optional)
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Send the FormData object
    const response = await axios.post("/api/sign-up", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure correct content type
      },
    });

    if (response.status === 200) {
      toast({
        title: "Account created successfully! Check your Email for verification.",
        description: "Please complete your profile.",
      });
      router.replace(`/verify/${data.Mobile_number}`);
    }
  } catch (error) {
    const axiosError = error as AxiosError;     const errorMessage = (axiosError.response?.data as { message: string })?.message || "An error occurred while processing your request.";
    console.error("Signup Error", error);
    toast({
      title: "Error",
      description: errorMessage||"Failed to create account. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};
  const onError = (errors:any) => {
    alert("errors")
    console.log("Validation errors:", errors); // Check if any validation issues exist
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
      <div className="flex flex-1 justify-center items-center ">
        <div className="w-full lg:w-3/6 flex flex-col  text-center lg:shadow-sm lg:shadow-gray-600 rounded-md p-6">
          <h1 className="text-3xl font-semibold">Sign up</h1>
          <p className='text-md text-gray-700 font-extralight '>Kindly fill the form to sign up</p>
          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)}  className="grid grid-cols-1 grid-rows-4 gap-2 md:grid-cols-2 md:grid-rows-3 md:gap-3">
          <FormField
  control={form.control}
  name="profile"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Profile</FormLabel>
      <FormControl>
        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={(e) => {
            const file = e.target.files?.[0] || null; // Handle file selection
            field.onChange(file); // Bind file to the form field
          }}
        />
      </FormControl>
      <FormDescription>
        Upload a profile picture (JPEG, PNG, or JPG, max size 2MB).
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>

     <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=' flex text-center gap-2 text-gray-700 text-md'>E-mail <Logo name="exlamation" className='w-1 h-1' style={{color:"black"}} iconSize={10} /></FormLabel>
              <FormControl>
              <Input type="email" placeholder="enter your email" className='border-solid border-gray-800 border-2 focus:border-sky-500' {...field} onBlur={() => form.trigger("email")}/>
              </FormControl>
              <FormDescription>
                Enter your valid email for further communication
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
     <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=' flex text-center gap-2 text-gray-700 text-md'>firstName <Logo name="exlamation" className='w-1 h-1' style={{color:"black"}} iconSize={10} /></FormLabel>
              <FormControl>
              <Input type="text" placeholder="enter your firstName" className='border-solid border-gray-800 border-2 focus:border-sky-500' {...field} onBlur={() => form.trigger("firstName")} />
              </FormControl>
              <FormDescription>
                first name that will be  for documents
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=' flex text-center gap-2 text-gray-700 text-md'>lastName <Logo name="exlamation" className='w-1 h-1' style={{color:"black"}} iconSize={10} /></FormLabel>
              <FormControl>
              <Input type="text" placeholder="enter your lastName" className='border-solid border-gray-800 border-2 focus:border-sky-500' {...field} onBlur={() => form.trigger("lastName")}/>
              </FormControl>
              <FormDescription>
                last name that will be  for documents
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />        
          <FormField
  control={form.control}
  name="gender"
  render={({ field }) => (
    <FormItem>
      <FormLabel className='flex text-center gap-2 text-gray-700 text-md'>
        Gender <Logo name="exlamation" className='w-1 h-1' style={{color:"black"}} iconSize={10} />
      </FormLabel>
      <FormControl>
        <select
          {...field}
          className="border-solid border-gray-800 border-2 focus:border-sky-500 p-2 rounded-md"
          onBlur={() => form.trigger("gender")}
        >
          <option value="">Select your gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </FormControl>
      <FormDescription>
        Please select your gender
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="age"
  render={({ field }) => (
    <FormItem>
      <FormLabel className='flex text-center gap-2 text-gray-700 text-md'>
        Age <Logo name="exlamation" className='w-1 h-1' style={{color:"black"}} iconSize={10} />
      </FormLabel>
      <FormControl>
        <Input
          type="number"
          placeholder="Enter your age"
          className="border-solid border-gray-800 border-2 focus:border-sky-500"
          {...field}
          onBlur={() => form.trigger("age")}
        />
      </FormControl>
      <FormDescription>
        Please enter your age (must be a valid number).
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="date_of_birth" 
  render={({ field }) => (
    <FormItem>
      <FormLabel className='flex text-center gap-2 text-gray-700 text-md'>
        Date of Birth <Logo name="exlamation" className='w-1 h-1' style={{color:"black"}} iconSize={10} />
      </FormLabel>
      <FormControl>
        <Input
          type="date"
          placeholder="Enter your date of birth"
          className="border-solid border-gray-800 border-2 focus:border-sky-500"
          {...field}
          onBlur={(e)=>form.trigger("date_of_birth")}
        />
      </FormControl>
      <FormDescription>
        Please select your date of birth
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="Mobile_number"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="flex text-center gap-2 text-gray-700 text-md">
        Mobile Number <Logo name="exlamation" className="w-1 h-1" style={{ color: "black" }} iconSize={10} />
      </FormLabel>
      <FormControl>
        <Input
          type="tel"
          placeholder="Enter your mobile number"
          className="border-solid border-gray-800 border-2 focus:border-sky-500"
          {...field}
          maxLength={10} // Ensures a maximum of 10 digits
          onBlur={() => form.trigger("Mobile_number")}
        />
      </FormControl>
      <FormDescription>
        Please enter your 10-digit mobile number.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="zip_code"
  render={({ field }) => (
    <FormItem>
      <FormLabel className='flex text-center gap-2 text-gray-700 text-md'>
        Zip Code <Logo name="exlamation" className='w-1 h-1' style={{color:"black"}} iconSize={10} />
      </FormLabel>
      <FormControl>
        <Input
          type="text"
          placeholder="Enter your zip code"
          className="border-solid border-gray-800 border-2 focus:border-sky-500"
          {...field}
          onBlur={(e)=>
            {
              //call a function to get address with zip code
              handleZipCodeChange(e)

              form.trigger("zip_code")
            }}
        />
      </FormControl>
      <FormDescription>
        Please enter a valid zip code (e.g., 12345).
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="role"
  render={({ field }) => (
    <FormItem>
      <FormLabel className='flex text-center gap-2 text-gray-700 text-md'>
        Role <Logo name="exlamation" className='w-1 h-1' style={{color:"black"}} iconSize={10} />
      </FormLabel>
      <FormControl>
        <select
          {...field}
          className="border-solid border-gray-800 border-2 focus:border-sky-500 p-2 rounded-md"
          onBlur={()=>form.trigger("role")}
        >
          <option value="">Select your role here</option>
          <option value="Patient">Patient</option>
          <option value="Doctor">Doctor</option>
        </select>
      </FormControl>
      <FormDescription>
        Please select your Role for Next account
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/><FormField
  control={form.control}
  name="address"
  render={({ field }) => (
    <FormItem className="col-span-2"> 
      <FormLabel className="flex text-center gap-2 text-gray-700 text-md">
        Address
      </FormLabel>
      <FormControl>
        <select
          className="w-full border-2 border-gray-800 rounded-md focus:border-sky-500 p-2 text-gray-700 text-sm
                     sm:text-base overflow-hidden truncate"
          {...field} // Bind field value and event handlers
          onBlur={() => form.trigger("address")}
        >
          <option value="" disabled>
            Select your address
          </option>
          {showAddress.map((address, index) => (
            <option
              key={index}
              value={address}
              className="whitespace-normal break-words text-gray-700"
            >
              {address}
            </option>
          ))}
        </select>
      </FormControl>
      <FormDescription>
        Please select your address. If it is not listed, you can change it.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>



    {/* Agreement Checkbox */}
    <div className="col-span-2 flex flex-col gap-2 w-full">
          <div className="flex items-center space-x-2 w-full">
            <input
              type="checkbox"
              id="terms"
              checked={checked}
              onChange={handleCheckboxChange} // Update the checkbox state
              className="cursor-pointer"
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none text-gray-400"
            >
              By creating an account, you are agreeing to our Terms and Conditions and Privacy Policy.
            </label>
          </div>

          {/* Continue button: Disabled if checkbox is not checked */}
          <Button
            type="submit"
            className="bg-sky-500 text-white p-2 text-center text-xl"
          
            disabled={!checked} // Disable the button when checkbox is unchecked
          >
            Continue
          </Button>
        </div>
    </form>

</Form>


    <h3 className="font-rubik font-extralight text-md mt-2">or Sign in with</h3>
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
            <Link href="/sign-in" className="text-md font-extralight text-blue-500">Click here to signup</Link>
          </div>
        </div>
      </div>
    </div>
  )

}
export default page