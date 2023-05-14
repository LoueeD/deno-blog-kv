import { Post } from "../utils/getPosts.ts";
import { getRelativeTimeString } from "../utils/getRelativeTimeString.ts";
import slugify from 'https://esm.sh/slugify@1.6.6';
import Editor from '../islands/Editor.tsx';

function getSlug (str: string) {
  return slugify(str, {
    replacement: '-', lower: true, strict: false, locale: 'en', trim: true
  });
}

function PostContent(data: { post: Post, link: boolean, editPost: boolean }) {
  const date = getRelativeTimeString(new Date(data.post.timestamp), 'en');
  return (
    <>
      <div class="border-l-1 ml-[-1px] border-white pl-6">
        <h2 class={'font-bold ' + (!data.link ? 'text-2xl' : '')}>{data.post.title}</h2>
        <p class="opacity-50">{date}</p>
        {/* <p class="">{data.post.tags.map((tag) => 
          <span><a class="text-[0.9em] rounded-full bg-white bg-opacity-10 py-1 px-2" href={`/tag/${tag}`}>{tag}</a></span>
        )}</p> */}
      </div> 
      {!data.editPost && <div class="p-6 leading-6" data-content dangerouslySetInnerHTML={{ __html: data.post.body }} /> }
      {data.editPost && <Editor post={data.post} />}
    </>
  )
}

export default function PostContainer(data: { post: Post, link: boolean, editPost: boolean }) {
  return (
    <div class="flex border-b-1 border-white border-opacity-10 last-child:border-b-0">
      {data.link && <a class="flex-1 flex-col flex pt-6" href={`/${data.post.slug}`}>
        {<PostContent post={data.post} link={data.link} editPost={data.editPost} />}
      </a>}
      {!data.link && <div class="flex-1 flex-col flex pt-6">
        {<PostContent post={data.post} link={data.link} editPost={data.editPost} />}
      </div>}
    </div>
  )
}