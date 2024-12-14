"use client";
import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { combinedDoctorSchema } from "@/app/schemas/doctorsignup.schemas";
import Image from "next/image";
import LogoImage from "../../../../../public/Images/Screenshot 2024-11-28 105955.png";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Logo from "@/components/customeComponets/Logo";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Timepicker from "@/components/customeComponets/Timepicker";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { currencies, institutionOptions, languageOptions, Option } from "@/app/constants/SelectOptions";
import dynamic from "next/dynamic";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
const MultiSelect=dynamic(()=>import('@/components/customeComponets/Mutliselect'),{ssr:false})
const CreatableSelect = dynamic(()=>import('react-select/creatable'), { ssr: false })
const defaultValues = {
  specialization: "",
  experience_years: 0,
  availableEveryDay: "Yes",
  availability: [
    {
      day: "",
      time_slots: [],
    },
  ],
  bio: "", 
  bio_details: {
   
    educations: [
      {
        degree: "",
        institution: "",
        year_of_graduation: new Date().getFullYear(),
        file:undefined
      },
    ],
    certifications: [
      {
        certification_name: "",
        institution: "",
        issue_date: new Date().toISOString().split('T')[0],
        file:undefined
      },
    ],
    license_number: "",
    license_issued_by: "",
    license_type: "",
    license_proof:undefined,
    clinic_details: {
      clinic_name: "",
      clinic_address: "",
      clinic_zipcode: 111111,
      contact_number: "",
      email: "",
    },
    haveAwards: "No",
    awards_recognition: [
      {
        award_name: "",
        year_received: new Date().getFullYear(),
        description: "",
      },
    ],
    languages_spoken: [],
    social_links: [],
    consultation_fees: 0,
    consulation_currency: "usd",
  },
};
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
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
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [checked,setChecked]=React.useState<boolean>(false)
  const [timeSlots, setTimeSlots] = React.useState<string[]>([]);
  const [isAvaiblableEveryDay, setIsAvailableEveryDay] = React.useState<string>("No");
  const [showAddress,setshowAddress]=React.useState<string[]>([])
  const {toast}=useToast()
  const form = useForm<z.infer<typeof combinedDoctorSchema>>({ resolver: zodResolver(combinedDoctorSchema), defaultValues });
  const { fields:AvailabilityField, append:AvailabilityAppend, remove:AvailabilityRemove } = useFieldArray({
    control: form.control,
    name: "availability",
  });
const {fields:EducationFields,append:EducationAppend,remove:EducationRemove}=useFieldArray({
control:form.control,
name:"bio_details.educations"
})

const {fields:CeriticationFields,append:CeriticationAppend,remove:CeriticationRemove}=useFieldArray({
  control:form.control,
  name:"bio_details.certifications"
})

