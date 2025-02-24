import React from 'react';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';

async function getAllPosts() {
  await connectDB();
  const posts = await Post.find({ status: 'published' })
    .sort({ createdAt: -1 })
    .lean();
  return posts;
}

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <Layout>
      <div className="max-w-[1600px] mx-auto px-4 py-16">
        <header className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Blog Posts
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore all my articles and thoughts on various topics.
          </p>
        </header>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {posts.map((post: any, index: number) => (
              <PostCard
                key={post._id.toString()}
                title={post.title}
                excerpt={post.excerpt}
                slug={post.slug}
                coverImage={post.coverImage}
                author={post.author}
                date={post.createdAt}
                featured={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-600">
              Check back later for new articles and updates.
            </p>
          </div>
        )}

        {/* Newsletter Section */}
        <section className="mt-32 border-t border-gray-200 pt-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold mb-8">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-gray-600 mb-10 text-lg leading-relaxed">
              Get notified about new articles and updates straight to your inbox.
            </p>
            <form className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] text-lg"
              />
              <button
                type="submit"
                className="px-10 py-4 bg-[#1a1a1a] text-white rounded-r-lg hover:bg-black transition-colors text-lg font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </div>
    </Layout>
  );
} 