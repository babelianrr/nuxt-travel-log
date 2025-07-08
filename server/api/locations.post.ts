import { and, type DrizzleError, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import slugify from "slug";

import db from "../../lib/db";
import { InsertLocation, location } from "../../lib/db/schema";
import defineAuthenticatedEventHandler from "../../utils/define-authenticated-event-handler";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

export default defineAuthenticatedEventHandler(async (event) => {
    const result = await readValidatedBody(event, InsertLocation.safeParse);

    if (!result.success) {
        const statusMessage = result
            .error
            .issues
            .map(issue => `${issue.path.join("")}: ${issue.message}`)
            .join("; ");

        const data = result
            .error
            .issues
            .reduce((errors, issue) => {
                // `${issue.path.join("")}: ${issue.message}`
                errors[issue.path.join("")] = issue.message;
                return errors;
            }, {} as Record<string, string>);

        return sendError(event, createError({
            statusCode: 422,
            statusMessage,
            data,
        }));
    }

    const locationExist = await db.query.location.findFirst({
        where: and(
            eq(location.name, result.data.name),
            eq(location.userId, event.context.user.id),
        ),
    });

    if (locationExist) {
        return sendError(event, createError({
            statusCode: 409,
            statusMessage: `Location '${result.data.name}' is already exist.`,
        }));
    }

    let slug = slugify(result.data.name);
    let slugExist = !!(await db.query.location.findFirst({
        where: eq(location.slug, slug),
    }));

    while (slugExist) {
        const id = nanoid();
        const idSlug = `${slug}-${id}`;
        slugExist = !!(await db.query.location.findFirst({
            where: eq(location.slug, idSlug),
        }));
        if (!slugExist) {
            slug = idSlug;
        }
    }

    try {
        const [created] = await db.insert(location).values({
            ...result.data,
            slug,
            userId: event.context.user.id,
        }).returning();
        return created;
    }
    catch (e) {
        const error = e as DrizzleError;
        if (error.message.includes(`Failed query`)) {
            return sendError(event, createError({
                statusCode: 409,
                statusMessage: "Slug must be unique (the location name is used to generate the slug).",
            }));
        }
        throw error;
    }
});
