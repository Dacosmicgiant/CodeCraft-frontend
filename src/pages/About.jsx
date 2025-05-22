// src/pages/About.jsx
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, Target, Award } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link 
        to="/" 
        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6"
      >
        <ArrowLeft size={18} className="mr-1" />
        Back to Home
      </Link>

      <div className="prose max-w-none">
        <h1 className="text-3xl font-bold mb-6">About CodeCraft</h1>
        
        <p className="text-lg text-gray-600 mb-8">
          CodeCraft is your gateway to learning programming and web development through 
          interactive tutorials and hands-on examples.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg border">
            <BookOpen className="text-emerald-600 mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">Learn by Doing</h3>
            <p className="text-gray-600">
              Our interactive tutorials let you practice coding concepts immediately with 
              real examples and exercises.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <Users className="text-emerald-600 mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
            <p className="text-gray-600">
              Join thousands of learners in our community, share your progress, and 
              learn from others.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <Target className="text-emerald-600 mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">Focused Learning</h3>
            <p className="text-gray-600">
              Structured courses that take you from beginner to advanced, with clear 
              learning paths and objectives.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <Award className="text-emerald-600 mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Monitor your learning journey with progress tracking, bookmarks, and 
              personalized recommendations.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-gray-700 mb-6">
          We believe that everyone should have access to quality programming education. 
          Our mission is to make learning to code accessible, engaging, and effective 
          for learners of all backgrounds and skill levels.
        </p>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-emerald-800 mb-2">Ready to Start Learning?</h3>
          <p className="text-emerald-700 mb-4">
            Join thousands of students who are already learning to code with CodeCraft.
          </p>
          <Link 
            to="/tutorials"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Browse Tutorials
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

