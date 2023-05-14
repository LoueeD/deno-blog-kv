import { useState, useRef, useEffect } from "preact/hooks";
import { Button } from "../components/Button.tsx";
import { Editor } from 'https://esm.sh/@tiptap/core@2.0.3'
import StarterKit from 'https://esm.sh/@tiptap/starter-kit@2.0.3';
import Image from "https://esm.sh/@tiptap/extension-image@2.0.3";
import { Post } from "../utils/getPosts.ts";
import slugify from "https://esm.sh/v120/slugify@1.6.6/slugify.js";

function getSlug (str: string) {
  return slugify(str, {
    replacement: '-', lower: true, strict: false, locale: 'en', trim: true
  });
}

interface EditorProps {
  post: Post;
}

export default function Counter(props: EditorProps) {
  const [title, setTitle] = useState(props.post.title);
  const [slug, setSlug] = useState(props.post.slug);
  const [content, setContent] = useState(props.post.body);
  const editorEl = useRef<HTMLDivElement>(null);
  
  const setupEditor = (element: HTMLDivElement) => {
    const editor = new Editor({
      element,
      extensions: [
        StarterKit,
        Image,
      ],
      content: content,
    });
  }

  useEffect(() => {
    if (editorEl.current) {
      setupEditor(editorEl.current)
    }
  }, []);

  useEffect(() => {
    if (title) {
      setSlug(getSlug(title));
    }
  }, []);

  const [draftPost, setChecked] = useState(false);
  const onDraftChange = (e: Event) => {
    if (!(e.target instanceof HTMLInputElement)) return;
    setChecked(e.target.checked);
  }

  const fields = [
    {
      name: 'title',
      placeholder: 'Title...',
      get value () { return title },
      setter: setTitle,
    },
    {
      name: 'slug',
      placeholder: 'Slug...',
      get value () { return slug },
      setter: setSlug,
    }
  ];

  const updateField = (e: Event, setter: (val: string) => void) => {
    if (!(e.target instanceof HTMLInputElement)) return;
    setter(e.target.value);
  };


  return (
    <form class="flex mt-6 flex-col">
      <label class="flex relative text-center overflow-hidden">
        <input class="absolute left-[-100px]" type="checkbox" onChange={onDraftChange} checked={draftPost}  />
        <span
          class="flex-1 p-3 cursor-pointer border-t-1 border-b-1 border-white border-opacity-10"
          style={{
            'border-bottom-color': !draftPost ? '#fff' : '',
            'background-color': !draftPost ? 'rgba(255,255,255,0.05)' : ''
          }}
        >Live</span>
        <span
          class="flex-1 p-3 cursor-pointer border-t-1 border-b-1 border-white border-opacity-10"
          style={{
            'border-bottom-color': draftPost ? '#fff' : '',
            'background-color': draftPost ? 'rgba(255,255,255,0.05)' : ''
          }}
        >Draft</span>
      </label>
      {fields.map((field) => (
        <input
          class="p-6 bg-transparent border-b-1 border-white border-opacity-10"
          name={field.name}
          type="text"
          placeholder={field.placeholder}
          value={field.value}
          onKeyUp={(e) => updateField(e, field.setter)}
        />
      ))}
      {/* <input class="p-6 bg-transparent border-b-1 border-white border-opacity-10" name="slug" type="text" placeholder="Post Slug ..." /> */}
      {/* <input class="p-6 bg-transparent border-b-1 border-white border-opacity-10" name="timestamp" type="datetime-local" /> */}
      {/* <input class="p-6 bg-transparent border-b-1 border-white border-opacity-10" name="version" type="hidden" value="0.0.1" /> */}
      <div data-content ref={editorEl}></div>
      <div class="flex justify-end">
        <button type="submit">Post</button>
      </div>
      {JSON.stringify(fields)}
    </form>
  );
}
