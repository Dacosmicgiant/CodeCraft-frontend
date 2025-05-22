

// src/pages/Privacy.jsx
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPage = () => {
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
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
        <p className="mb-4">
          When you use CodeCraft, we collect information you provide directly to us, such as:
        </p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>Account information (username, email address)</li>
          <li>Profile information</li>
          <li>Learning progress and preferences</li>
          <li>Communications with us</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
        <p className="mb-4">We use the information we collect to:</p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>Provide and improve our services</li>
          <li>Track your learning progress</li>
          <li>Send you updates and notifications</li>
          <li>Respond to your questions and support requests</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">Data Security</h2>
        <p className="mb-6">
          We implement appropriate security measures to protect your personal information 
          against unauthorized access, alteration, disclosure, or destruction.
        </p>

        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p className="mb-4">
          Email: <a href="mailto:privacy@codecraft.com" className="text-emerald-600 hover:underline">privacy@codecraft.com</a>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;