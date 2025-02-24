'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Dynamically import RichTextEditor with SSR disabled
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  ssr: false,
});

const AUTOSAVE_INTERVAL = 30000; // 30 seconds
const MAX_TITLE_LENGTH = 100;
const MAX_EXCERPT_LENGTH = 200;

interface DraftPost {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string;
  status: 'draft' | 'published';
}

export default function ComposePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<DraftPost>({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    author: '',
    tags: '',
    status: 'published',
  });

  // Load draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('blogDraft');
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      setFormData(draft);
    }
  }, []);

  // Autosave
  useEffect(() => {
    const autosaveTimer = setInterval(() => {
      if (formData.title || formData.content) {
        localStorage.setItem('blogDraft', JSON.stringify(formData));
        console.log('Draft autosaved');
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(autosaveTimer);
  }, [formData]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return null;
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length > MAX_TITLE_LENGTH) {
      errors.title = `Title must be less than ${MAX_TITLE_LENGTH} characters`;
    }

    if (!formData.excerpt.trim()) {
      errors.excerpt = 'Excerpt is required';
    } else if (formData.excerpt.length > MAX_EXCERPT_LENGTH) {
      errors.excerpt = `Excerpt must be less than ${MAX_EXCERPT_LENGTH} characters`;
    }

    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    }

    if (formData.coverImage && !isValidUrl(formData.coverImage)) {
      errors.coverImage = 'Please enter a valid URL';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!validateForm()) {
        throw new Error('Please fix the validation errors');
      }

      if (!session?.user?.id) {
        throw new Error('User session not found. Please try logging in again.');
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          author: formData.author || session?.user?.name,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create post');
      }

      // Clear draft from localStorage
      localStorage.removeItem('blogDraft');
      router.push(`/blog/${data.slug}`);
    } catch (error: any) {
      console.error('Error creating post:', error);
      setError(error.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await handleImageUpload(file);
      setFormData(prev => ({ ...prev, coverImage: imageUrl }));
    } catch (error: any) {
      setError(error.message || 'Failed to upload image');
    }
  };

  if (isPreview) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Preview</h1>
            <button
              onClick={() => setIsPreview(false)}
              className="px-6 py-2 bg-[#1a1a1a] text-white rounded-full hover:bg-black"
            >
              Edit
            </button>
          </div>

          <article className="prose max-w-none">
            <h1>{formData.title}</h1>
            {formData.coverImage && (
              <div className="relative w-full h-[400px] mb-8">
                <Image
                  src={formData.coverImage}
                  alt={formData.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
            <p className="text-xl text-gray-600">{formData.excerpt}</p>
            <div dangerouslySetInnerHTML={{ __html: formData.content }} />
            {formData.tags && (
              <div className="mt-8 flex flex-wrap gap-2">
                {formData.tags.split(',').map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </article>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Create New Post</h1>
          <p className="text-gray-600">
            Write your blog post using the editor below. Use the formatting tools to style your content.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title * <span className="text-gray-400">({formData.title.length}/{MAX_TITLE_LENGTH})</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={MAX_TITLE_LENGTH}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] ${
                  validationErrors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter post title"
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.title}</p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:border-[#1a1a1a]"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt * <span className="text-gray-400">({formData.excerpt.length}/{MAX_EXCERPT_LENGTH})</span>
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
              maxLength={MAX_EXCERPT_LENGTH}
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] ${
                validationErrors.excerpt ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Write a brief excerpt for your post"
            />
            {validationErrors.excerpt && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.excerpt}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image
            </label>
            <div className="flex gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:border-[#1a1a1a]"
              />
              <span className="text-sm text-gray-500">or</span>
              <input
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] ${
                  validationErrors.coverImage ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter image URL"
              />
            </div>
            {validationErrors.coverImage && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.coverImage}</p>
            )}
            {formData.coverImage && (
              <div className="mt-4 relative w-full h-48">
                <Image
                  src={formData.coverImage}
                  alt="Cover preview"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author || session?.user?.name || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:border-[#1a1a1a]"
              placeholder="Enter author name (defaults to your name)"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:border-[#1a1a1a]"
              placeholder="Enter tags (comma-separated)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => {
                setFormData(prev => ({ ...prev, content }));
                if (validationErrors.content) {
                  setValidationErrors(prev => ({ ...prev, content: '' }));
                }
              }}
            />
            {validationErrors.content && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.content}</p>
            )}
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setIsPreview(true)}
              className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50"
            >
              Preview
            </button>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="px-6 py-2 bg-[#1a1a1a] text-white rounded-full hover:bg-black disabled:opacity-50"
              >
                {loading ? 'Publishing...' : uploadingImage ? 'Uploading...' : formData.status === 'draft' ? 'Save Draft' : 'Publish Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
} 