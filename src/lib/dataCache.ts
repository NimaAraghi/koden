type CACHE_TAG = "users" | "posts";

export function getGlobalTag(tag: CACHE_TAG) {
  return `global:${tag}` as const;
}

export function getIdTag(tag: CACHE_TAG, id: string) {
  return `id:${id}-${tag}` as const;
}

export function getUserTag(tag: CACHE_TAG, userId: string) {
  return `user:${tag}-${tag}` as const;
}

export function getPostTag(tag: CACHE_TAG, postId: string) {
  return `post:${postId}-tag` as const;
}
