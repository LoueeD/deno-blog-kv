const db = await Deno.openKv();

export interface Post {
  slug: string;
  title: string;
  body: string;
  timestamp: string;
  tags: string[],
  draft?: true;
}

export const isPublicPost = (post: Post): Post | null => {
  const { draft, timestamp } = post;
  // private post if draft or posts date is in the future
  return draft || new Date(timestamp).getTime() > new Date().getTime() ? null : post;
};

export const getPost = async (slug: string) => {
  const post = await db.get<Post>(["posts", slug]);
  return post.value ? isPublicPost(post.value) : null;
}

export const getPosts = async () => {
  const iter = await db.list<Post>({ prefix: ["posts"] });
  let posts: Post[] = [];
  for await (const post of iter) {
    // filter out draft and future posts
    if (isPublicPost(post.value)) {
      posts.push(post.value);
    }
  }
  // order by date
  posts = posts.sort(
    (a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  return posts || [];
}