import type { DrizzleError } from "drizzle-orm";

import slugify from "slug";

import { findLocationByName, findUniqueSlug, insertLocation } from "../../lib/db/queries/location";
import { InsertLocation } from "../../lib/db/schema";
import defineAuthenticatedEventHandler from "../../utils/define-authenticated-event-handler";
import sendZodError from "../../utils/send-zod-error";

export default defineAuthenticatedEventHandler(async (event) => {
    const result = await readValidatedBody(event, InsertLocation.safeParse);

    if (!result.success) {
        return sendZodError(event, result.error);
    }

    const locationExist = await findLocationByName(result.data, event.context.user.id);

    if (locationExist) {
        return sendError(event, createError({
            statusCode: 409,
            statusMessage: `Location '${result.data.name}' is already exist.`,
        }));
    }

    const slug = await findUniqueSlug(slugify(result.data.name));

    try {
        return insertLocation(result.data, slug, event.context.user.id);
    }
    catch (e) {
        const error = e as DrizzleError;
        // eslint-disable-next-line no-console
        console.log("INSERT ERROR", error.message);
        if (error.message.includes(`Failed query`)) {
            return sendError(event, createError({
                statusCode: 409,
                statusMessage: "Slug must be unique (the location name is used to generate the slug).",
            }));
        }
        throw error;
    }
});