const {fields:AwardsFields,append:AwardsAppend,remove:AwardsRemove}=useFieldArray({
  control:form.control,
  name:"bio_details.awards_recognition"
})

  const onSubmit = async (data: z.infer<typeof combinedDoctorSchema>) => {
try {
  alert('hey we got data happily')
  console.log(data)
} catch (error) {
  console.log("error",error)
}

  };
  const onError = (errors: any) => {
    alert("errors");
    console.log("Validation errors:", errors);
  };

  const handleSaveTime = (times: { startTime: string; endTime: string }) => {
    console.log("Start Time:", times.startTime);
    console.log("End Time:", times.endTime);
  };


  const addTimeSlot = (formattedSlot: string) => {
    setTimeSlots((prevSlots:string[]) => [...prevSlots, formattedSlot]);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked); // Update the checkbox state
  };

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




  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <div className="flex w-full justify-center p-4">
        <Image src={LogoImage} alt="logo" width={200} height={100} priority />
      </div>
      <div className="flex flex-1 justify-center items-center p-4">
        <div className="w-full lg:w-3/6 flex flex-col text-center shadow-sm shadow-gray-600 rounded-md p-6">
          <h1 className="text-3xl font-semibold">Doctor Form</h1>
          <p className="text-md text-gray-700 font-extralight">Kindly fill the form to register as a doctor</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <FormField control={form.control} name="specialization" render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-center text-gray-700 text-md">Specialization</FormLabel>
                  <FormControl>
                    <Input placeholder="Specialization" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please enter your specialization e.g. Cardiologist, Dermatologist, Orthopedic etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="experience_years" render={({ field }) => (
                <FormItem className="col-span-2 lg:col-span-1">
                  <FormLabel className="text-center text-gray-700 text-md">Experience Years</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Experience Years" 
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        if (!isNaN(value)) {
                          field.onChange(value);
                        }
                      }}
                      onBlur={(e) => form.trigger("experience_years")}
                    />
                  </FormControl>
                  <FormDescription>Please enter your experience in years.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="availableEveryDay" render={({ field }) => (
                <FormItem className="flex flex-col w-full py-2 col-span-2 lg:col-span-1">
                  <FormLabel className="text-center text-gray-700 text-md">Are you Available Every Day??</FormLabel>
                  <FormControl>
                    <div className="flex justify-center w-full">
                      <RadioGroup
                        {...field}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setIsAvailableEveryDay(value);
                          for(let i=0;i<6;i++){
                         if( AvailabilityField.length <= 6){
                            AvailabilityAppend({ day: days[i], time_slots: [] }); 
                          }
                         }
                        }}

                        defaultValue="No"
                      >
                        <div className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Yes" id="r1" />
                            <Label htmlFor="r1">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="No" id="r2" />
                            <Label htmlFor="r2">No</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
{/* select a day for availability */}
              <div className="flex flex-col shadow-sm shadow-gray-300 rounded-md w-full col-span-2">
                <div className="flex justify-between w-full p-2 rounded">
                  <h3 className="text-md text-gray-700 font-semibold">Available Times and Days Schedule</h3>
                  <Logo name="downarrow" className="w-3 h-3" containerClass="flex-end" style={{ color: "gray" }} iconSize={15} />
                </div>
                { AvailabilityField && AvailabilityField.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <Label htmlFor="dayselect" className="text-md text-gray-700">Choose Day you are available</Label>
                      <Controller 
                      control={form.control}
                      name={`availability.${index}.day`}
                      render={({ field }) => (
                        <select {...field} onBlur={()=>form.trigger(`availability.${index}.day`)} id='dayselect' className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        >
                        <option value={''}>Select a day</option>
                            {days.map((day,index) => (
                              <option key={day} value={day.toLowerCase()}>{day}</option>
                            ))}
                      </select>  
                      )}
                      >

                      </Controller>
                      
                    </div>
  
                    <div className="flex flex-col col-span-2 ">
                      <Label htmlFor="" className="text-md text-gray-700">Time Slots</Label>
                      <Controller
                      control={form.control}
                      name={`availability.${index}.time_slots`}
                      render={({ field,fieldState }) => (
                        <>
                        <div className="flex w-auto mx-auto md:mx-0 ">
                        <Timepicker
  updateTime={field.value}
  onSave={(time_slots) => {
    if (time_slots) {
      const [start, end] = time_slots.split("-").map((t) => t.trim());
      console.log("Start Time:", start);
      console.log("End Time:", end);

      // Parse times to Date objects
      const currentTime = new Date();
      const parseTime = (timeStr: string) => {
        const [time, period] = timeStr.split(" ");
        const [hour, minute] = time.split(":");
        console.log(`Parsing Time: ${time}, Period: ${period}`); // Log time and period
        let hours = parseInt(hour, 10);
        const minutes = parseInt(minute, 10);
        
        if (period === "PM" && hours < 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
        console.log(`Parsed Hours: ${hours}, Minutes: ${minutes}`); // Log parsed hours and minutes
      
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
      };
      

      const startTime = parseTime(start);
      const endTime = parseTime(end);

      console.log("Parsed Start Time:", startTime);
      console.log("Parsed End Time:", endTime);

      // Validation: Check if end time is in the future and start time is valid
        if (startTime < endTime) {
          const existingSlots = field.value || [];
          console.log("End time is later than start time.");
          // Ensure unique values in updatedSlots
          if (!existingSlots.includes(time_slots)) {
            const updatedSlots = [...existingSlots, time_slots];
            field.onChange(updatedSlots);
            alert("Time slot added successfully!");
          } else {
            alert("This time slot already exists.");
          }
        } else {
          alert("Start time must be before end time.");
        }
      
    } else {
      alert("Invalid time slot input.");
    }
  }}
/>


                      
                      </div>
                      {fieldState.error && (
                        <p className="text-sm text-red-500">{fieldState.error.message}</p>
                      )}
                      </>
                      )}/>
                    </div>
  
                    <div className="flex space-x-2 w-full">
                      <Button variant="destructive" className="bg-red-500 text-white mt-auto w-full" onClick={()=>{
                        if(index > 0) {remove:AvailabilityRemove(index)}
                        else {alert("You cannot remove:AvailabilityRemove the first field")}
                        }}>
                        <Logo name="delete" className="w-5 h-5 mr-2" style={{ color: "white" }} iconSize={20} />
                        {/* Remove */}
                      </Button>
                      <Button variant="default" className="bg-green-500 text-white mt-auto w-full" onClick={()=>{
                        if( AvailabilityField.length <= 6){  
                        AvailabilityAppend({day:"",time_slots:[]})
                        }
                      }
                    }>
                        <Logo name="plus" className="w-5 h-5 mr-2" style={{ color: "white" }} iconSize={20} />
                        {/* Add More */}
                      </Button>
                    </div>
                  </div>
                ))}
                
              </div>

              {/* read bio */}
              <FormField control={form.control} name="bio" render={({ field }) => (
                <FormItem className="col-span-2 text-start">
                  <FormLabel className="text-start text-gray-700 text-md">Bio</FormLabel>
                  <FormControl>
                    <Input className="border-2 border-solid border-gray-400 rounded-md w-full  " placeholder="Enter your bio" {...field} />
                  </FormControl>
                  <FormDescription className="text-start">
                    We would love to know a little bit about you. Please enter a short bio, it will help your patients to know you better.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              {/* education details  */}
              <div className="flex flex-col shadow-sm shadow-gray-300 rounded-md w-full col-span-2 py-2">
                <div className="flex justify-between w-full p-2 rounded">
                  <h3 className="text-md text-gray-700 font-semibold">Education Details</h3>
                  <Logo name="downarrow" className="w-3 h-3" containerClass="flex-end" style={{ color: "gray" }} iconSize={15} />
                </div>
                {
                EducationFields && EducationFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 grid-rows-4 gap-4 md:grid-cols-2 md:grid-rows-2 ">
                     {/* //   qualification */}
                      <div className="col-span-2 md:col-span-1">
                      <Label htmlFor="degree" className="text-md text-gray-700">Educationational Certificate</Label>
                      <Controller
                      control={form.control}
                      name={`bio_details.educations.${index}.degree`}
                      render={({ field }) => (
                        <Input className="border-2 border-solid border-gray-400 rounded-md w-full  " placeholder=" Certification name" {...field} />
                      )}
                      ></Controller>
                      </div>
                      {/* institution */}
                      <div className="col-span-2 md:col-span-1"> 
  <label htmlFor="institution">Select or Create Institution</label>
  <Controller
    control={form.control}
    name={`bio_details.educations.${index}.institution`}
    render={({ field }) => (
      <CreatableSelect
        id="institution"
        {...field}
        isClearable
        options={institutionOptions} // Ensure this is structured as [{ label, value }, ...]
        value={
          field.value
            ? { label: field.value, value: field.value } // Map the value for CreatableSelect
            : null
        }
        onChange={(newValue: any, actionMeta: any) =>
          field.onChange(newValue ? newValue.value : null) // Update the form value
        }
        placeholder="Select or type to create..."
      />
    )}
  />
</div>

{/* {yead of qualication } */}
<div className="col-span-2 md:col-span-1">
  <Label htmlFor="qualificationYear" className="text-md text-gray-700">
    Year of Qualification
  </Label>
  <Controller
    control={form.control}
    name={`bio_details.educations.${index}.year_of_graduation`}
    render={({ field }) => (
      <select
        id="qualificationYear"
        className="border-2 border-solid border-gray-400 rounded-md w-full py-1"
        {...field}
      >
        {/* Dynamically generate years */}
        <option value="">Select Year</option>
        {Array.from({ length: 50 }, (_, i) => {
          const year = new Date().getFullYear() - i; // Generate last 50 years
          return (
            <option key={year} value={Number(year)}>
              {year}
            </option>
          );
        })}
      </select>
    )}
  ></Controller>
</div>

{/* {proof of qualication } */}
<div className="col-span-2 md:col-span-1 flex flex-col">
  <Label htmlFor={`result_${index}`} className="mb-1">
    Upload Proof of Qualification
  </Label>
  
  <Controller
    control={form.control}
    name={`bio_details.educations.${index}.file`}
    render={({ field, fieldState }) => (
      <>
        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={(e) => {
            const file = e.target.files?.[0] || null; // Handle file selection
            
            // Check if the file is valid before setting it in the form
            if (file instanceof File) {
              field.onChange(file); // Bind file to the form field
            } else {
              console.error("Selected file is not a valid File object");
            }
          }}
        />
        {fieldState.error && (
          <p className="text-sm text-red-500">{fieldState.error.message}</p>
        )}
      </>
    )}
  />
</div>

{/* button for adding more education or deleting */}
<div className='flex w-1/2 justify-between   space-x-10 md:space-x-20 col-span-2 mx-auto'>
                      <Button variant="destructive" className="shadow-md" onClick={() => EducationRemove(index)}>Remove</Button>
                      <Button variant="outline" className="shadow-md" onClick={() =>
                        EducationAppend({
                          degree: "",
                          institution: "",
                          year_of_graduation: new Date().getFullYear(),
                          file: undefined
                        })
                      }>
                        Add More</Button>
                    </div>


                  </div>
                ))
                }
                
                </div>
                

                {/* Certifications */}
                <div className="flex flex-col shadow-sm shadow-gray-300 rounded-md w-full col-span-2 py-2">
                <div className="flex justify-between w-full p-2 rounded">
                  <h3 className="text-md text-gray-700 font-semibold">Certication (upload Your Certifications)</h3>
                  <Logo name="downarrow" className="w-3 h-3" containerClass="flex-end" style={{ color: "gray" }} iconSize={15} />
                </div>
{
  CeriticationFields && CeriticationFields.map((field,index)=>(
    <div key={field.id} className="grid grid-cols-1 grid-rows-4 gap-4 md:grid-cols-2 md:grid-rows-2 ">
{/* {cerificates name } */}
<div  className="col-span-2 md:col-span-1">
  <Label htmlFor={`certification_name_${index}`} className="text-md text-gray-700">
    Certification Name
  </Label>
  <Controller
    control={form.control}
    name={`bio_details.certifications.${index}.certification_name`}
    render={({ field }) => (
      <input
        type="text"
        id={`certification_name_${index}`}
        placeholder='Certification Name'
        className="border-2 border-solid border-gray-400 rounded-md w-full py-2"
        {...field}
      />
    )}
  />
</div>
{/* {authoristed institution} */}
<div  className="col-span-2 md:col-span-1">
  <Label htmlFor={`authority_${index}`} className="text-md text-gray-700">
    Authority
  </Label>
  <Controller
    control={form.control}
    name={`bio_details.certifications.${index}.institution`}
    render={({ field }) => (
      <input
        type="text"
        id={`authority_${index}`}
        placeholder='Authority'
        className="border-2 border-solid border-gray-400 rounded-md w-full py-2"
        {...field}
      />
    )}
  />
  </div>

  {/* {issue date } */}
<div  className="col-span-2 md:col-span-1">
  <Label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="IssueDate">
Issue Date
  </Label>
  <Controller
  control={form.control}
  name={`bio_details.certifications.${index}.issue_date`}
  render={({ field,fieldState }) => (
    <>
    <Input
      {...field}
      id="IssueDate"
      type="date"
      value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
      ></Input>
      {fieldState.error && (
         <p className="text-sm text-red-500">{fieldState.error.message}</p>
          )}
    </>
  )}></Controller>
</div>

{/* {proof of Certificate } */}
<div  className="col-span-2 md:col-span-1">
  <Label htmlFor={`result_${index}`} className="mb-1">
    Upload Certicate Image
  </Label>
  
  <Controller
    control={form.control}
    name={`bio_details.certifications.${index}.file`}
    render={({ field, fieldState }) => (
      <>
        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={(e) => {
            const file = e.target.files?.[0] || null; // Handle file selection
            
            // Check if the file is valid before setting it in the form
            if (file instanceof File) {
              field.onChange(file); // Bind file to the form field
            } else {
              console.error("Selected file is not a valid File object");
            }
          }}
        />
        {fieldState.error && (
          <p className="text-sm text-red-500">{fieldState.error.message}</p>
        )}
      </>
    )}
  />
</div>

{/* button for adding more Certicicate or deleting */}
<div className="w-full  col-span-2">
<div className='flex w-1/2 justify-between   space-x-10 md:space-x-20  mx-auto '>
                      <Button variant="destructive" className="shadow-md" onClick={() => CeriticationRemove(index)}>Remove</Button>
                      <Button variant="outline" className="shadow-md" onClick={() =>
                          CeriticationAppend({
                            certification_name: "",
                            institution: "",
                            issue_date: new Date().toISOString().split('T')[0],
                            file: undefined
                        })
                      }>
                        Add More</Button>
                    </div>
                    </div>




    </div>
  ))
}

                  </div>  

