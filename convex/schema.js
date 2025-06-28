import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values"


export default defineSchema({
    users:defineTable({
        name: v.string(),
        email: v.string(),
        credits: v.number(),
        subscriptionId: v.optional(v.string()),
        subscriptionStatus: v.optional(v.string()),
    }),
    
    DiscussionRoom: defineTable({
        coachingOption:v.string(),
        topic: v.string(),
        expertName: v.string(),
        conversation: v.optional(v.any()),
        userId: v.optional(v.string()), // Add userId for filtering
        createdAt: v.optional(v.number()), // Timestamp for sorting
        title: v.optional(v.string()), // Title for conversation list
    })

})