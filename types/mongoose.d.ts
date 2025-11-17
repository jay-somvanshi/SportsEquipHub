import mongoose from "mongoose";

declare global {
  // allow global `var mongoose`
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

export {};
