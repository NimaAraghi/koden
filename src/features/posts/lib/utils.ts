import slugify from "@sindresorhus/slugify";
import { nanoid } from "nanoid";

export const generateSlug = (title: string) => {
  return `${slugify(title)}-${nanoid(4)}`;
};
