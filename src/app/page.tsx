import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';

async function getPosts() {
  await connectDB();
  const posts = await Post.find({ status: 'published' })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();
  return posts;
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <Layout>
      {/* Main Featured Story */}
      <section className="max-w-[1600px] mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="relative aspect-[4/5] w-full">
            <Image
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
              alt="Beautiful mountain landscape at sunset"
              fill
              className="object-cover"
              priority
              quality={100}
            />
          </div>
          <div className="lg:pl-12 py-12">
            <span className="text-sm uppercase tracking-wider mb-6 block">Featured Story</span>
            <h1 className="text-5xl lg:text-7xl font-serif leading-tight mb-6">
              The Art of Modern Design
            </h1>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-xl">
              Discover how contemporary designers are reshaping our world through innovative approaches and sustainable practices.
            </p>
            <Link
              href="/explore"
              className="inline-block border-b-2 border-black pb-1 text-lg hover:border-gray-400 transition-colors"
            >
              Read More
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-[1600px] mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {['Interior Design', 'Architecture', 'Lifestyle'].map((category, index) => {
            const images = {
              'Interior Design': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6',
              'Architecture': 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2',
              'Lifestyle': 'https://images.unsplash.com/photo-1511988617509-a57c8a288659'
            };
            return (
              <Link 
                key={category}
                href={`/explore?category=${category.toLowerCase()}`} 
                className={`relative overflow-hidden ${
                  index === 0 ? 'md:col-span-6' : 'md:col-span-3'
                }`}
              >
                <div className="relative aspect-[1/1]">
                  <Image
                    src={images[category as keyof typeof images]}
                    alt={category}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-colors" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl font-serif text-white">{category}</h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Latest Stories */}
      <section className="bg-[#F8F8F8] py-20">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="flex justify-between items-baseline mb-12">
            <h2 className="text-4xl font-serif">Latest Stories</h2>
            <Link
              href="/explore"
              className="text-sm uppercase tracking-wider hover:text-gray-600"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-gray-200 py-20">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-serif mb-6">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-gray-600 mb-8">
              Get the latest in design, architecture, and creative culture delivered directly to your inbox
            </p>
            <form className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 focus:border-black outline-none"
              />
              <button
                type="submit"
                className="bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
