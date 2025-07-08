import { findLocations } from "../../lib/db/queries/location";
import defineAuthenticatedEventHandler from "../../utils/define-authenticated-event-handler";

// const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

export default defineAuthenticatedEventHandler(async (event) => {
    return findLocations(event.context.user.id);
});
