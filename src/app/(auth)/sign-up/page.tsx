'use client'
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from 'next/image';
import logoImage from "../../../../public/Images/Screenshot 2024-11-28 105955.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useToast } from "@/hooks/use-toast"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signupSchema } from '@/app/schemas/signup.schemas'
const page = () => {
  const [mobilenumber,setmobilenumber]=React.useState<string>("")
  const [mobilenumbererror,setmobilenumbererror]=React.useState<string>("")
  const [issubmitting,setissubmitting]=React.useState<boolean>(false)
  const toast = useToast()
  const router=useRouter()

  //zod implementation for validation
  const form =useForm<z.infer<typeof signupSchema>>(({
    resolver: zodResolver(signupSchema),
    defaultValues: { 
      profile: "",
      firstName: "",
      lastName: "",
      email: "",
      Mobile_number: "",
      gender: "male",
      age: 0,
      zip_code: 111111,
      role: "patient",
      address: ""
    }
  }))
  
  



}

export default page