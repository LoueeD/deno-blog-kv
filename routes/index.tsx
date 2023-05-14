import { Head } from "$fresh/runtime.ts";
import type { Handlers, PageProps } from "$fresh/server.ts";
import Header from "../components/Header.tsx";
import PostContainer from "../components/PostContainer.tsx";
import SiteBase from "../components/SiteBase.tsx";
import SiteFooter from "../components/SiteFooter.tsx";
import { isLoggedIn } from "../utils/auth.ts";
import { Post, getPosts } from "../utils/getPosts.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const posts = await getPosts();
    const loggedIn = await isLoggedIn(req);
    return ctx.render({ posts, loggedIn });
  },
};

export default function Home(props: PageProps<{
  posts: Post[],
  loggedIn: boolean,
}>) {
  const { posts, loggedIn } = props.data;
  return (
    <>
      <Head>
        <title>Louis' Blog</title>
      </Head>
      <SiteBase>
        <Header backHome={false} />
        {posts.map((post) => (
          <PostContainer post={post} link={true} editPost={false} />
        ))}
        <SiteFooter loggedIn={loggedIn} />
      </SiteBase>
    </>
  );
}
