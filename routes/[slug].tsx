import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import Header from "../components/Header.tsx";
import PostContainer from "../components/PostContainer.tsx";
import SiteBase from "../components/SiteBase.tsx";
import SiteFooter from "../components/SiteFooter.tsx";
import { isLoggedIn } from "../utils/auth.ts";
import { Post, getPost } from "../utils/getPosts.ts";

// const CACHE = await caches.open("v6");

export const handler: Handlers = {
  async GET(req, ctx) {
    const loggedIn = await isLoggedIn(req);
    // if (!loggedIn) {
    //   // const res = await CACHE.match(req);
      
    //   if (res) {
    //     const timestamp = res.headers.get('x-cache');
    //     const duration = timestamp
    //       ? new Date().getTime() - new Date(timestamp).getTime()
    //       : 0;
    //     // convert milliseconds to minutes
    //     const mins = Math.floor(duration / 60000);
    //     console.log(`Cached for ${mins} mins`);
    //     // Here we can control when to ignore the cache
    //     // e.g we can bypass the cache after 1 hour
    //     res.headers.set("x-cache-hit", "true");
    //     // return cached response
    //     if (mins < 60) {
    //       // return res;
    //     }
    //   }
    // }
    const post = await getPost(ctx.params.slug);
    if (!post) {
      return ctx.renderNotFound();
    }
    const response = ctx.render({ post, loggedIn });
    // if (response instanceof Promise) {
    //   response.then((res) => {
    //     const clonedRequest = res.clone();
    //     clonedRequest.headers.set('x-cache', new Date().toUTCString());
    //     console.log(`Caching post "${post.title}"`);
    //     CACHE.put(req, clonedRequest);
    //   })
    // }
    return response;
  },
};

export default function Home(props: PageProps<{post: Post, loggedIn: boolean }>) {
  const { title, slug, timestamp, tags, body } = props.data.post;
  console.log(props.url.href);
  const pageTitle = `${title} - Louis' Blog`;
  const pageDescription = '';
  const imageUrl = props.url.href + '/imgs/deno-blog-kv.jpg';
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content="" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={props.url.href} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imageUrl} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={props.url.href} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content={imageUrl} />
      </Head>
      <SiteBase>
        <Header backHome={true} />
        {props.data.post && <PostContainer
          post={props.data.post}
          link={false}
          editPost={props.data.loggedIn}
        />}
        <SiteFooter loggedIn={props.data.loggedIn} />
      </SiteBase>
    </>
  );
}
