import React from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    slug: string;
  };
}

async function getPost(slug: string) {
  await connectDB();
  const post = await Post.findOne({ slug }).lean();
  return post;
}

export default async function BlogPost({ params }: PageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <Layout>
      <article className="max-w-4xl mx-auto mt-8">
        {post.coverImage && (
          <div className="relative w-full h-[500px] mb-12">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover rounded-xl shadow-lg"
              priority
            />
          </div>
        )}

        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            {post.title}
          </h1>
          <div className="flex items-center text-gray-600 space-x-4 text-lg">
            <span>{post.author}</span>
            <span>•</span>
            <time dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </header>

        <div className="prose prose-lg md:prose-xl max-w-none space-y-6">
          {post.content}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-base hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </Layout>
  );
} 