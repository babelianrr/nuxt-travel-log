import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { z } from "zod";

import { user } from "./auth-schema";
import { locationLog, type SelectLocationLog } from "./location-log";

export const location = sqliteTable("location", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    slug: text().notNull().unique(),
    description: text(),
    lat: real().notNull(),
    long: real().notNull(),
    userId: int().notNull().references(() => user.id),
    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [
    unique().on(t.name, t.userId),
]);

export const locationRelations = relations(location, ({ many }) => ({
    locationLogs: many(locationLog),
}));

export const InsertLocation = z.object({
    name: z.string().trim().min(1).max(100),
    description: z.string().trim().max(1000).optional(),
    lat: z.number().min(-90).max(90),
    long: z.number().min(-180).max(180),
});

export type InsertLocation = z.infer<typeof InsertLocation>;
export type SelectLocation = typeof location.$inferSelect;
export type SelectLocationWithLogs = SelectLocation & {
    locationLogs: SelectLocationLog[];
};
export type InsertLocationInitialValues = InsertLocation | null | undefined;