{/* {licence details about doctor} */}
<div className="flex flex-col shadow-sm shadow-gray-300 rounded-md w-full col-span-2">
                <div className="flex justify-between w-full p-2 rounded">
                  <h3 className="text-md text-gray-700 font-semibold">
                    Licence info</h3>
                  <Logo name="downarrow" className="w-3 h-3" containerClass="flex-end" style={{ color: "gray" }} iconSize={15} />
                </div>
                <div className="grid grid-cols-1 grid-rows-4 gap-4 md:grid-cols-2 md:grid-rows-2 ">
                  
                  {/* {licence number } */}
                  <FormField control={form.control} name="bio_details.license_number" render={({ field }) => (
  <FormItem className="col-span-2 lg:col-span-1">
    <FormLabel className="text-center text-gray-700 text-md">License Number</FormLabel>
    <FormControl>
      <Input
        type="text"
        placeholder="Enter License Number"
        {...field}
      />
    </FormControl>
    <FormDescription>Please enter your license number.</FormDescription>
    <FormMessage />
  </FormItem>
)} />

{/* {license issue bby} */}
<div  className="col-span-2 md:col-span-1">
  <label htmlFor="issue_by" className="block text-gray-700 text-sm font-bold mb-2">Licence Issued By</label>
  <Controller
    control={form.control}
    name={`bio_details.license_issued_by`}
    render={({ field }) => (
      <CreatableSelect
        id="issue_by"
        {...field}
        isClearable
        options={institutionOptions} // Ensure this is structured as [{ label, value }, ...]
        value={
          field.value
            ? { label: field.value, value: field.value } // Map the value for CreatableSelect
            : null
        }
        onChange={(newValue: any, actionMeta: any) =>
          field.onChange(newValue ? newValue.value : null) // Update the form value
        }
        placeholder="Select or type to create..."
      />
    )}
  />
   </div>
 

    {/* {license type} */}
