import type { UserWithId } from "./auth";

declare module "h3" {
    // eslint-disable-next-line ts/consistent-type-definitions
    interface H3EventContext {
        user?: UserWithId;
    }
}

export type LatLongItem = {
    lat: number;
    long: number;
};

export type MapPoint = {
    id: number;
    name: string;
    lat: number;
    long: number;
    description: string | null;
};
