import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Scale, 
  Users, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  ArrowLeft,
  Mail,
  Calendar
} from 'lucide-react';
import { COLORS } from '../constants/colors';

const TermsPage = () => {
  const [activeSection, setActiveSection] = useState('agreement');

  const sections = [
    { id: 'agreement', title: 'Agreement to Terms', icon: FileText },
    { id: 'services', title: 'Use of Services', icon: Users },
    { id: 'accounts', title: 'User Accounts', icon: Shield },
    { id: 'content', title: 'Content & Conduct', icon: Scale },
    { id: 'intellectual', title: 'Intellectual Property', icon: FileText },
    { id: 'privacy', title: 'Privacy & Data', icon: Shield },
    { id: 'disclaimers', title: 'Disclaimers', icon: AlertTriangle },
    { id: 'termination', title: 'Termination', icon: Users },
    { id: 'contact', title: 'Contact Information', icon: Mail }
  ];

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen ${COLORS.background.secondary}`}>
      {/* Header */}
      <div className={`${COLORS.background.white} py-8 px-4 sm:px-6 lg:px-8 shadow-sm`}>
        <div className="max-w-6xl mx-auto">
          <Link 
            to="/"
            className={`inline-flex items-center gap-2 ${COLORS.text.secondary} hover:${COLORS.text.primary} transition-colors mb-6`}
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 ${COLORS.background.primaryLight} rounded-xl mb-6`}>
              <Scale className={`${COLORS.text.primary}`} size={32} />
            </div>
            <h1 className={`text-4xl font-bold ${COLORS.text.dark} mb-4`}>Terms of Service</h1>
            <p className={`text-lg ${COLORS.text.secondary} max-w-2xl mx-auto mb-4`}>
              These terms govern your use of CodeCraft and outline the rights and responsibilities 
              for both users and our platform.
            </p>
            <p className={`text-sm ${COLORS.text.tertiary}`}>
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className={`${COLORS.background.white} rounded-xl p-6 shadow-sm sticky top-8`}>
              <h3 className={`font-semibold ${COLORS.text.dark} mb-4`}>Table of Contents</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                      activeSection === section.id
                        ? `${COLORS.background.primaryLight} ${COLORS.text.primary}`
                        : `hover:${COLORS.background.tertiary} ${COLORS.text.secondary}`
                    }`}
                  >
                    <section.icon size={18} />
                    <span className="text-sm">{section.title}</span>
                    <ChevronRight size={14} className="ml-auto" />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className={`${COLORS.background.white} rounded-xl shadow-sm`}>
              
              {/* Introduction */}
              <div className="p-8 border-b border-gray-100">
                <div className={`${COLORS.status.info.bg} rounded-lg p-4 mb-6`}>
                  <h4 className={`font-semibold ${COLORS.status.info.text} mb-2`}>Important Notice</h4>
                  <p className={`${COLORS.status.info.text} text-sm`}>
                    By accessing and using CodeCraft, you accept and agree to be bound by the terms and provision of this agreement.
                    Please read these terms carefully before using our services.
                  </p>
                </div>
              </div>

              {/* Agreement to Terms */}
              <section id="agreement" className="p-8 border-b border-gray-100">
                <h2 className={`text-2xl font-bold ${COLORS.text.dark} mb-6`}>Agreement to Terms</h2>
                
                <div className="prose prose-gray max-w-none space-y-4">
                  <p className={`${COLORS.text.secondary} leading-relaxed`}>
                    These Terms of Service ("Terms") govern your use of CodeCraft's website and educational platform 
                    (the "Service") operated by CodeCraft ("us", "we", or "our").
                  </p>
                  
                  <p className={`${COLORS.text.secondary} leading-relaxed`}>
                    By accessing or using our Service, you agree to be bound by these Terms. If you disagree with 
                    any part of these terms, then you may not access the Service.
                  </p>

                  <div className={`${COLORS.background.primaryLight} rounded-lg p-4`}>
                    <h4 className={`font-semibold ${COLORS.text.primary} mb-2`}>Key Points:</h4>
                    <ul className={`${COLORS.text.primary} space-y-1 text-sm ml-4`}>
                      <li>• You must be at least 13 years old to use our service</li>
                      <li>• You are responsible for maintaining account security</li>
                      <li>• Commercial use requires our written permission</li>
                      <li>• We reserve the right to modify these terms</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Use of Services */}
              <section id="services" className="p-8 border-b border-gray-100">
                <h2 className={`text-2xl font-bold ${COLORS.text.dark} mb-6`}>Use of Services</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-semibold ${COLORS.text.dark} mb-3`}>Permitted Use</h3>
                    <p className={`${COLORS.text.secondary} mb-3`}>
                      You may use CodeCraft for personal, educational, and non-commercial purposes, including:
                    </p>
                    <ul className={`${COLORS.text.secondary} space-y-1 ml-4`}>
                      <li>• Learning programming concepts and skills</li>
                      <li>• Accessing tutorials and educational content</li>
                      <li>• Participating in community discussions</li>
                      <li>• Tracking your learning progress</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold ${COLORS.text.dark} mb-3`}>Prohibited Activities</h3>
                    <p className={`${COLORS.text.secondary} mb-3`}>
                      You agree not to engage in any of the following prohibited activities:
                    </p>
                    <ul className={`${COLORS.text.secondary} space-y-1 ml-4`}>
                      <li>• Violating laws or regulations</li>
                      <li>• Sharing inappropriate or harmful content</li>
                      <li>• Attempting to gain unauthorized access</li>
                      <li>• Interfering with service operations</li>
                      <li>• Commercial use without permission</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* User Accounts */}
              <section id="accounts" className="p-8 border-b border-gray-100">
                <h2 className={`text-2xl font-bold ${COLORS.text.dark} mb-6`}>User Accounts</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className={`font-semibold ${COLORS.text.dark} mb-2`}>Account Creation</h3>
                    <p className={`${COLORS.text.secondary}`}>
                      To access certain features, you may need to create an account. You must provide accurate, 
                      current, and complete information and keep your account information updated.
                    </p>
                  </div>

                  <div>
                    <h3 className={`font-semibold ${COLORS.text.dark} mb-2`}>Account Security</h3>
                    <p className={`${COLORS.text.secondary} mb-2`}>
                      You are responsible for safeguarding your account credentials and for all activities 
                      that occur under your account.
                    </p>
                    
                    <div className={`${COLORS.status.warning.bg} rounded-lg p-3`}>
                      <p className={`${COLORS.status.warning.text} text-sm`}>
                        <strong>Security Notice:</strong> Never share your password with others. 
                        Contact us immediately if you suspect unauthorized account access.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className={`font-semibold ${COLORS.text.dark} mb-2`}>Account Termination</h3>
                    <p className={`${COLORS.text.secondary}`}>
                      You may terminate your account at any time. We reserve the right to suspend or 
                      terminate accounts that violate these terms.
                    </p>
                  </div>
                </div>
              </section>

              {/* Content & Conduct */}
              <section id="content" className="p-8 border-b border-gray-100">
                <h2 className={`text-2xl font-bold ${COLORS.text.dark} mb-6`}>Content & Conduct</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className={`font-semibold ${COLORS.text.dark} mb-2`}>User-Generated Content</h3>
                    <p className={`${COLORS.text.secondary} mb-2`}>
                      You may submit comments, questions, or other content. You retain ownership of your content 
                      but grant us a license to use, display, and distribute it.
                    </p>
                  </div>

                  <div>
                    <h3 className={`font-semibold ${COLORS.text.dark} mb-2`}>Content Standards</h3>
                    <p className={`${COLORS.text.secondary} mb-2`}>All content must be:</p>
                    <ul className={`${COLORS.text.secondary} space-y-1 ml-4`}>
                      <li>• Respectful and appropriate</li>
                      <li>• Accurate and not misleading</li>
                      <li>• Free of spam or promotional material</li>
                      <li>• Compliant with applicable laws</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`font-semibold ${COLORS.text.dark} mb-2`}>Content Moderation</h3>
                    <p className={`${COLORS.text.secondary}`}>
                      We reserve the right to review, edit, or remove any content that violates these 
                      terms or our community guidelines.
                    </p>
                  </div>
                </div>
              </section>

              {/* Intellectual Property */}
              <section id="intellectual" className="p-8 border-b border-gray-100">
                <h2 className={`text-2xl font-bold ${COLORS.text.dark} mb-6`}>Intellectual Property</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className={`font-semibold ${COLORS.text.dark} mb-2`}>Our Content</h3>
                    <p className={`${COLORS.text.secondary}`}>
                      All tutorials, course materials, and platform content are owned by CodeCraft or our 
                      licensors and are protected by copyright and other intellectual property laws.
                    </p>
                  </div>

                  <div>
                    <h3 className={`font-semibold ${COLORS.text.dark} mb-2`}>License to Use</h3>
                    <p className={`${COLORS.text.secondary}`}>
                      We grant you a personal, non-commercial, non-transferable license to access and use 
                      our educational content for learning purposes.
                    </p>
                  </div>

                  <div>
                    <h3 className={`font-semibold ${COLORS.text.dark} mb-2`}>Copyright Infringement</h3>
                    <p className={`${COLORS.text.secondary}`}>
                      If you believe your intellectual property rights have been violated, please contact us 
                      with detailed information about the alleged infringement.
                    </p>
                  </div>
                </div>
              </section>

              {/* Privacy & Data */}
              <section id="privacy" className="p-8 border-b border-gray-100">
                <h2 className={`text-2xl font-bold ${COLORS.text.dark} mb-6`}>Privacy & Data</h2>
                
                <div className="space-y-4">
                  <p className={`${COLORS.text.secondary}`}>
                    Your privacy is important to us. Our collection and use of personal information is 
                    governed by our Privacy Policy, which is incorporated into these Terms by reference.
                  </p>

                  <div className={`${COLORS.background.primaryLight} rounded-lg p-4`}>
                    <h4 className={`font-semibold ${COLORS.text.primary} mb-2`}>Data Practices</h4>
                    <ul className={`${COLORS.text.primary} space-y-1 text-sm ml-4`}>
                      <li>• We collect minimal necessary information</li>
                      <li>• We never sell your personal data</li>
                      <li>• You can request data deletion at any time</li>
                      <li>• We use industry-standard security measures</li>
                    </ul>
                  </div>

                  <p className={`${COLORS.text.secondary}`}>
                    For complete details about our data practices, please review our{' '}
                    <Link to="/privacy" className={`${COLORS.text.primary} hover:${COLORS.text.primaryHover} underline`}>
                      Privacy Policy
                    </Link>.
                  </p>
                </div>
              </section>

              {/* Disclaimers */}
              <section id="disclaimers" className="p-8 border-b border-gray-100">
                <h2 className={`text-2xl font-bold ${COLORS.text.dark} mb-6`}>Disclaimers</h2>
                
                <div className={`${COLORS.status.warning.bg} rounded-lg p-4 mb-6`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`${COLORS.status.warning.text} flex-shrink-0 mt-1`} size={20} />
                    <div>
                      <h4 className={`font-semibold ${COLORS.status.warning.text} mb-2`}>Important Disclaimers</h4>
                      <p className={`${COLORS.status.warning.text} text-sm`}>
                        Please read these disclaimers carefully as they limit our liability and explain the 
                        "as-is" nature of our services.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className={`font-semibold ${COLORS.text.dark} mb-2`}>Service Availability</h3>
                    <p className={`${COLORS.text.secondary}`}>
                      We provide our services "as-is" without warranties of any kind. We do not guarantee 
                      uninterrupted access or error-free operation.
                    </p>
                  </div>

                  <div>
                    <h3 className={`font-semibold ${COLORS.text.dark} mb-2`}>Educational Content</h3>
                    <p className={`${COLORS.text.secondary}`}>
                      While we strive for accuracy, we do not warrant that our educational content is 
                      complete, current, or error-free. Learning outcomes may vary.
                    </p>
                  </div>

                  <div>
                    <h3 className={`font-semibold ${COLORS.text.dark} mb-2`}>Limitation of Liability</h3>
                    <p className={`${COLORS.text.secondary}`}>
                      CodeCraft shall not be liable for any indirect, incidental, or consequential damages 
                      arising from your use of our services.
                    </p>
                  </div>
                </div>
              </section>

              {/* Termination */}
              <section id="termination" className="p-8 border-b border-gray-100">
                <h2 className={`text-2xl font-bold ${COLORS.text.dark} mb-6`}>Termination</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className={`font-semibold ${COLORS.text.dark} mb-2`}>By You</h3>
                    <p className={`${COLORS.text.secondary}`}>
                      You may terminate your account and stop using our services at any time by contacting us 
                      or using the account deletion feature.
                    </p>
                  </div>

                  <div>
                    <h3 className={`font-semibold ${COLORS.text.dark} mb-2`}>By Us</h3>
                    <p className={`${COLORS.text.secondary} mb-2`}>
                      We may terminate or suspend your access immediately if you:
                    </p>
                    <ul className={`${COLORS.text.secondary} space-y-1 ml-4`}>
                      <li>• Violate these Terms of Service</li>
                      <li>• Engage in prohibited activities</li>
                      <li>• Compromise platform security</li>
                      <li>• Abuse our services or other users</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`font-semibold ${COLORS.text.dark} mb-2`}>Effect of Termination</h3>
                    <p className={`${COLORS.text.secondary}`}>
                      Upon termination, your right to use the service will cease immediately. Any provisions 
                      that should survive termination will remain in effect.
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section id="contact" className="p-8">
                <h2 className={`text-2xl font-bold ${COLORS.text.dark} mb-6`}>Contact Information</h2>
                
                <div className="space-y-6">
                  <p className={`${COLORS.text.secondary}`}>
                    If you have any questions about these Terms of Service, please contact us:
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className={`font-semibold ${COLORS.text.dark} mb-3`}>Legal Questions</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className={`${COLORS.text.tertiary}`} size={16} />
                          <a href="mailto:legal@codecraft.com" className={`${COLORS.text.primary} hover:${COLORS.text.primaryHover}`}>
                            legal@codecraft.com
                          </a>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className={`font-semibold ${COLORS.text.dark} mb-3`}>General Support</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className={`${COLORS.text.tertiary}`} size={16} />
                          <a href="mailto:support@codecraft.com" className={`${COLORS.text.primary} hover:${COLORS.text.primaryHover}`}>
                            support@codecraft.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${COLORS.background.primaryLight} rounded-lg p-4`}>
                    <div className="flex items-start gap-3">
                      <Calendar className={`${COLORS.text.primary} flex-shrink-0 mt-1`} size={20} />
                      <div>
                        <h4 className={`font-semibold ${COLORS.text.primary} mb-1`}>Changes to These Terms</h4>
                        <p className={`${COLORS.text.primary} text-sm`}>
                          We reserve the right to modify these terms at any time. We will notify users of 
                          significant changes via email or platform notification. Continued use of our services 
                          after changes constitutes acceptance of the new terms.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-6 border-t border-gray-100">
                    <p className={`text-sm ${COLORS.text.tertiary}`}>
                      These Terms of Service are effective as of{' '}
                      {new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;