<div  className="col-span-2 md:col-span-1">
  <label htmlFor="license_type" className="block text-gray-700 text-sm font-bold mb-2">Licence Type</label>
  <Controller
    control={form.control}
    name={`bio_details.license_type`}
    render={({ field }) => (
      <CreatableSelect
        id="license_type"
        {...field}
        isClearable
        options={institutionOptions} // Ensure this is structured as [{ label, value }, ...]
        value={
          field.value
            ? { label: field.value, value: field.value } // Map the value for CreatableSelect
            : null
        }
        onChange={(newValue: any, actionMeta: any) =>
          field.onChange(newValue ? newValue.value : null) // Update the form value
        }
        placeholder="Select or type license type..."
      />
    )}
  />
</div>

{/* {license proof } */}
<div className="col-span-2 md:col-span-1 flex flex-col">
  <Label htmlFor={`bio_details.license_proof`} className="mb-1">
    Upload Licence Image
  </Label>
  
  <Controller
    control={form.control}
    name={`bio_details.license_proof`}
    render={({ field, fieldState }) => (
      <>
        <input
          type="file"
          id={`bio_details.license_proof`}
          accept="image/jpeg,image/png,image/jpg"
          onChange={(e) => {
            const file = e.target.files?.[0] || null; // Handle file selection
            
            // Check if the file is valid before setting it in the form
            if (file instanceof File) {
              field.onChange(file); // Bind file to the form field
            } else {
              console.error("Selected file is not a valid File object");
            }
          }}
        />
        {fieldState.error && (
          <p className="text-sm text-red-500">{fieldState.error.message}</p>
        )}
      </>
    )}
  />
