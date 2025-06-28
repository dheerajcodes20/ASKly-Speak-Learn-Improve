import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateUser = mutation({
    args:{
        name:v.string(),
        email:v.string(),
        credits:v.number(), // Accept credits from client
    },
    handler:async(ctx,args)=>{
        //if user already exists
        const userData= await ctx.db.query("users").filter(q=>
            q.eq(q.field("email"),args.email)
        ).collect();
        //if usernot exists, add new  user 
        if(userData?.length===0){

            const data={
                name:args.name,
                email:args.email,
                credits:args.credits, // Use credits from client
            }
            const insertedId =  await ctx.db.insert("users",data);
            // Return the inserted user document
            return { _id: insertedId, ...data };

        }
        return userData[0];

    }
})

export const GetUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    return users.length > 0 ? users[0] : null;
  },
});