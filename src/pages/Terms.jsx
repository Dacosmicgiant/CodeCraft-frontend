// src/pages/Terms.jsx
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsPage = () => {
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
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <h2 className="text-2xl font-bold mb-4">Acceptance of Terms</h2>
        <p className="mb-6">
          By accessing and using CodeCraft, you accept and agree to be bound by the terms 
          and provision of this agreement.
        </p>

        <h2 className="text-2xl font-bold mb-4">Use License</h2>
        <p className="mb-4">
          Permission is granted to temporarily download one copy of the materials on 
          CodeCraft for personal, non-commercial transitory viewing only.
        </p>
        <p className="mb-6">This license shall automatically terminate if you violate any of these restrictions.</p>

        <h2 className="text-2xl font-bold mb-4">User Accounts</h2>
        <p className="mb-4">When you create an account with us, you must provide information that is accurate and complete. You are responsible for:</p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>Safeguarding your password</li>
          <li>All activities that occur under your account</li>
          <li>Notifying us of any unauthorized use</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">Prohibited Uses</h2>
        <p className="mb-4">You may not use our service:</p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>For any unlawful purpose</li>
          <li>To transmit harmful or malicious code</li>
          <li>To violate any international, federal, provincial, or state regulations or laws</li>
          <li>To harass, abuse, or harm another person</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
        <p className="mb-4">
          If you have any questions about these Terms of Service, please contact us at:
        </p>
        <p className="mb-4">
          Email: <a href="mailto:legal@codecraft.com" className="text-emerald-600 hover:underline">legal@codecraft.com</a>
        </p>
      </div>
    </div>
  );
};

export default TermsPage;