import { createRouteHandler } from "uploadthing/next-legacy";

import { ourFileRouter } from "rbgs/server/uploadthing";

export default createRouteHandler({
  router: ourFileRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});
