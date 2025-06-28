// import { Button } from "@/components/ui/button";
import { UserButton } from "@stackframe/stack";
import Link from "next/link";
// import Image from "next/image";

export default function Home() {
  return (
   <>

   
   <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-2xl">
    <div>
       <UserButton  />
        click here to 
       <Link  href="http://localhost:3000/dashboard" className="text-blue-600 font-bold"> continue</Link>
    </div>
   </div>

   </>
  );
}

