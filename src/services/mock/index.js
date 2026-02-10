import { setupWorker } from "msw"

import handlers from "./mock"

export const worker = setupWorker(...handlers)
