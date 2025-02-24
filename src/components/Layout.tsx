'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

interface CursorPosition {
  x: number;
  y: number;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [followerPosition, setFollowerPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSignOut = async () => {
    setShowProfileMenu(false);
    await signOut({ redirect: false });
    router.push('/');
  };

  useEffect(() => {
    const cursor = document.getElementById('cursor');
    
    const updateCursor = (e: MouseEvent) => {
      if (cursor) {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      }
    };

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener('mousemove', updateCursor);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white cursor-none relative">
      <nav className="bg-[#1a1a1a] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-12">
              <Link href="/" className="text-2xl font-bold text-white hover:text-white/90">
                PythoGraphy
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link 
                  href="/" 
                  className={`text-white/90 hover:text-white text-sm font-medium ${
                    pathname === '/' ? 'text-white' : 'text-white/90'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  href="/blog" 
                  className={`text-white/90 hover:text-white text-sm font-medium ${
                    pathname === '/blog' ? 'text-white' : 'text-white/90'
                  }`}
                >
                  Articles
                </Link>
                <Link 
                  href="/about" 
                  className={`text-white/90 hover:text-white text-sm font-medium ${
                    pathname === '/about' ? 'text-white' : 'text-white/90'
                  }`}
                >
                  About
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {status === 'authenticated' && (
                <Link
                  href="/admin/compose"
                  className="bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
                >
                  Compose
                </Link>
              )}
              
              {session?.user?.role === 'admin' && (
                <Link 
                  href="/admin" 
                  className={`text-white/90 hover:text-white text-sm font-medium ${
                    pathname === '/admin' ? 'text-white' : 'text-white/90'
                  }`}
                >
                  Admin
                </Link>
              )}

              {status === 'authenticated' ? (
                <div className="flex items-center space-x-4 relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 text-white/90 hover:text-white text-sm font-medium focus:outline-none"
                  >
                    <span>{session.user?.name}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 top-full mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1">
                      <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
                        <p className="font-medium mb-1">Signed in as</p>
                        <p className="truncate">{session.user?.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Your Profile
                      </Link>
                      <Link
                        href="/profile/edit"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Edit Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t border-gray-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/auth/signin" className="text-white/90 hover:text-white text-sm font-medium">
                    Log in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="min-h-screen py-20 px-4">{children}</main>

      <footer className="bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Popular tags</h3>
              <ul className="space-y-2">
                <li><Link href="/blog?tag=design" className="text-white/70 hover:text-white">Design</Link></li>
                <li><Link href="/blog?tag=development" className="text-white/70 hover:text-white">Development</Link></li>
                <li><Link href="/blog?tag=tutorials" className="text-white/70 hover:text-white">Tutorials</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                <li><Link href="/blog?category=ui" className="text-white/70 hover:text-white">UI Design</Link></li>
                <li><Link href="/blog?category=ux" className="text-white/70 hover:text-white">UX Design</Link></li>
                <li><Link href="/blog?category=web" className="text-white/70 hover:text-white">Web Development</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/resources" className="text-white/70 hover:text-white">Design Resources</Link></li>
                <li><Link href="/tools" className="text-white/70 hover:text-white">Tools</Link></li>
                <li><Link href="/guides" className="text-white/70 hover:text-white">Guides</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-white/70 mb-4">Get the latest articles and resources straight to your inbox.</p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-white/10 rounded-l-full text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button
                  type="submit"
                  className="bg-white text-[#1a1a1a] px-6 py-2 rounded-r-full font-medium hover:bg-white/90 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/70 mb-4 md:mb-0">© {new Date().getFullYear()} PythoGraphy. All rights reserved.</p>
              <div className="flex space-x-6">
                <a href="#" className="text-white/70 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-white/70 hover:text-white">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div 
        id="cursor"
        className="fixed w-4 h-4 bg-black rounded-full pointer-events-none z-50 -ml-2 -mt-2"
      />

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-opacity duration-300 ${
          showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </div>
  );
};

export default Layout; 