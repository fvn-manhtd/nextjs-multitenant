"use client";

import Link from "next/link"
import { useParams } from "next/navigation";


const HomePage = () => {

  const params = useParams();  
  const domain = params.domain;
  

  return (
    
    <div className="flex flex-col min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to TOP PAGE {domain}</h1>
    </div>
    
  )
}

export default HomePage