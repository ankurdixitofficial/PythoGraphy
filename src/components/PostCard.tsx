import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PostCardProps {
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  author: string;
  date: string;
  featured?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  title,
  excerpt,
  slug,
  coverImage,
  author,
  date,
  featured = false,
}) => {
  return (
    <article className={`${featured ? 'md:col-span-2' : ''} group relative transform transition-transform duration-300 hover:scale-105 hover:z-10`}>
      <Link href={`/blog/${slug}`} className="group block">
        <div className={`relative ${featured ? 'aspect-[16/9]' : 'aspect-square'} mb-8 overflow-hidden rounded-xl`}>
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-100 group-hover:bg-gray-200 transition-colors" />
          )}
        </div>

        <div className="space-y-4 transform transition-all duration-300">
          <div className="flex items-center space-x-3 text-sm uppercase tracking-wider text-gray-500">
            <span>{author}</span>
            <span>•</span>
            <time dateTime={date}>
              {new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>

          <h3 className={`font-serif ${featured ? 'text-4xl' : 'text-2xl'} font-bold group-hover:text-gray-600 transition-colors leading-tight`}>
            {title}
          </h3>

          <p className="text-gray-600 leading-relaxed text-lg transition-all duration-300 group-hover:line-clamp-none">
            {excerpt}
          </p>

          <div className="pt-4">
            <span className="text-sm uppercase tracking-wider font-medium text-[#1a1a1a] group-hover:text-black">
              Read More →
            </span>
          </div>
        </div>
      </Link>

      {/* Expanded Preview on Hover */}
      <div className="absolute top-full left-0 right-0 bg-white p-6 rounded-b-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="prose prose-sm">
          <h4 className="text-lg font-semibold mb-2">Quick Preview</h4>
          <p className="text-gray-600">{excerpt}</p>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-500">By {author}</span>
            <span className="text-[#1a1a1a] font-medium">Click to read more</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard; 