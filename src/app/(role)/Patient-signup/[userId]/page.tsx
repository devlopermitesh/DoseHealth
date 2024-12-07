"use client"
import React from "react"
import { useParams, useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import LogoImage from "../../../../../public/Images/Screenshot 2024-11-28 105955.png"
import { patientInputSchema } from '@/app/schemas/patientsignup.schemas'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Logo from '@/components/customeComponets/Logo'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"


import  { allergiesOptions, chronic_diseasesOptions, conditionStatusOptions, medicationOptions, painLevels, painLocations, surgeriesOptions, surgeryOutcomes ,recentTestResults, postSurgeryIssues} from "@/app/constants/SelectOptions"
import dynamic from 'next/dynamic';
import axios, { AxiosError } from "axios"

const MultiSelect = dynamic(() => import("@/components/customeComponets/Mutliselect"), { ssr: false });
const patientDefaultValues = {
    blood_group: "O+", // Set a valid default blood group
    civic_status: "single",
    height: 170,
    weight: 70,
    bmi: 1, // Ensure it meets the positive constraint
    doyouhaveInsurance: "Yes" as "Yes" | "No" | undefined,
    note: "",
    doyouhavesurgeries:"No",
    surgeries: [],
    dateofsurgery: undefined,
    surgeon: [],
    outcomes: [],
    doyouhaveanycomplications: "No",
    complications: [],
    ongoingissuewithsurgery: "No",
    ongoingissues: [],
    locationofpain: [],
    levelofpain: "",
    medical_history: {
      chronic_diseases: [],
      past_conditions: [],
      allergies: [],
      medications: [],
      surgical_history: [],
    },
    insurance: [{ provider: "", policy_number: "", coverage: "", expiry_date: new Date() }],
    current_health_status: {
      current_medications: [],
      doyouhaverecenttests: "No",
      recent_tests: [{
        test_name: "",
        test_date: "",
        result: "Normal",
        file:undefined,
      }],
      symptoms: [],
    },
  };
 const page=()=>{
    
const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
const [isInsuranceOpen, setInsuranceOpen] = React.useState<boolean>(false);
// const [isMedicalHistoryOpen, setMedicalHistoryOpen] = React.useState<boolean>(false);
const [hasInsurance,setHasInsurance]=React.useState<string>("Yes");
const [hasSurgery,setHasSurgery]=React.useState<string>("No");
const [isSurgeryOpen, setSurgeryOpen] = React.useState<boolean>(false);
const [checked,setChecked]=React.useState<boolean>(false)
const [hasRecentTest,setHasRecentTest]=React.useState<string>("Yes");
const [RecentTestOpen,  setRecentTestOpen] = React.useState<boolean>(false);
const [hasComplication,sethasComplication]=React.useState<string>("Yes");
const [ComplicationOpen,setComplication]=React.useState<boolean>(false);

// const [Surgerydetails,setSurgeryDetails]=React.useState([
//   { index:1,
//     surgery_type: "",
//     surgery_date: "",
//     surgeon: "",
//     outcome: "",
//     have_complications: false,
//     complications: [],
//     ongoing_issue: false,
//     ongoing_issues: [],
//   }
// // ]);
// const [hasSurgeryIssue,sethasSurgeryIssue]=React.useState<string>("Yes");
// const [SurgeryIssueOpen,setSurgeryIssueOpen]=React.useState<boolean>(false);



const router = useRouter();
    const {toast}=useToast();
    const dataparams=useParams();  
    const {userId}=dataparams;
    
   
        const form =useForm<z.infer<typeof patientInputSchema>>({
            resolver: zodResolver(patientInputSchema),
            defaultValues: patientDefaultValues,
             
          });
          
          const { errors } = form.formState;
          const { fields, append, remove } = useFieldArray({
            control: form.control,
            name: "insurance",
          });
          const { fields:recentfields, append:recentappend, remove:recentremove } = useFieldArray({
            control:form.control,
            name: "current_health_status.recent_tests",
          });

          function convertSurgeriesToStrings(surgeriesData:{
            surgery_type: string;
            surgery_date: string;
            surgeon: string;
            outcome: string;
            complication: string;
            location: string;
            level: string;
        }[]): string[] {
            return surgeriesData.map((surgery) => {
                const {
                    surgery_type,
                    surgery_date,
                    surgeon,
                    outcome,
                    complication,
                    location,
                    level,
                } = surgery;
        
                return `Surgery: ${surgery_type || "Not specified"}, performed on: ${surgery_date}. 
        Surgeon: ${surgeon}. Outcome: ${outcome}. Complications: ${complication}. 
        Pain location: ${location}. Pain level: ${level}.`;
            });
        }
        

        // Utility function to create FormData from schema data
const createFormData = (data: z.infer<typeof patientInputSchema>) => {
  // Create string array from data of surgery if it exists
  // const SurgeriesData=
  const length=Math.max(data.surgeries.length)

  const SurgriesData= Array.from({ length }, (_, i) => ({
    surgery_type: data.surgeries[i],
    surgery_date: data.dateofsurgery?.[length-i] ?? 'donthave',
    surgeon: data.surgeon[i] ?? "not specified",
    outcome: data.outcomes[i] ?? "not specified",
    complication:data.complications[i] ?? "no complication",
    location:data.locationofpain[i] ?? "no pain",
    level:data.levelofpain[i] ?? "no pain",

}));
  

const formattedSurgeries =convertSurgeriesToStrings(SurgriesData);

  const formData = new FormData();
  formData.append('userId', userId as string);
  //append surgery data
  formattedSurgeries.forEach((surgery) => 
    formData.append('surgeries', surgery)
  )

  // Append fields from data
  formData.append('BloodGroup', data.blood_group);
  formData.append('Height', data.height.toString());
  formData.append('Weight', data.weight.toString());
  formData.append('BMI', data.bmi.toString());
  formData.append('civil_status', data.civil_status);
  formData.append('note', data.note || "");

  // Loop through arrays to append multiple values (like medications, symptoms)
  data.medical_history?.chronic_diseases?.forEach((item) =>
      formData.append('chronic_diseases', item)
  );
  data.medical_history?.past_conditions?.forEach((item) =>
      formData.append('past_conditions', item)
  );
  data.medical_history?.allergies?.forEach((item) =>
      formData.append('Allergies', item)
  );
  data.medical_history?.medications?.forEach((item) =>
      formData.append('medications', item)
  );
//adding current Medication and Symptoms
  data.current_health_status?.current_medications?.forEach((item) =>
      formData.append('current_medications', item)
  );
  data.current_health_status?.symptoms?.forEach((item) =>
      formData.append('symptoms', item)
)
  // Append insurance details
  data.insurance?.forEach((ins) => {
      formData.append('provider', ins.provider ??'');
      formData.append('policy_number', ins.policy_number);
      formData.append('coverage', ins.coverage);
      formData.append('expiry_date', ins.expiry_date.toISOString());
  });

  // Append test details
  data.current_health_status?.recent_tests?.forEach((test :any) => {
      formData.append('test_name', test.test_name ?? '');
      formData.append('test_date', test.test_date ?? '');
      formData.append('result', test.result);
      formData.append("test_result_files", test.file as File); // Append the actual File object
  });

  return formData;
};

const onSubmit = async (data: z.infer<typeof patientInputSchema>) => {
  try {
    setIsSubmitting(true);

    // Create FormData object from data
    const formData = createFormData(data);

    // Log entries to ensure correctness
    console.log("Sending FormData:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // Send POST request using axios
    const response = await axios.post("http://localhost:3000/api/sign-up-Patient", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status == 200 || response.data.success) {

      toast({
        title: "Success",
        description: response.data.message || "Patient created successfully.",
        variant: "default", 
        color:"green"
      });

      router.replace('/sign-in');
    }

    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError; 
      const errorMessage = (axiosError.response?.data as { message: string })?.message ;
      if (axiosError.response) {
        // Server error: Display red toast
        toast({
          title: "Error",
          description: errorMessage || "Error while creating patient.",
          variant: "destructive", // Use "destructive" variant for errors
        });
        console.error("API Error Response:", axiosError.response.data);
      } else if (axiosError.request) {
        // No response: Display red toast
        toast({
          title: "Error",
          description: "No response received from the server. Please try again later.",
          variant: "destructive",
        });
        console.error("No Response:", axiosError.request);
      } else {
        // Request setup error: Display red toast
        toast({
          title: "Error",
          description: `Request setup error: ${axiosError.message}`,
          variant: "destructive",
        });
        console.error("Request Setup Error:", axiosError.message);
      }
    } else {
      // Unexpected error: Display red toast
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error("Unexpected Error:", error);
    }
  } finally {
    setIsSubmitting(false);
  }
};




const onError = (errors:any) => {
  alert("errors")
  console.log("Validation errors:", errors); // Check if any validation issues exist
};


function getBmiRemark(weight: number, height: number): string {
    if (!weight || !height) return 'Invalid data'; // If either weight or height is missing
    const bmi = weight / ((height / 100) ** 2); // Convert height from cm to meters
  
    if (bmi < 18.5) return 'Underweight';
    if (bmi >= 18.5 && bmi < 24.9) return 'Normal weight';
    if (bmi >= 25 && bmi < 29.9) return 'Overweight';
    if (bmi >= 30 && bmi < 39.9) return 'Obese';
    return 'Severely obese';
  }
 
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked); // Update the checkbox state
  };

    return (
        <div className="flex flex-col w-full h-screen bg-white">
          <div className="flex w-full h-auto">
            <Image
              src={LogoImage}
              alt="logo"
              width={200}
              height={100}
              priority
            />
          </div>
          <div className="flex flex-1 justify-center items-center ">
            <div className="w-full lg:w-3/6 flex flex-col  text-center lg:shadow-sm lg:shadow-gray-600 rounded-md p-6">
              <h1 className="text-3xl font-semibold">Patient Form</h1>
              <p className='text-md text-gray-700 font-extralight '>Kindly fill the form to register as a patient</p>
              <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, onError)}  className="grid grid-cols-1 grid-rows-4 gap-1 lg:grid-cols-2 lg:grid-rows-3 lg:gap-3">
              <FormField
      control={form.control}
      name="blood_group"
      render={({ field }) => (
        <FormItem className='col-span-2 md:col-span-1'>
          <FormLabel className='flex text-center gap-2 text-gray-700 text-md'>
            Blood Group <Logo name="exlamation" className='w-1 h-1' style={{color:"black"}} iconSize={10} />
          </FormLabel>
          <FormControl>
            <select
              {...field}
              className="border-solid border-gray-800 border-2 focus:border-sky-500 p-2 rounded-md"
              onBlur={() => form.trigger("blood_group")}
            >
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </FormControl>
          <FormDescription>
            please select your blood group
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    
    
    <FormField
      control={form.control}
      name="civil_status"
      render={({ field }) => (
        <FormItem className='col-span-2 md:col-span-1'>
          <FormLabel className='flex text-center gap-2 text-gray-700 text-md'>
            Civic Status <Logo name="exlamation" className='w-1 h-1' style={{color:"black"}} iconSize={10} />
          </FormLabel>
          <FormControl>
            <select
              {...field}
              className="border-solid border-gray-800 border-2 focus:border-sky-500 p-2 rounded-md"
              onBlur={() => form.trigger("civil_status")}
            >
      <option value="single">Single</option>
      <option value="married">Married</option>
      <option value="divorced">Divorced</option>
      <option value="widowed">Widowed</option>
      <option value="separated">Separated</option>
    
            </select>
          </FormControl>
          <FormDescription>
            please select your civil status
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField 
      control={form.control}
      name="height"
      render={({ field }) => (
        <FormItem className="col-span-2 md:col-span-1">
          <FormLabel className="flex text-center gap-2 text-gray-700 text-md">
            Height (in cm) 
            <Logo name="exlamation" className="w-1 h-1" style={{ color: "black" }} iconSize={10} />
          </FormLabel>
          <FormControl>
            <input
              type="number"
              min={30}
              max={300}  // Adjusted for extreme cases
              className="border-solid border-gray-800 border-2 focus:border-sky-500 p-2 rounded-md"
              placeholder="Enter height in cm"
              defaultValue={field.value || 70}
              onChange={(e) => {
                field.onChange(parseFloat(e.target.value));
              }}
              onBlur={() => form.trigger("height")}
            />
          </FormControl>
          <FormDescription>
            Enter your height in centimeters (typical range: 30–300 cm).
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    
    <FormField 
      control={form.control}
      name="weight"
      render={({ field }) => (
        <FormItem className="col-span-2 md:col-span-1">
          <FormLabel className="flex text-center gap-2 text-gray-700 text-md">
            Weight (in kg)
            <Logo name="exlamation" className="w-1 h-1" style={{ color: "black" }} iconSize={10} />
          </FormLabel>
          <FormControl>
            <input
              type="number"
              min={1}
              max={500}
             
              className="border-solid border-gray-800 border-2 focus:border-sky-500 p-2 rounded-md"
              placeholder="Enter weight in kg"
              defaultValue={field.value || 70}
              onChange={(e) => {
                field.onChange(parseFloat(e.target.value));
              }}
              onBlur={() => form.trigger("weight")}
            />
          </FormControl>
          <FormDescription>
            Enter your weight in kilograms (typical range: 1–500 kg).
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField 
      control={form.control}
      name="bmi"
      render={({ field }) => (
        <FormItem className="col-span-2 md:col-span-1">
          <FormLabel className="flex text-center gap-2 text-gray-700 text-md">
            BMI (Body Mass Index)
            <Logo name="exlamation" className="w-1 h-1" style={{ color: "black" }} iconSize={10} />
          </FormLabel>
          <FormControl>
            <input
              type="text"
              {...field}
              disabled
              value={getBmiRemark(form.watch('weight'), form.watch('height'))}  // Dynamic remark based on weight and height
              className="border-solid border-gray-800 border-2 focus:border-sky-500 p-2 rounded-md"
            />
          </FormControl>
          <FormDescription>
            Your BMI is calculated based on weight and height. Remarks will be updated automatically.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="doyouhaveInsurance"
      render={({ field }) => (
        <FormItem className='flex flex-col w-full'>
          <FormLabel className="flex text-center gap-2 text-gray-700 text-md">
            Do you have any health Insurance?
            <Logo name="exlamation" className="w-1 h-1" style={{ color: "black" }} iconSize={10} />
          </FormLabel>
          <FormControl>
            <div className='flex justify-center w-full'>
              <RadioGroup
                {...field}
                onValueChange={(value) => {
                 if(value==="No"){
                  remove(patientDefaultValues.insurance.length-1);
                 }
                 if(value==="Yes"){
                  append({ provider: "", policy_number: "", coverage: "", expiry_date: new Date() })
                 }
                  field.onChange(value);
                  setHasInsurance(value);
                  setInsuranceOpen((value==="Yes"));
                }}

                defaultValue="Yes"
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
      )}
    />
    
<div className="flex flex-col h-auto justify-center w-full col-span-2 m-0 p-0">
  {hasInsurance === "Yes" && (
    <div className='m-0 p-0'>
      <Accordion
        type="single"
        className="w-full "
        value={hasInsurance} // Controlled by state
        onValueChange={setHasInsurance} // Update state when accordion changes
      >
        <AccordionItem value={hasInsurance} className="flex flex-col m-0 p-0 space-y-0">
          <TooltipProvider>
            <Tooltip >
              <TooltipTrigger asChild>
                <AccordionTrigger >
                  Fill Health Insurance Details
                </AccordionTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p> Your health insurance details are secure and necessary to complete your application.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <AccordionContent className='overflow-hidden  h-auto p-0 m-0 '>
            <div className=" w-full h-auto col-span-2 m-0 p-0">
              {fields.map((field, index) => (
                <Card key={field.id} className="h-auto flex  col-span-2 ">
                  <CardContent className="grid grid-cols-1  md:grid-cols-2 md:grid-rows-2 gap-4 ">
                    {/* Policy Name */}
                    <div className="col-span-2  md:col-span-1">
                      <Label htmlFor={`provider-${index}`} className="mb-1">
                        Policy Name
                      </Label>
                      <Controller
                        control={form.control}
                        name={`insurance.${index}.provider`}
                        render={({ field, fieldState }) => (
                          <>
                            <Input
                              {...field}
                              id={`provider-${index}`}
                              placeholder="Enter policy number"
                            />
                            {fieldState.error && (
                              <p className="text-sm text-red-500">{fieldState.error.message}</p>
                            )}
                          </>
                        )}
                      />
                    </div>

                    {/* Policy Number */}
                    <div className="col-span-2 md:col-span-1">
                      <Label htmlFor={`policy_number-${index}`} className="mb-1">
                        Policy Number
                      </Label>
                      <Controller
                        control={form.control}
                        name={`insurance.${index}.policy_number`}
                        render={({ field, fieldState }) => (
                          <>
                            <Input
                              {...field}
                              id={`policy_number-${index}`}
                              placeholder="Enter policy number"
                            />
                            {fieldState.error && (
                              <p className="text-sm text-red-500">{fieldState.error.message}</p>
                            )}
                          </>
                        )}
                      />
                    </div>

                    {/* Coverage Description */}
                    <div className="col-span-2 md:col-span-1">
                      <Label htmlFor={`coverage-${index}`} className="mb-1">
                        Coverage Description
                      </Label>
                      <Controller
                        control={form.control}
                        name={`insurance.${index}.coverage`}
                        render={({ field, fieldState }) => (
                          <>
                            <Input
                              {...field}
                              id={`coverage-${index}`}
                              placeholder="Enter coverage description"
                            />
                            {fieldState.error && (
                              <p className="text-sm text-red-500">{fieldState.error.message}</p>
                            )}
                          </>
                        )}
                      />
                    </div>

                    {/* Expiry Date */}
                    <div className="col-span-2 md:col-span-1">
      <Label htmlFor={`expiry_date-${index}`} className="mb-1">
        Expiry Date
      </Label>
      <Controller
        control={form.control}
        name={`insurance.${index}.expiry_date`}
        render={({ field, fieldState }) => (
          <>
            <Input
              {...field}
              id={`expiry_date-${index}`}
              type="date"
              value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
              onChange={(e) => {
                const newDate = new Date(e.target.value);

                field.onChange(newDate);
              }}
              onBlur={field.onBlur}
            />
            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </>
        )}
      />
    </div>
                    
                    <div className='flex w-full justify-between   space-x-10 md:space-x-20 '>
                      <Button variant="destructive" className="shadow-md" onClick={() => remove(index)}>Remove</Button>
                      <Button variant="outline" className="shadow-md" onClick={() =>
                        append({ provider: "", policy_number: "", coverage: "", expiry_date: new Date() })
                      }>Add More</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )}


</div>



{/* {medicalhistory form } */}


<div className='flex flex-col h-auto w-full shadow-md col-span-2 overflow-y-auto'>
    <div>
      <Accordion
        type="single"
        className="w-full h-auto overflow-visible"
        value={"MedicalHistory"} // Controlled by state
      >
        <AccordionItem value="MedicalHistory" className="flex flex-col space-y-0">       
<TooltipProvider>
<Tooltip >
<TooltipTrigger asChild>
        <AccordionTrigger >
        Medical History Details
        </AccordionTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p> Your medical  details are secure and necessary to complete your application.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
{/* {this is content form for Accordion form} */}
<AccordionContent className=' h-auto overflow-visible '>
          <div className=" w-full h-auto col-span-2">
          <Card key={"1"} className="h-auto flex col-span-2  overflow-visible pb-8">
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 md:grid-rows-2 w-full ">
       {/* {chronic deasees input } */}
                <div className="w-full ">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select or Add Chronic Diseases
        </label>
        <Controller
  name="medical_history.chronic_diseases"
  control={form.control}
  render={({ field }) => (
    <MultiSelect
      {...field}
      options={chronic_diseasesOptions}
      value={field.value.map((value) => ({ label: value, value }))}
      onChange={(selected) => field.onChange(selected.map((option) => option.value))}
      className="z-50" 
    />
  )}
/>
        </div>
        <div className="col-span-2 md:col-span-1">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select or Add Allergies
        </label>
        <Controller
  name="medical_history.allergies"
  control={form.control}
  render={({ field }) => (
    <MultiSelect
      {...field}
      options={allergiesOptions}
      value={field.value.map((value) => ({ label: value, value }))}
      onChange={(selected) => field.onChange(selected.map((option) => option.value))}
    />
  )}
/>
          </div>

          <div className="col-span-2 md:col-span-1">
          <label className="block text-gray-700 text-sm font-bold mb-2">
           Medications Details
        </label>
        <Controller
  name="medical_history.medications"
  control={form.control}
  render={({ field }) => (
    <MultiSelect
      {...field}
      options={medicationOptions}
      value={field.value.map((value) => ({ label: value, value }))}
      onChange={(selected) => field.onChange(selected.map((option) => option.value))}
    />
  )}
/>
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
           Past Medication Status
        </label>
        <Controller
  name="medical_history.past_conditions"
  control={form.control}
  render={({ field }) => (
    <MultiSelect
      {...field}
      options={conditionStatusOptions}
      value={field.value.map((value) => ({ label: value, value }))}
      onChange={(selected) => field.onChange(selected.map((option) => option.value))}
    />
  )}
/>
        </div>
             
        <div className='flex w-full justify-between space-x-10 md:space-x-20 mx-auto'>
                    <p className="text-sm text-gray-600">We'll keep all your information confidential and secure.</p>
                    </div>
</CardContent>
</Card>
     </div>
     </AccordionContent>

    </AccordionItem>
    </Accordion>
    </div>
    </div>

{/* {clicnic notes from patient} */}
<div className="col-span-2 ">
<FormField
        control={form.control}
        name="note"
        render={({ field }) => (
          <FormItem className="col-span-2 md:col-span-1">
            <FormLabel className="flex text-center gap-2 text-gray-700 text-md">
              Notes
              <Logo name="exclamation" className="w-4 h-4" style={{ color: 'black' }} iconSize={12} />
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                className="border-solid border-gray-800 border-2 focus:border-sky-500 p-3 rounded-md shadow-md"
                placeholder="Write any additional notes here..."
                onBlur={() => form.trigger('note')}
              />
            </FormControl>
            <FormDescription>
              You can write any important additional information or comments here.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
</div>

{/* {asking for surgeory details from patient and convert into string with details} */}
<div className='flex flex-col h-auto w-full shadow-md col-span-2 '>
<FormField
      control={form.control}
      name="doyouhavesurgeries"
      render={({ field }) => (
        <FormItem className='flex flex-col w-full py-2'>
          <FormLabel className="flex text-center gap-2 text-gray-700 text-md">
            Have you ever had any surgeries?
            <Logo name="exlamation" className="w-1 h-1" style={{ color: "black" }} iconSize={10} />
          </FormLabel>
          <FormControl>
            <div className='flex justify-center w-full'>
              <RadioGroup
                {...field}
                onValueChange={(value) => {
                  field.onChange(value);
                  setHasSurgery(value);
                  setSurgeryOpen((value==="Yes"));
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
      )}
    />

{hasSurgery === "Yes" && (
    <div>
      <Accordion
        type="single"
        className="w-full h-auto overflow-visible"
        value={"surgical_history"} // Controlled by state
      >
        <AccordionItem value="surgical_history" className="flex flex-col space-y-0">       
<TooltipProvider>
<Tooltip >
<TooltipTrigger asChild>
        <AccordionTrigger >
        Surgical History Details
        </AccordionTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p> Your details are secure and necessary to complete your application.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
{/* {this is content form for Accordion form} */}
<AccordionContent className=' h-auto overflow-visible '>

<Card className="h-auto flex  col-span-2">
  <CardContent className="grid grid-cols-1  md:grid-cols-2 md:grid-rows-2 gap-4">
    {/* surgery type and name  */}
  <div className="w-full ">
        <Label htmlFor="surgeries" className="block text-gray-700 text-sm font-bold mb-2">
          Select or Add Surgery Type/Name
        </Label>
        <Controller
  name="surgeries"
  control={form.control}
  render={({ field }) => (
    <MultiSelect
      {...field}
      options={surgeriesOptions}
      value={field.value.map((value) => ({ label: value, value }))}
      onChange={(selected) => field.onChange(selected.map((option) => option.value))}
      className="z-50" 
    />
  )}
/>
</div>

{/* date of sugrery  */}
<div className="w-full">
  <Label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateofsurgery">
Date of recent only Surgery
  </Label>
  <Controller
  control={form.control}
  name="dateofsurgery"
  render={({ field,fieldState }) => (
    <>
    <Input
      {...field}
      id="dateofsurgery"
      type="date"
      value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
      ></Input>
      {fieldState.error && (
         <p className="text-sm text-red-500">{fieldState.error.message}</p>
          )}
    </>
  )}></Controller>
</div>

<div className="w-full">
<Label htmlFor="surgeon" className="block text-gray-700 text-sm font-bold mb-2">
  Surgeons Names
</Label>
<Controller 
control={form.control}
name="surgeon"
render={({ field,fieldState }) => (
  <>
  <MultiSelect
      {...field}
      options={[{ label: 'Dr. John Doe', value: 'Dr. John Doe' }, { label: 'Dr. Jane Smith', value: 'Dr. Jane Smith' }]}
      value={field.value.map((value) => ({ label: value, value }))}
      onChange={(selected) => field.onChange(selected.map((option) => option.value))}
    />
  {fieldState.error && (
    <p className="text-sm text-red-500">{fieldState.error.message}</p>
  )}
  </>
)}>

</Controller>
</div>

<div className="w-full">
<Label htmlFor="OutCome" className="block text-gray-700 text-sm font-bold mb-2">
OutCome Of Surgery
</Label>
<Controller
control={form.control}
name="outcomes"
render={({ field,fieldState }) => (
  <>
   <MultiSelect
      {...field}
      options={surgeryOutcomes}
      value={field.value.map((value) => ({ label: value, value }))}
      onChange={(selected) => field.onChange(selected.map((option) => option.value))}
    />
  {fieldState.error && (
    <p className="text-sm text-red-500">{fieldState.error.message}</p>
  )}
  </>
)}>

</Controller>
</div>
  </CardContent>
</Card>
{/* ??ask for compelication  */}
<div className="flex flex-col w-full">
<FormField
      control={form.control}
      name="doyouhaveanycomplications"
      render={({ field }) => (
        <FormItem className='flex flex-col w-full'>
          <FormLabel className="flex text-center gap-2 text-gray-700 text-md">
            Have you feel complication after surgery?
            <Logo name="exlamation" className="w-1 h-1" style={{ color: "black" }} iconSize={10} />
          </FormLabel>
          <FormControl>
            <div className='flex justify-center w-full'>
              <RadioGroup
                {...field}
                onValueChange={(value) => {
                  field.onChange(value);
                  sethasComplication(value);
                 setComplication((value==="Yes"));
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
      )}
    />
{
  ComplicationOpen && (
    
<div className="col-span-2 ">

<div className="col-span-2 md:col-span-1">
            <label className="block text-gray-900 text-start text-sm  font-bold mb-2">
            Description in Details
        </label>
        <Controller
  name="complications"
  control={form.control}
  render={({ field,fieldState  }) => (
    <>
    <MultiSelect
      {...field}
      options={postSurgeryIssues}
      className="text-start text-black font-rubit text-sm border-2 border-black rounded-md"
      value={field.value.map((value) => ({ label: value, value }))}
      onChange={(selected) => field.onChange(selected.map((option) => option.value))}
    />
    <p className="text-gray-700 font-rubit text-sm">You can write any important additional information eg: surgery related complications here.
    </p>
{fieldState.error && (
  <p className="text-sm text-red-500">{fieldState.error.message}</p>
)}
</>
  )}
/> 
        </div>
      {/* ??asking for locartion of pain and level of disconfort */}
      <div className="flex w-full flex-col md:flex-row">
<div className="w-full flex-1"> 
<Label htmlFor="LocationofPain" className="block text-gray-700 text-sm font-bold mb-2">
  Location of Pain
</Label>
<Controller
control={form.control}
name="locationofpain"
render={({ field,fieldState }) => (
  <>
   <MultiSelect
      {...field}
      className=""
      options={painLocations}
      value={field.value.map((value) => ({ label: value, value }))}
      onChange={(selected) => field.onChange(selected.map((option) => option.value))}
    />
  {fieldState.error && (
    <p className="text-sm text-red-500">{fieldState.error.message}</p>
  )}
  </>
)}>

</Controller>
</div>
<div className="flex-1 ">
<FormField
      control={form.control}
      name="levelofpain"
      render={({ field }) => (
        <FormItem className='col-span-2 md:col-span-1'>
          <FormLabel className='flex text-center gap-2 text-gray-700 text-md'>
        Level of Discomfort <Logo name="exlamation" className='w-1 h-1' style={{color:"black"}} iconSize={10} />
          </FormLabel>
          <FormControl>
          <select
              {...field}
              className="border-solid border-gray-800 border-2 focus:border-sky-500 p-2 rounded-md"
              onBlur={() => form.trigger("civil_status")}
            >
{
  painLevels && painLevels.map((obj,index)=><option key={index} value={obj.value}>{obj.label}</option>)
}
            </select>
          </FormControl>
          <FormDescription>
            please select your pain level of Complication after Surgery
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />

  </div>
        </div>
</div>
  )
}


</div>

</AccordionContent>
</AccordionItem>
</Accordion>
</div>



)}

</div>

{/* {ask for details about Current  health Status } */}

<div className="flex flex-col col-span-2 w-full h-auto shadow-md " >
  
  <Accordion
        type="single"
        className="w-full shadow-md"
        value={"currentHealth"} // Controlled by state
      >
        <AccordionItem value="currentHealth" className="flex flex-col m-0 p-0 space-y-0">
          <TooltipProvider>
            <Tooltip >
              <TooltipTrigger asChild>
                <AccordionTrigger >
                  Current Health Status
                </AccordionTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p> 
                  Please enter any current health details or recents test you have taken. This will help us provide you with better care.
                  .</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <AccordionContent className='overflow-hidden  h-auto p-0 m-0 '>

            <div className=" w-full h-auto col-span-2 m-0 p-0 grid grid-cols-1  md:grid-cols-2 md:grid-rows-1 gap-10 ">

            <div className="w-full ">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Current Medications
        </label>
        <Controller
  name="current_health_status.current_medications"
  control={form.control}
  render={({ field }) => (
    <MultiSelect
      {...field}
      options={medicationOptions}
      value={field.value.map((value) => ({ label: value, value }))}
      onChange={(selected) => field.onChange(selected.map((option) => option.value))}
      className="z-50" 
    />
  )}
/></div>

<div>
<FormField
      control={form.control}
      name="current_health_status.doyouhaverecenttests"
      render={({ field }) => (
        <FormItem className='flex flex-col w-full'>
          <FormLabel className="flex text-center gap-2 text-gray-700 text-md">
            do you have any recent tests
            <Logo name="exlamation" className="w-1 h-1" style={{ color: "black" }} iconSize={10} />
          </FormLabel>
          <FormControl>
            <div className='flex justify-center w-full'>
              <RadioGroup
                {...field}
                onValueChange={(value) => {
                  field.onChange(value);
                  form.trigger("current_health_status.doyouhaverecenttests");
                  setHasRecentTest(value)
                  setRecentTestOpen((value==="Yes"))
                }}
                defaultValue="No">
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
      )}
    />
</div>

<div className="col-span-2 w-full ">
{RecentTestOpen && recentfields.map((field, index) => (
           <Card key={field.id} className="h-auto flex  col-span-2 w-full ">
           <CardContent className="grid grid-cols-1 w-full md:grid-cols-2 md:grid-rows-2 gap-4 ">
            {/* ?test name for recents  */}
           <div className="col-span-2  md:col-span-1">
                      <Label htmlFor={`test_name_${index}`} className="mb-1">
                        Recent Test
                      </Label>
                      <Controller
                        control={form.control}
                        name={`current_health_status.recent_tests.${index}.test_name`}
                        render={({ field, fieldState }) => (
                          <>
                            <Input
                              {...field}
                              id={`test_name_${index}`}
                              placeholder="Enter Recent test Name"
                            />
                            {fieldState.error && (
                              <p className="text-sm text-red-500">{fieldState.error.message}</p>
                            )}
                          </>
                        )}
                      />
                    </div>



                    <div className="col-span-2 md:col-span-1">
                      <Label htmlFor={`test_date_${index}`} className="mb-1">
                      Test Date
                      </Label>
                      <Controller
                        control={form.control}
                        name={`current_health_status.recent_tests.${index}.test_date`}
                        render={({ field, fieldState }) => (
                          <>
                            <Input
                              {...field}
                              id={`test_date_${index}`}
                              type="date"
                              value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
                            />
                            {fieldState.error && (
                              <p className="text-sm text-red-500">{fieldState.error.message}</p>
                            )}
                          </>
                        )}
                        />
                    </div>
                  <div className="col-span-2 md:col-span-1 flex flex-col">
                  <Label htmlFor={`result_${index}`} className="mb-1">
                    Result
                      </Label>
                      <Controller
                        control={form.control}
                        name={`current_health_status.recent_tests.${index}.result`}    render={({ field, fieldState }) => (<>
                        <select
              {...field}
              id={`result_${index}`}
              className="border-solid border-gray-800 border-2 focus:border-sky-500 p-2 rounded-md"
              onBlur={() => form.trigger(`current_health_status.recent_tests.${index}.result`)}
            >
{ recentTestResults && recentTestResults.map((obj,index)=><option key={index} value={obj.value}>{obj.label}</option>)}
            </select>
            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
                        </>)}
                        />

                  </div>
                  <div className="col-span-2 md:col-span-1 flex flex-col">
  <Label htmlFor={`result_${index}`} className="mb-1">
    Upload File of Recent Test
  </Label>
  
  <Controller
    control={form.control}
    name={`current_health_status.recent_tests.${index}.file`}
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


                  </CardContent>
                  </Card>

))}

<div className="w-full pb-20 z-50">
        <Label htmlFor="Symptons" className="block text-gray-700 text-sm font-bold mb-2">
        Select or Create  Symptons you feel Write now
        </Label>
        <Controller
  name="current_health_status.symptoms"
  control={form.control}
  render={({ field }) => (
    <MultiSelect
      {...field}
      options={surgeriesOptions}
      value={field.value.map((value) => ({ label: value, value }))}
      onChange={(selected) => field.onChange(selected.map((option) => option.value))}
      className="z-50 w-full h-10 border-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500" 
    />
  )}
/>
</div>
{/* //checkbox for conformation  */}
<div className="flex items-start space-x-1 w-full pb-10">
  <input
    type="checkbox"
    id="terms"
    checked={checked}
    onChange={handleCheckboxChange}
    className="ml-3 md:rounded-md w-5 h-5 border-2 border-gray-300 rounded-sm checked:bg-blue-600 checked:border-transparent focus:ring-2 focus:ring-blue-500 cursor-pointer"
  />
  <label
    htmlFor="terms"
    className="text-sm font-medium text-gray-600 leading-tight flex-1"
  >
    Thank you for providing your information. Please ensure all details are correct before submitting. Our team will review your form and get in touch with you if any additional information is needed. We are committed to safeguarding your privacy, and all personal information will be kept confidential.
  </label>
</div>


</div>
                 

        </div>
        </AccordionContent>
        </AccordionItem>
        </Accordion>

</div>

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
    )

}  

export default page