</div>

   </div>

</div>

{/* {clinic details } */}
<div className="flex flex-col shadow-sm shadow-gray-300 rounded-md w-full col-span-2">
                <div className="flex justify-between w-full p-2 rounded">
                  <h3 className="text-md text-gray-700 font-semibold">Clinic details</h3>
                  <Logo name="downarrow" className="w-3 h-3" containerClass="flex-end" style={{ color: "gray" }} iconSize={15} />
                </div>
<div className="grid grid-cols-1 grid-rows-4 gap-4 md:grid-cols-2 md:grid-rows-2">

{/* {clinic name } */}
<div>
<Label htmlFor={`bio_details.clinic_details.clinic_name`} className="text-md text-gray-700">
    clinic Name
  </Label>
  <Controller
    control={form.control}
    name={`bio_details.clinic_details.clinic_name`}
    render={({ field }) => (
      <input
        type="text"
        id={`bio_details.clinic_details.clinic_name`}
        placeholder='Clinic Name'
        className="border-2 border-solid border-gray-400 rounded-md w-full py-2"
        {...field}
      />
    )}
  />

</div>

{/* {clinic email } */}
<div>
  <Label htmlFor={`bio_details.clinic_details.email`} className="text-md text-gray-700">
    Email For Clinic
  </Label>
  <Controller
    control={form.control}
    name={`bio_details.clinic_details.email`}
    render={({ field }) => (
      <input
        type="email"
        id={`bio_details.clinic_details.email`}
        placeholder='Certification Name'
        className="border-2 border-solid border-gray-400 rounded-md w-full py-2"
        {...field}
      />
    )}
  />
