// import { Button } from "./components/ui/button";
import { UserButton } from "@stackframe/stack";
import Link from "next/link";
// import Image from "next/image";

export default function Home() {
  return (
   <>

   
   <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-2xl">
    <div className="">
      <span className=" flex flex-col items-center"><UserButton/></span>
        click here to 
       <Link  href="https://askly-speak-learn-improve.vercel.app/dashboard" className="text-blue-600 font-bold"> continue</Link>
    </div>
   </div>

   </>
  );
}

