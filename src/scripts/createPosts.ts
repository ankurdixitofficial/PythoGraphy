import { connect } from 'mongoose';
import slugify from 'slugify';
import Post from '../models/Post';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const blogPosts = [
  {
    title: "10 Simple Steps to Start Your Zero-Waste Journey",
    author: "GreenLifeGuru",
    excerpt: "Begin your sustainable living journey with these practical and achievable zero-waste tips.",
    content: `Starting Your Zero-Waste Journey

Making the transition to a zero-waste lifestyle doesn't have to be overwhelming. Here are 10 simple steps to get you started:

1. Audit Your Waste
Before making any changes, spend a week tracking your household waste. This will help you identify areas where you can make the biggest impact.

2. Invest in Reusables
Start building your zero-waste kit: cloth bags, water bottle, coffee cup, utensils, and containers for shopping.

3. Start Composting
Whether you have a garden or use a community composting service, this is a great way to reduce food waste.

4. Shop in Bulk
Find stores that allow you to bring your own containers and buy in bulk to reduce packaging waste.

5. Learn to Refuse
Practice saying no to unnecessary items like promotional materials, free samples, and single-use items.

Remember, the goal isn't perfection but progress. Start with these steps and gradually expand your zero-waste practices as you become more comfortable.`,
    coverImage: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9",
    tags: ["Sustainable Living", "Zero Waste", "Environment", "Lifestyle"],
  },
  {
    title: "The Future of AI: 2024's Breakthrough Technologies",
    author: "ByteBlazer",
    excerpt: "Explore the latest AI innovations shaping our future, from quantum computing to neural interfaces.",
    content: `AI Breakthroughs Transforming Our World

The field of artificial intelligence continues to evolve at an unprecedented pace. Here are the most significant developments of 2024:

Quantum AI Integration
The convergence of quantum computing and AI is creating new possibilities for solving complex problems that were previously impossible to tackle.

Advanced Natural Language Processing
New models are achieving near-human levels of understanding and generation across multiple languages and contexts.

AI in Healthcare
Breakthrough applications in medical diagnosis and drug discovery are revolutionizing healthcare delivery and research.

These advancements are just the beginning of what promises to be a transformative decade in AI technology.`,
    coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    tags: ["Technology", "AI", "Innovation", "Future Tech"],
  },
  {
    title: "Hidden Gems of Southeast Asia: Off the Beaten Path",
    author: "WanderlustWraith",
    excerpt: "Discover secret locations and authentic experiences in Southeast Asia's less-traveled destinations.",
    content: `Exploring Southeast Asia's Secret Spots

Beyond the popular tourist destinations lie countless hidden treasures waiting to be discovered.

Kampong Ayer, Brunei
Experience life in the world's largest water village, where traditional stilt houses create a unique community on the water.

Phong Nha, Vietnam
Home to some of the world's largest caves, this region offers spectacular underground adventures away from the crowds.

Bantayan Island, Philippines
Find pristine beaches and authentic island life without the tourist crowds of more popular destinations.

These destinations offer authentic cultural experiences and natural beauty while helping support local communities.`,
    coverImage: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a",
    tags: ["Travel", "Adventure", "Southeast Asia", "Hidden Gems"],
  },
  {
    title: "Nutrient-Packed Buddha Bowls: 5 Perfect Combinations",
    author: "FitFoodieFreak",
    excerpt: "Create balanced, delicious Buddha bowls that fuel your body and satisfy your taste buds.",
    content: `The Art of Building the Perfect Buddha Bowl

Buddha bowls are more than just pretty food - they're a perfect way to create balanced, nutritious meals.

Mediterranean Dream Bowl
Quinoa base, roasted chickpeas, cucumber, cherry tomatoes, olives, and tahini dressing.

Asian Fusion Bowl
Brown rice, edamame, roasted sweet potato, pickled vegetables, and miso dressing.

Mexican Fiesta Bowl
Cauliflower rice, black beans, corn, avocado, and cilantro lime dressing.

Each bowl is designed to provide a perfect balance of proteins, healthy fats, and complex carbohydrates.`,
    coverImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    tags: ["Healthy Eating", "Recipes", "Nutrition", "Meal Prep"],
  },
  {
    title: "Investment Strategies for Millennials in 2024",
    author: "MoneyMogulX",
    excerpt: "Smart investment approaches tailored for millennials in today's dynamic market.",
    content: `Building Wealth in Your 30s and 40s

Millennials face unique challenges and opportunities in today's investment landscape.

Diversification Strategies
Beyond traditional stocks and bonds, explore alternative investments like REITs and ETFs.

Tech-Savvy Investing
Leverage robo-advisors and investment apps while understanding their benefits and limitations.

Long-term Planning
Balance retirement savings with shorter-term goals like home ownership and emergency funds.

The key is to start early and stay consistent with your investment strategy while managing risk.`,
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    tags: ["Finance", "Investing", "Money Management", "Millennials"],
  },
  {
    title: "Transform Your Space: Weekend DIY Projects",
    author: "CraftyCarpenter",
    excerpt: "Easy and impactful DIY projects to upgrade your living space without breaking the bank.",
    content: `Weekend Warriors: DIY Home Improvements

Transform your living space with these achievable weekend projects:

1. Floating Shelves Installation
Create custom storage solutions with modern floating shelves. Perfect for displaying books, plants, or decorative items.

2. Accent Wall Creation
Learn how to design and paint an accent wall that becomes the focal point of any room.

3. Cabinet Hardware Upgrade
Give your kitchen or bathroom a fresh look by replacing old hardware with modern alternatives.

These projects require basic tools and can be completed in a weekend, making a significant impact on your home's appearance.`,
    coverImage: "https://images.unsplash.com/photo-1484154218962-a197022b5858",
    tags: ["DIY", "Home Improvement", "Interior Design", "Weekend Projects"],
  },
  {
    title: "Understanding and Managing Anxiety: A Practical Guide",
    author: "MindfulMuse",
    excerpt: "Practical strategies and insights for managing anxiety in daily life.",
    content: `Taking Control of Anxiety

Anxiety is a common experience, but there are effective ways to manage it:

Understanding Triggers
Learn to identify and track your anxiety triggers to better prepare for challenging situations.

Breathing Techniques
Simple but effective breathing exercises that can help calm your nervous system.

Lifestyle Changes
Small adjustments to daily routines that can have a big impact on anxiety levels.

Remember, seeking professional help is always a valid and important option when dealing with anxiety.`,
    coverImage: "https://images.unsplash.com/photo-1474418397713-7ede21d49118",
    tags: ["Mental Health", "Anxiety", "Self-Care", "Wellness"],
  },
  {
    title: "Vintage Fashion Finds: Thrifting Guide 2024",
    author: "RetroRunway",
    excerpt: "Master the art of finding unique vintage pieces and styling them for modern wear.",
    content: `Thrifting for Vintage Treasures

Discover how to find and style vintage clothing pieces:

Where to Look
The best places to find authentic vintage pieces, from local thrift stores to online marketplaces.

What to Look For
Tips for identifying quality vintage items and checking for authenticity.

Modern Styling
How to incorporate vintage pieces into your contemporary wardrobe.

Building a unique wardrobe through vintage shopping is both sustainable and stylish.`,
    coverImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
    tags: ["Fashion", "Vintage", "Thrifting", "Style"],
  },
  {
    title: "Next-Gen Gaming: Must-Play Titles of 2024",
    author: "PixelProwler",
    excerpt: "Comprehensive reviews of this year's most innovative and engaging video games.",
    content: `Gaming Excellence in 2024

This year has brought some incredible gaming experiences:

Top RPG Releases
Immersive role-playing games that are pushing storytelling boundaries.

Indie Gems
Smaller studios delivering big experiences with unique gameplay mechanics.

Technical Achievements
Games that showcase the latest in graphics and gaming technology.

From indie darlings to AAA blockbusters, 2024 is shaping up to be an exceptional year for gaming.`,
    coverImage: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8",
    tags: ["Gaming", "Video Games", "Reviews", "Technology"],
  },
  {
    title: "Spring Garden Planning: Essential Tips",
    author: "BloomBoss",
    excerpt: "Get your garden ready for spring with this comprehensive planning guide.",
    content: `Planning Your Spring Garden

Prepare for a successful growing season with these essential tips:

Soil Preparation
How to test and amend your soil for optimal growing conditions.

Plant Selection
Choosing the right plants for your climate and garden space.

Layout Planning
Design tips for both aesthetic appeal and practical growing considerations.

A well-planned garden leads to a bountiful and beautiful growing season.`,
    coverImage: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b",
    tags: ["Gardening", "Spring", "Plants", "DIY"],
  },
  {
    title: "Understanding Your Pet's Body Language",
    author: "PawsomePal",
    excerpt: "Learn to better communicate with your pet by understanding their behavioral cues.",
    content: `Reading Your Pet's Signals

Better understand your furry friend's needs through body language:

Tail Positions
What different tail positions and movements mean in cats and dogs.

Facial Expressions
Understanding ear positions, eye contact, and other facial cues.

Body Postures
What different stances and positions communicate about your pet's mood.

Building better communication leads to a stronger bond with your pet.`,
    coverImage: "https://images.unsplash.com/photo-1450778869180-41d0601e046e",
    tags: ["Pets", "Animals", "Behavior", "Care"],
  },
  {
    title: "2024's Most Anticipated Book Releases",
    author: "LitLeafTurner",
    excerpt: "A curated list of must-read books coming out this year across all genres.",
    content: `Literary Highlights of 2024

Mark your calendars for these exciting new releases:

Fiction Highlights
Anticipated novels from both established authors and exciting new voices.

Non-Fiction Gems
Thought-provoking works that explore contemporary issues and historical events.

Genre Fiction
The best upcoming releases in fantasy, science fiction, and mystery.

2024 promises to be an excellent year for readers across all genres.`,
    coverImage: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
    tags: ["Books", "Reading", "Literature", "Reviews"],
  },
  {
    title: "30-Day HIIT Challenge for Beginners",
    author: "SweatSpark",
    excerpt: "Start your fitness journey with this adaptable 30-day high-intensity interval training program.",
    content: `Getting Started with HIIT

Transform your fitness with this beginner-friendly program:

Week 1: Foundation
Basic movements and interval timing to build your base.

Week 2-3: Progressive Overload
Gradually increasing intensity and complexity of movements.

Week 4: Peak Performance
Combining movements into challenging but achievable workouts.

Remember to listen to your body and modify as needed throughout the challenge.`,
    coverImage: "https://images.unsplash.com/photo-1434682881908-b43d0467b798",
    tags: ["Fitness", "HIIT", "Workout", "Health"],
  },
  {
    title: "Mastering Natural Light Photography",
    author: "ShutterSage",
    excerpt: "Learn to capture stunning photos using natural light in any condition.",
    content: `Natural Light Photography Guide

Harness the power of natural light for beautiful photos:

Golden Hour Magic
Making the most of early morning and late afternoon light.

Overcast Advantages
How to use diffused light for soft, flattering images.

Harsh Light Solutions
Techniques for shooting in challenging midday sun.

Natural light photography is both an art and a science - master both aspects.`,
    coverImage: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d",
    tags: ["Photography", "Tutorial", "Natural Light", "Creative"],
  },
  {
    title: "Minimalist Home: Room-by-Room Guide",
    author: "SimpleSoulX",
    excerpt: "Transform your living space with practical minimalist principles.",
    content: `Embracing Minimalism at Home

Create a calming, clutter-free environment in every room:

Living Room Essentials
Creating a functional and peaceful main living space.

Bedroom Sanctuary
Designing a restful sleep environment with minimal distractions.

Kitchen Organization
Streamlining your kitchen for efficiency and simplicity.

Minimalism isn't about empty spaces, but about meaningful ones.`,
    coverImage: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85",
    tags: ["Minimalism", "Home Decor", "Organization", "Lifestyle"],
  },
  {
    title: "The Evolution of Jazz: 1920s to Now",
    author: "VinylVibeMaster",
    excerpt: "Explore the rich history and modern innovations in jazz music.",
    content: `Jazz Through the Ages

Trace the evolution of this influential musical genre:

The Roaring 20s
The birth of jazz and its early innovators.

Bebop Revolution
How bebop changed the face of jazz forever.

Modern Fusion
Contemporary artists pushing jazz in new directions.

Understanding jazz history helps appreciate its current innovations.`,
    coverImage: "https://images.unsplash.com/photo-1511192657929-1fdd892cf4c3",
    tags: ["Music", "Jazz", "History", "Culture"],
  },
  {
    title: "Navigating Career Changes in 2024",
    author: "JobJourneyJedi",
    excerpt: "Strategic guidance for making successful career transitions in today's job market.",
    content: `
      <h2>Making Your Career Move</h2>
      <p>Navigate career changes with confidence:</p>

      <h3>Market Analysis</h3>
      <p>Understanding current job market trends and opportunities.</p>

      <h3>Skill Assessment</h3>
      <p>Identifying transferable skills and areas for development.</p>

      <h3>Transition Strategy</h3>
      <p>Creating a practical plan for your career change.</p>

      <p>A well-planned career transition can lead to greater professional satisfaction.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
    tags: ["Career", "Professional Development", "Job Search", "Advice"],
  },
  {
    title: "Finding Your Creative Voice in Art",
    author: "BrushBoldly",
    excerpt: "Develop your unique artistic style through exploration and practice.",
    content: `
      <h2>Discovering Your Artistic Identity</h2>
      <p>Steps to develop your unique creative voice:</p>

      <h3>Exploration Phase</h3>
      <p>Trying different mediums and styles to find what resonates.</p>

      <h3>Technical Foundation</h3>
      <p>Building the skills needed to express your vision.</p>

      <h3>Style Development</h3>
      <p>Refining your unique artistic perspective.</p>

      <p>Your creative voice is a journey of discovery and continuous evolution.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b",
    tags: ["Art", "Creativity", "Self-Expression", "Tutorial"],
  },
  {
    title: "Smart Parenting Hacks for Busy Families",
    author: "TinyTribeTamer",
    excerpt: "Time-saving tips and organizational strategies for modern parents.",
    content: `
      <h2>Streamlining Family Life</h2>
      <p>Make family management easier with these practical tips:</p>

      <h3>Morning Routines</h3>
      <p>Creating smooth and efficient morning transitions.</p>

      <h3>Meal Planning</h3>
      <p>Strategies for quick, healthy family meals.</p>

      <h3>Activity Organization</h3>
      <p>Managing multiple schedules and activities effectively.</p>

      <p>Small changes in routine can make a big difference in family harmony.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e",
    tags: ["Parenting", "Family", "Organization", "Lifestyle"],
  },
  {
    title: "Understanding Black Holes: Latest Discoveries",
    author: "CosmicCurator",
    excerpt: "Recent breakthroughs in our understanding of these mysterious cosmic objects.",
    content: `
      <h2>Black Hole Breakthroughs</h2>
      <p>Explore the latest discoveries about these fascinating cosmic phenomena:</p>

      <h3>Event Horizon Insights</h3>
      <p>New findings from the Event Horizon Telescope project.</p>

      <h3>Gravitational Waves</h3>
      <p>What we're learning from gravitational wave detection.</p>

      <h3>Formation Theories</h3>
      <p>Updated theories on black hole formation and evolution.</p>

      <p>Our understanding of black holes continues to evolve with new observations.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564",
    tags: ["Science", "Space", "Physics", "Astronomy"],
  }
];

async function createPosts() {
  try {
    await connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing posts
    await Post.deleteMany({});
    console.log('Cleared existing posts');

    // Create new posts
    for (const post of blogPosts) {
      const slug = slugify(post.title, {
        lower: true,
        strict: true,
      });

      await Post.create({
        ...post,
        slug,
        status: 'published',
        userId: '65da8a890f8f1d9f27f8b88a', // Replace with actual user ID
      });
      console.log(`Created post: ${post.title}`);
    }

    console.log('Successfully created all posts');
    process.exit(0);
  } catch (error) {
    console.error('Error creating posts:', error);
    process.exit(1);
  }
}

createPosts(); 