</div>
    {/* contact number  */}
    <div>
<Label htmlFor={`bio_details.clinic_details.contact_number`} className="text-md text-gray-700">
    clinic Number
  </Label>
  <Controller
    control={form.control}
    name={`bio_details.clinic_details.contact_number`}
    render={({ field }) => (
      <input
        type="text"
        id={`bio_details.clinic_details.contact_number`}
        placeholder='Clinic Number'
        className="border-2 border-solid border-gray-400 rounded-md w-full py-2"
        {...field}
      
      />
    )}
  />

</div>

{/* {zip code for clinic } */}
<div>
<Label htmlFor={`bio_details.clinic_details.clinic_zipcode`} className="text-md text-gray-700">
    zipcode
  </Label>
  <Controller
    control={form.control}
    name={`bio_details.clinic_details.clinic_zipcode`}
    render={({ field }) => (
      <input
        type="text"
        id={`bio_details.clinic_details.clinic_zipcode`}
        placeholder='zip code '
        className="border-2 border-solid border-gray-400 rounded-md w-full py-2"
        {...field}
        onBlur={(e) => {
          handleZipCodeChange(e)
          form.trigger("bio_details.clinic_details.clinic_zipcode")
        }
      }
      />
    )}
  />
</div>

    </div>
{/* {"select address with zip code "} */}
<div className="flex flex-col w-full col-span-2 shadow-md">
  <Label
    htmlFor="address"
    className="text-md text-gray-700"
  >
    Address
  </Label>
  <Controller
    control={form.control}
    name="bio_details.clinic_details.clinic_address"
    render={({ field }) => (
      <select
        id="address"
        className="w-full border-2 border-gray-400 rounded-md focus:border-sky-500 p-2 text-gray-700 text-sm sm:text-base overflow-hidden truncate"
        {...field} // Bind field value and event handlers
        onBlur={() => form.trigger("bio_details.clinic_details.clinic_address")} // Trigger validation on blur
      >
        <option value="" disabled>
          Select your address
        </option>
        {showAddress && showAddress.map((address, index) => (
          <option
            key={index}
            value={address}
            className="whitespace-normal break-words text-gray-700"
          >
            {address}
          </option>
        ))}
      </select>
    )}
  />
