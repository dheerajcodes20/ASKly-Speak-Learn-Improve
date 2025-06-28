import { v } from "convex/values";
import { mutation, query } from "./_generated/server"; // <-- add query import

export const CreateNewRoom = mutation({

    args :{
        coachingOption:v.string(),
        topic: v.string(),
        expertName: v.string(),
        userId: v.string(), // Add userId
        title: v.string(), // Add title
    },
    handler:async(ctx,args) => {
        try {
            // Limit to last 5 conversations per user
            const userRooms = await ctx.db.query('DiscussionRoom')
                .filter(q => q.eq(q.field('userId'), args.userId))
                .order('desc')
                .collect();
            if (userRooms.length >= 5) {
                // Delete the oldest
                const oldest = userRooms[userRooms.length - 1];
                await ctx.db.delete(oldest._id);
            }
            const data = {
                coachingOption: args.coachingOption,
                topic: args.topic,
                expertName: args.expertName,
                conversation: [],
                userId: args.userId,
                createdAt: Date.now(),
                title: args.title,
            };
            const insertedId = await ctx.db.insert('DiscussionRoom', data);
            // Return the inserted document for confirmation
            return { _id: insertedId, ...data };
        } catch (err) {
            console.error("Error inserting DiscussionRoom:", err);
            throw err;
        }
    }
})

export const GetDiscussionRoom = query({
    args:{
        id:v.id("DiscussionRoom"), // <-- fix id type
    },
    handler:async(ctx,args) => {
        try {
            const room = await ctx.db.get(args.id);
            if (!room) {
                throw new Error("DiscussionRoom not found");
            }
            return room;
        } catch (err) {
            console.error("Error fetching DiscussionRoom:", err);
            throw err;
        }
    }
})

export const GetUserConversations = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db.query('DiscussionRoom')
            .filter(q => q.eq(q.field('userId'), args.userId))
            .order('desc')
            .collect();
    }
})

export const UpdateConversation = mutation({
    args:{
        id:v.id("DiscussionRoom"), // <-- fix id type
        conversation: v.any(), // <-- allow any type for conversation
    },

    handler:async(ctx,args) => {
        await ctx.db.patch(args.id, {
            conversation: args.conversation,
        })
    }

})

export const DeleteConversation = mutation({
  args: { id: v.id("DiscussionRoom") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export const DeleteAllConversations = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const rooms = await ctx.db.query("DiscussionRoom")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .collect();
    for (const room of rooms) {
      await ctx.db.delete(room._id);
    }
    return { success: true };
  },
});