'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter the image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const url = window.prompt('Enter the URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border-b border-gray-200 p-4 flex flex-wrap gap-2">
      <div className="flex gap-1 items-center border-r border-gray-200 pr-2 mr-2">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-[#1a1a1a] text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-[#1a1a1a] text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-[#1a1a1a] text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          H3
        </button>
      </div>

      <div className="flex gap-1 items-center border-r border-gray-200 pr-2 mr-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('bold')
              ? 'bg-[#1a1a1a] text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('italic')
              ? 'bg-[#1a1a1a] text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('strike')
              ? 'bg-[#1a1a1a] text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          <s>S</s>
        </button>
      </div>

      <div className="flex gap-1 items-center border-r border-gray-200 pr-2 mr-2">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('bulletList')
              ? 'bg-[#1a1a1a] text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('orderedList')
              ? 'bg-[#1a1a1a] text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          1. List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('blockquote')
              ? 'bg-[#1a1a1a] text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          Quote
        </button>
      </div>

      <div className="flex gap-1 items-center">
        <button
          onClick={setLink}
          className={`px-2 py-1 rounded ${
            editor.isActive('link')
              ? 'bg-[#1a1a1a] text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          Link
        </button>
        <button
          onClick={addImage}
          className="px-2 py-1 rounded hover:bg-gray-100"
        >
          Image
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-2 py-1 rounded hover:bg-gray-100"
        >
          Line
        </button>
      </div>
    </div>
  );
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your amazing blog post...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none p-4 focus:outline-none min-h-[500px]',
      },
    },
  });

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor; 