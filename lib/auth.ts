import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/plugins";

import db from "./db/index"; // your drizzle instance
import env from "./env";

export const auth = betterAuth({
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/get-session") {
                if (!ctx.context.session) {
                    return ctx.json({
                        session: null,
                        user: null,
                    });
                }
                return ctx.json(ctx.context.session);
            }
        }),
    },
    database: drizzleAdapter(db, {
        provider: "sqlite",
    }),
    advanced: {
        database: {
            generateId: false,
        },
    },
    socialProviders: {
        github: {
            clientId: env.GH_CLIENT_ID,
            clientSecret: env.GH_CLIENT_SECRET,
        },
    },
});