</div>

</div>


{/* {do you got any award for your work} */}
<FormField 
  control={form.control} 
  name="bio_details.haveAwards" 
  render={({ field }) => (
    <FormItem className="flex flex-col w-full py-2 col-span-2 ">
      <FormLabel className="text-center text-gray-700 text-md">
        Have you received any awards or recognition for your contributions as a doctor? We'd love to know!
      </FormLabel>
      <FormControl>
        <div className="flex justify-center w-full">
          <RadioGroup
            {...field}
            onValueChange={(value) => {
              field.onChange(value);
            }}
            defaultValue="No"
          >
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Yes" id="awardYes" />
                <Label htmlFor="awardYes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="awardNo" />
                <Label htmlFor="awardNo">No</Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

{/* {awars inforamtionn } */}
{form.getValues("bio_details.haveAwards") === "Yes" && (
  <div className="flex flex-col shadow-sm shadow-gray-300 rounded-md w-full col-span-2 py-2">
                <div className="flex justify-between w-full p-2 rounded">
                  <h3 className="text-md text-gray-700 font-semibold">Awards Information</h3>
                  <Logo name="downarrow" className="w-3 h-3" containerClass="flex-end" style={{ color: "gray" }} iconSize={15} />
                </div>
{
  AwardsFields && AwardsFields.map((field, index) => (
    <div key={field.id} className="grid grid-cols-1 grid-rows-4 gap-4 md:grid-cols-2 md:grid-rows-2 shadow-sm">
      {/* {award  name} */}
      <div>
      <Label htmlFor={`bio_details.awards_recognition.${index}.award_name`} className="text-md text-gray-700">
        Award Name
        </Label>
        <Controller
          control={form.control}
          name={`bio_details.awards_recognition.${index}.award_name`}
          render={({ field }) => (
            <Input className="border border-solid border-gray-400 rounded-md w-full " {...field} placeholder="Award Name"/>
          )}></Controller>
      </div>

{/* {year of awards } */}
<div>
  <Label htmlFor={`bio_details.awards_recognition.${index}.year_received`} className="text-md text-gray-700">
    award of year
  </Label>
  <Controller
    control={form.control}
    name={`bio_details.awards_recognition.${index}.year_received`}
    render={({ field }) => (
      <select
        id={`bio_details.awards_recognition.${index}.year_received`}
        className="border-2 border-solid border-gray-400 rounded-md w-full py-2"
        {...field}
      >
        {/* Dynamically generate years */}
        <option value="">Select Year</option>
        {Array.from({ length: 50 }, (_, i) => {
          const year = new Date().getFullYear() - i; // Generate last 50 years
          return (
            <option key={year} value={Number(year)}>
              {year}
            </option>
          );
        })}
      </select>
    )}
  ></Controller>
</div>

{/* {awards description} */}
<div className='col-span-2 w-full text-start'>
<Label htmlFor={`bio_details.awards_recognition.${index}.description`} className="text-md text-gray-700">
        Description
        </Label>
        <Controller
          control={form.control}
          name={`bio_details.awards_recognition.${index}.description`}
          render={({ field,fieldState }) => (
            <>
            <Input className="border border-solid border-gray-400 rounded-md w-full " {...field} placeholder="Please Enter Description"/>
            
            </>
          )}></Controller>

</div>

{/* button for adding more education or deleting */}
<div className='flex w-1/2 mx-auto justify-between border-2 border-solid border-red-400  space-x-10 md:space-x-20 col-span-2'>
                      <Button variant="destructive" className="shadow-md" onClick={() => AwardsRemove(index)}>Remove</Button>
                      <Button variant="outline" className="shadow-md" onClick={() =>
                        AwardsAppend({
                          award_name: "",
                          year_received: new Date().getFullYear(),
                          description: "",

                        })
                      }>
                        Add More</Button>
                    </div>


      </div>
  ))
}

                </div>
  
)}



{/* {consultation fees and other details } */}
<div className="grid grid-cols-1 grid-rows-4 gap-4 md:grid-cols-2 md:grid-rows-2 shadow-md shadow-gray-300 rounded-md py-2 col-span-2">

{/* {language spoken } */}
<div className="w-full ">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Language Spoken
        </label>
        <Controller
  name="bio_details.languages_spoken"
  control={form.control}
  render={({ field }) => (
    <MultiSelect
      {...field}
      options={languageOptions}
      value={field.value?.map((value) => ({ label: value, value }))}
      onChange={(selected) => field.onChange(selected.map((option) => option.value))}
      className="z-50" 
    />
  )}
/>
        </div>

{/* {"social link provided by url "} */}
<div className="w-full ">
        <label className="block text-gray-700 text-sm font-bold mb-2">
           link of Social Account
        </label>
        <Controller
  name="bio_details.social_links"
  control={form.control}
  render={({ field }) => (
    <MultiSelect
      {...field}
      options={[]}
      value={field.value?.map((value) => ({ label: value, value }))}
      onChange={(selected) => field.onChange(selected.map((option) => option.value))}
      className="z-50" 
    />
  )}
/>
        </div>
{/* {consulation Fees} */}
<div>
  <Label htmlFor="bio_details.consultation_fees" className="text-md text-gray-700">
    Consultation Fees
  </Label>
  <Controller
    control={form.control}
    name="bio_details.consultation_fees"
    render={({ field }) => (
      <input
        type="number"
        id="bio_details.consultation_fees"
        placeholder="e.g., 1000"
        className="border-2 border-gray-400 rounded-md w-full p-2 text-sm sm:text-base"
        onChange={(e) => field.onChange(Number(e.target.value))}
        onBlur={() => form.trigger("bio_details.consultation_fees")}
        value={field.value}
      />
    )}
  />
</div>

{/* {consurrency provided } */}

<div>
  <label htmlFor="Currency" className="block text-gray-700 text-sm font-bold mb-2">Currency</label>
  <Controller
    control={form.control}
    name={`bio_details.consulation_currency`}
    render={({ field }) => (
      <CreatableSelect
        id="Currency"
        {...field}
        isClearable
        options={currencies} // Ensure this is structured as [{ label, value }, ...]
        value={
          field.value
            ? { label: field.value, value: field.value } // Map the value for CreatableSelect
            : null
        }
        onChange={(newValue: any, actionMeta: any) =>
          field.onChange(newValue ? newValue.value : null) // Update the form value
        }
        placeholder="Select or type to create..."
      />
    )}
  />
   </div>






  </div>
{/* {checked box in right } */}
  <div className="flex items-start space-x-1 w-full pb-10 col-span-2 border-2 border-gray-300 border-solid rounded-md">
  <input
    type="checkbox"
    id="terms"
    checked={checked}
    onChange={handleCheckboxChange}
    className="ml-3 mt-2 md:rounded-md w-5 h-5 border-2 border-gray-300 rounded-sm checked:bg-blue-600 checked:border-transparent focus:ring-2 focus:ring-blue-500 cursor-pointer"
  />
  <label
    htmlFor="terms"
    className="text-sm font-medium text-gray-600 leading-tight flex-1"
  >
    Thank you for providing your information. Please ensure all details are correct before submitting. Our team will review your form and get in touch with you if any additional information is needed. We are committed to safeguarding your privacy, and all personal information will be kept confidential.
  </label>
</div>
{/* {submitbutton} */}
<div className="flex col-span-2 w-full h-20 py-3">
<Button
                type="submit"
              
                disabled={isSubmitting || !checked}
                className="mt-4 px-4 py-2 w-full bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
              >
                {isSubmitting? (
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
                  "Submit"
                )}
              </Button>
</div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default page;
