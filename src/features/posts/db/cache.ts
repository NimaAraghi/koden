import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getPostGlobalTag() {
  return getGlobalTag("posts");
}

export function getPostIdTag(id: string) {
  return getIdTag("posts", id);
}

export function revalidatePostCache(id: string) {
  revalidateTag(getPostGlobalTag());
  revalidateTag(getPostIdTag(id));
}
