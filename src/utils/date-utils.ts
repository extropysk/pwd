import * as ms from "ms";

export const expToDate = (expiration: string) => {
  return new Date(Date.now() + ms(expiration));
};
