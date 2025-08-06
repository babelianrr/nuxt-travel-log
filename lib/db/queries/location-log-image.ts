import type { InsertLocationLogImageType } from "../schema";

import db from "..";
import { locationLogImage } from "../schema";

export async function insertLocationLogImage(
    locationLogId: number,
    insertable: InsertLocationLogImageType,
    userId: number,
) {
    const [inserted] = await db.insert(locationLogImage).values({
        ...insertable,
        userId,
        locationLogId,
    }).returning();

    return inserted;
}
