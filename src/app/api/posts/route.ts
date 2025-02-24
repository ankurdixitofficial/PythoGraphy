import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import slugify from 'slugify';

interface CreatePostData {
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author?: string;
  tags?: string | string[];
  status?: 'published' | 'draft';
}

function generateSlug(title: string): string {
  return slugify(title, {
    lower: true,      // Convert to lower case
    strict: true,     // Strip special characters except replacement
    trim: true,       // Trim leading and trailing replacement chars
    locale: 'en',     // Language code for locale-specific rules
    remove: /[*+~.()'"!:@]/g  // Remove specific characters
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const data: CreatePostData = await request.json();
    const { title, content, excerpt, coverImage, author, tags, status } = data;

    if (!title || !content || !excerpt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a unique slug from the title
    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    // Check for existing slugs and make unique if necessary
    while (await Post.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Get user ID from session
    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found in session' },
        { status: 400 }
      );
    }

    const post = await Post.create({
      title,
      slug,
      content,
      excerpt,
      coverImage,
      author: author || session.user.name,
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [],
      status: status || 'published',
      userId: userId,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create post' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;
    
    // Filtering parameters
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    
    let query: any = {};
    
    // If userId is provided, filter by user
    if (userId) {
      query.userId = userId;
    }
    
    // If status is provided, filter by status
    if (status) {
      query.status = status;
    } else {
      // By default, only show published posts
      query.status = 'published';
    }

    // If category is provided, filter by category
    if (category) {
      query.tags = { $in: [category] };
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content') // Exclude content for list view
      .lean();

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
} 