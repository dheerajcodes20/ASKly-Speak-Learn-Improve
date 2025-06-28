"use client";
import { api } from '@/convex/_generated/api';
import { useUser } from '@stackframe/stack';
import { useMutation, useQuery } from 'convex/react';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { UserContext } from './_context/UserContext';
const AuthProvider = ({children}) => {

const pathname = usePathname();
const user = useUser();
const [userData, setuserData] = useState();
const CreateUser = useMutation(api.users.CreateUser);

// Don't call useQuery until user is loaded and has a valid email
let existingUser;
if (user && typeof user.primaryEmail === "string" && user.primaryEmail.length > 0) {
  existingUser = useQuery(api.users.GetUserByEmail, { email: user.primaryEmail });
}

useEffect(() => {
    if (!user || !user.primaryEmail) return;
    if (existingUser) {
      setuserData(existingUser);
      return;
    }
    // Only try to create user if not found
    const create = async () => {
      try {
        const result = await CreateUser({
          name: user?.displayName  || "No Name",
          email: user.primaryEmail,
          credits: 0,
        });
        setuserData(result);
      } catch (err) {
        console.error("Error creating user:", err);
      }
    };
    create();
}, [user, existingUser, CreateUser]);

// Allow handler routes to render even if user is not loaded
if (pathname && pathname.startsWith('/handler')) {
  return <>{children}</>;
}

if (!user || !user.primaryEmail) {
  // Don't render children until user is loaded
  return <div>Loading...</div>;
}

  return (
    <div>
      <UserContext.Provider value={{ userData, setuserData }}>
        {children}
      </UserContext.Provider>
    </div>

  )
}


export default AuthProvider
