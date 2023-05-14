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
  const post1: Post = {
    slug: 'hello-world',
    title: 'Hello World',
    timestamp: 'Sat, 11 May 2023 14:00:00 GMT',
    body: `Welcome to my new portfolio blog where I'll be sharing my insights and experiences in web technology. As a front-end web developer, I'm passionate about writing clean, efficient, and functional code using JavaScript, CSS, and various other web technologies.
<br><br>I'm also excited about the potential of AI and its role in web development, as well as exploring the benefits of Node, Deno, and Serverless. Throughout my journey, I hope to inspire and connect with other like-minded developers who share my love for creating innovative and user-friendly web experiences.
<br><br>Whether you're a beginner or an experienced developer, I invite you to join me on this journey and stay tuned for my upcoming posts on all things web technology!
<br><br>My next post will be focused on how I'm experimenting with Deno for my blog.`,
    tags: [],
  };

  const post2: Post = {
    slug: 'blogging-with-deno-kv',
    title: 'Blogging with Deno KV',
    timestamp: 'Sat, 13 May 2023 13:00:00 GMT',
    body: `I'm excited to share that my portfolio site is built using Deno on Deno Deploy, a low-cost global serverless platform. Deno is a modern runtime for JavaScript and TypeScript that provides secure and efficient execution of code. With Deno Deploy, I'm able to deploy my site with ease and scale globally without having to worry about server maintenance.
<img src="/imgs/deno-blog-kv.jpg" alt="Deno Blog with KV Store" />
One of the exciting features of Deno Deploy is the new Deno KV (key-value store API), which allows me to store and retrieve data for my site. For example, I'm using the KV API to store my blog posts and retrieve them dynamically for display on the site.
<br><br>Using Deno and Deno Deploy has been a game-changer for me as a developer, allowing me to focus on building great web experiences without the hassle of server management. Plus, with the low-cost pricing of Deno Deploy, I can keep my expenses low and invest more time into developing exciting projects.
<br><br>If you're a developer looking for a modern and efficient way to deploy your web applications, I highly recommend giving Deno and Deno Deploy a try. Stay tuned for more posts on Deno and other exciting web technologies!
<br><br>Thank you for reading, and I look forward to connecting with you soon.`,
    tags: ['deno', 'redis', 'deno-kv'],
  };

  await db.set(['posts', 'hello-world'], post1);
  await db.set(['posts', 'blogging-with-deno-kv'], post2);

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