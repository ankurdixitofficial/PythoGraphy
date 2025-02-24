'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  slug: string;
  coverImage: string;
  author: string;
  createdAt: string;
}

const categories = [
  'All',
  'Interior Design',
  'Architecture',
  'Lifestyle',
  'Renovation',
  'Decoration'
];

function ExploreContent() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  const POSTS_PER_PAGE = 12;

  async function loadPosts(reset = false) {
    if (loading && !reset) return;
    
    try {
      setLoading(true);
      const category = activeCategory === 'All' ? '' : activeCategory;
      const currentPage = reset ? 1 : page;
      const response = await fetch(
        `/api/posts?page=${currentPage}&limit=${POSTS_PER_PAGE}${category ? `&category=${category}` : ''}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      
      if (data.length < POSTS_PER_PAGE) {
        setHasMore(false);
      }
      
      setPosts(prev => (reset ? data : [...prev, ...data]));
      setPage(prev => (reset ? 2 : prev + 1));
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    setHasMore(true);
    setPosts([]);
    loadPosts(true);
  }, [activeCategory]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadPosts();
    }
  }, [inView, hasMore, loading]);

  return (
    <div className="max-w-[1600px] mx-auto px-4">
      {/* Category Navigation */}
      <nav className="py-8 border-b border-gray-200 mb-12">
        <ul className="flex flex-wrap gap-6">
          {categories.map((category) => (
            <li key={category}>
              <button
                onClick={() => setActiveCategory(category)}
                className={`text-sm uppercase tracking-wider ${
                  activeCategory === category
                    ? 'text-black font-medium'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
        {posts.map((post, index) => (
          <PostCard
            key={post._id}
            title={post.title}
            excerpt={post.excerpt}
            slug={post.slug}
            coverImage={post.coverImage}
            author={post.author}
            date={post.createdAt}
            featured={index === 0 && page === 2}
          />
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4 animate-pulse">
              <div className="aspect-square bg-gray-100" />
              <div className="h-4 bg-gray-100 w-1/4" />
              <div className="h-6 bg-gray-100 w-3/4" />
              <div className="h-4 bg-gray-100 w-full" />
            </div>
          ))}
        </div>
      )}

      {/* End States */}
      {!loading && !hasMore && posts.length > 0 && (
        <div className="text-center py-20 border-t border-gray-200 mt-20">
          <p className="text-gray-600 uppercase text-sm tracking-wider">End of Stories</p>
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-600 uppercase text-sm tracking-wider">No stories found</p>
        </div>
      )}

      {/* Intersection Observer target */}
      {hasMore && <div ref={ref} className="h-20" />}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Layout>
      <Suspense fallback={
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="py-8 border-b border-gray-200 mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-xl" />
                <div className="h-4 bg-gray-200 w-1/4 rounded" />
                <div className="h-6 bg-gray-200 w-3/4 rounded" />
                <div className="h-4 bg-gray-200 w-full rounded" />
              </div>
            ))}
          </div>
        </div>
      }>
        <ExploreContent />
      </Suspense>
    </Layout>
  );
} 