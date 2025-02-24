import React from 'react';
import Layout from '@/components/Layout';
import Image from 'next/image';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import { SiX } from 'react-icons/si';

export default function AboutPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">About Me</h1>
          <p className="text-xl text-gray-600">
            Welcome to my corner of the internet
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative w-64 h-64 rounded-full overflow-hidden mx-auto mb-8">
            <Image
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              alt="Profile picture"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Hi, I'm Ankur Dixit
            </h2>
            
            <p className="text-gray-600">
              As a dedicated developer, I am passionate about problem-solving and committed to excellence. 
              I bring strong analytical skills and a proactive approach to staying current with industry advancements, 
              readily adapting to any language or technology.
            </p>

            <p className="text-gray-600">
              When I'm not writing code, you can find me exploring new technologies,
              reading books, or enjoying outdoor activities.
            </p>

            <div className="pt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Connect With Me
              </h3>
              <div className="flex space-x-6">
                <a
                  href="https://github.com/Ankurdixitofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                  <FiGithub className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com/in/ankurdixitofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                  <FiLinkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://twitter.com/devankurdixit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                  <SiX className="w-4 h-4" />
                  <span></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 