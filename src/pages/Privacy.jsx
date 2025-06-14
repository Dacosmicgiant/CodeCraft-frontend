import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Eye, 
  Lock, 
  Users, 
  Mail, 
  Calendar,
  ChevronRight,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { COLORS } from '../constants/colors';

const PrivacyPage = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: Shield },
    { id: 'collection', title: 'Information We Collect', icon: Eye },
    { id: 'usage', title: 'How We Use Information', icon: Users },
    { id: 'sharing', title: 'Information Sharing', icon: Mail },
    { id: 'security', title: 'Data Security', icon: Lock },
    { id: 'rights', title: 'Your Rights', icon: CheckCircle },
    { id: 'contact', title: 'Contact Us', icon: Mail }
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
              <Shield className={`${COLORS.text.primary}`} size={32} />
            </div>
            <h1 className={`text-4xl font-bold ${COLORS.text.dark} mb-4`}>Privacy Policy</h1>
            <p className={`text-lg ${COLORS.text.secondary} max-w-2xl mx-auto mb-4`}>
              We respect your privacy and are committed to protecting your personal information. 
              This policy explains how we collect, use, and safeguard your data.
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
              
              {/* Overview Section */}
              <section id="overview" className="p-8 border-b border-gray-100">
                <h2 className={`text-2xl font-bold ${COLORS.text.dark} mb-4`}>Overview</h2>
                <div className="prose prose-gray max-w-none">
                  <p className={`${COLORS.text.secondary} leading-relaxed mb-4`}>
                    At CodeCraft, we believe privacy is a fundamental right. This Privacy Policy describes how we collect, 
                    use, and protect your personal information when you use our educational platform and services.
                  </p>
                  <p className={`${COLORS.text.secondary} leading-relaxed mb-4`}>
                    By using CodeCraft, you agree to the collection and use of information in accordance with this policy. 
                    We will not use or share your information with anyone except as described in this Privacy Policy.
                  </p>
                  
                  <div className={`${COLORS.status.info.bg} rounded-lg p-4 mt-6`}>
                    <h4 className={`font-semibold ${COLORS.status.info.text} mb-2`}>Key Principles</h4>
                    <ul className={`${COLORS.status.info.text} space-y-1 text-sm`}>
                      <li>• We only collect information necessary to provide our services</li>
                      <li>• We never sell your personal information to third parties</li>
                      <li>• You have control over your data and can request deletion at any time</li>
                      <li>• We use industry-standard security measures to protect your information</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Information Collection */}
              <section id="collection" className="p-8 border-b border-gray-100">
                <h2 className={`text-2xl font-bold ${COLORS.text.dark} mb-6`}>Information We Collect</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-semibold ${COLORS.text.dark} mb-3`}>Personal Information</h3>
                    <p className={`${COLORS.text.secondary} mb-3`}>
                      When you create an account, we collect:
                    </p>
                    <ul className={`${COLORS.text.secondary} space-y-1 ml-4`}>
                      <li>• Email address (required for account creation)</li>
                      <li>• Username (chosen by you)</li>
                      <li>• Profile information (optional)</li>
                      <li>• Learning preferences and progress data</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold ${COLORS.text.dark} mb-3`}>Usage Information</h3>
                    <p className={`${COLORS.text.secondary} mb-3`}>
                      We automatically collect certain information about how you use our platform:
                    </p>
                    <ul className={`${COLORS.text.secondary} space-y-1 ml-4`}>
                      <li>• Tutorial completion and progress tracking</li>
                      <li>• Time spent on different sections</li>
                      <li>• Search queries and browsing patterns</li>
                      <li>• Device and browser information</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold ${COLORS.text.dark} mb-3`}>Cookies and Tracking</h3>
                    <p className={`${COLORS.text.secondary}`}>
                      We use cookies and similar technologies to enhance your experience, remember your preferences, 
                      and analyze how our platform is used. You can control cookie settings through your browser.
                    </p>
                  </div>
                </div>
              </section>

              {/* How We Use Information */}
              <section id="usage" className="p-8 border-b border-gray-100">
                <h2 className={`text-2xl font-bold ${COLORS.text.dark} mb-6`}>How We Use Your Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className={`${COLORS.background.primaryLight} rounded-lg p-4`}>
                    <h3 className={`font-semibold ${COLORS.text.primary} mb-2`}>Platform Services</h3>
                    <ul className={`${COLORS.text.secondary} text-sm space-y-1`}>
                      <li>• Provide access to tutorials and courses</li>
                      <li>• Track your learning progress</li>
                      <li>• Personalize content recommendations</li>
                      <li>• Send important account notifications</li>
                    </ul>
                  </div>
                  
                  <div className={`${COLORS.background.secondaryInfo || COLORS.background.tertiary} rounded-lg p-4`}>
                    <h3 className={`font-semibold ${COLORS.text.dark} mb-2`}>Platform Improvement</h3>
                    <ul className={`${COLORS.text.secondary} text-sm space-y-1`}>
                      <li>• Analyze usage patterns to improve features</li>
                      <li>• Develop new educational content</li>
                      <li>• Enhance platform performance and security</li>
                      <li>• Conduct research on learning effectiveness</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Information Sharing */}
              <section id="sharing" className="p-8 border-b border-gray-100">
                <h2 className={`text-2xl font-bold ${COLORS.text.dark} mb-6`}>Information Sharing</h2>
                
                <div className={`${COLORS.status.success.bg} rounded-lg p-4 mb-6`}>
                  <h3 className={`font-semibold ${COLORS.status.success.text} mb-2`}>We DO NOT sell your personal information</h3>
                  <p className={`${COLORS.status.success.text} text-sm`}>
                    CodeCraft will never sell, rent, or trade your personal information to third parties for marketing purposes.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className={`font-semibold ${COLORS.text.dark} mb-2`}>When We May Share Information:</h3>
                    <ul className={`${COLORS.text.secondary} space-y-2`}>
                      <li>• <strong>Service Providers:</strong> With trusted partners who help us operate our platform (hosting, analytics, email services)</li>
                      <li>• <strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                      <li>• <strong>Business Transfers:</strong> In the event of a merger or acquisition (with notification to users)</li>
                      <li>• <strong>With Your Consent:</strong> Any other sharing will be done only with your explicit permission</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Data Security */}
              <section id="security" className="p-8 border-b border-gray-100">
                <h2 className={`text-2xl font-bold ${COLORS.text.dark} mb-6`}>Data Security</h2>
                
                <p className={`${COLORS.text.secondary} mb-6`}>
                  We implement appropriate security measures to protect your personal information against unauthorized 
                  access, alteration, disclosure, or destruction.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4">
                    <div className={`w-12 h-12 ${COLORS.background.primaryLight} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <Lock className={`${COLORS.text.primary}`} size={24} />
                    </div>
                    <h3 className={`font-semibold ${COLORS.text.dark} mb-2 text-sm`}>Encryption</h3>
                    <p className={`${COLORS.text.tertiary} text-xs`}>All data is encrypted in transit and at rest</p>
                  </div>
                  
                  <div className="text-center p-4">
                    <div className={`w-12 h-12 ${COLORS.background.primaryLight} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <Shield className={`${COLORS.text.primary}`} size={24} />
                    </div>
                    <h3 className={`font-semibold ${COLORS.text.dark} mb-2 text-sm`}>Access Control</h3>
                    <p className={`${COLORS.text.tertiary} text-xs`}>Limited access on a need-to-know basis</p>
                  </div>
                  
                  <div className="text-center p-4">
                    <div className={`w-12 h-12 ${COLORS.background.primaryLight} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <Eye className={`${COLORS.text.primary}`} size={24} />
                    </div>
                    <h3 className={`font-semibold ${COLORS.text.dark} mb-2 text-sm`}>Monitoring</h3>
                    <p className={`${COLORS.text.tertiary} text-xs`}>Regular security audits and monitoring</p>
                  </div>
                </div>
              </section>

              {/* Your Rights */}
              <section id="rights" className="p-8 border-b border-gray-100">
                <h2 className={`text-2xl font-bold ${COLORS.text.dark} mb-6`}>Your Rights</h2>
                
                <div className="space-y-4">
                  <p className={`${COLORS.text.secondary} mb-6`}>
                    You have the following rights regarding your personal information:
                  </p>

                  <div className="space-y-4">
                    {[
                      { title: 'Access', desc: 'Request a copy of all personal information we have about you' },
                      { title: 'Correction', desc: 'Request correction of inaccurate or incomplete information' },
                      { title: 'Deletion', desc: 'Request deletion of your personal information and account' },
                      { title: 'Portability', desc: 'Request a machine-readable copy of your data' },
                      { title: 'Objection', desc: 'Object to certain types of data processing' },
                      { title: 'Restriction', desc: 'Request limitation of how we process your information' }
                    ].map((right, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className={`${COLORS.text.primary} mt-1 flex-shrink-0`} size={18} />
                        <div>
                          <h3 className={`font-semibold ${COLORS.text.dark} text-sm`}>{right.title}</h3>
                          <p className={`${COLORS.text.secondary} text-sm`}>{right.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={`${COLORS.status.info.bg} rounded-lg p-4 mt-6`}>
                    <p className={`${COLORS.status.info.text} text-sm`}>
                      To exercise any of these rights, please contact us at{' '}
                      <a href="mailto:privacy@codecraft.com" className="underline">privacy@codecraft.com</a>.
                      We will respond to your request within 30 days.
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section id="contact" className="p-8">
                <h2 className={`text-2xl font-bold ${COLORS.text.dark} mb-6`}>Contact Us</h2>
                
                <div className="space-y-6">
                  <p className={`${COLORS.text.secondary}`}>
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className={`font-semibold ${COLORS.text.dark} mb-3`}>General Privacy Questions</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className={`${COLORS.text.tertiary}`} size={16} />
                          <a href="mailto:privacy@codecraft.com" className={`${COLORS.text.primary} hover:${COLORS.text.primaryHover}`}>
                            privacy@codecraft.com
                          </a>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className={`font-semibold ${COLORS.text.dark} mb-3`}>Data Protection Officer</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className={`${COLORS.text.tertiary}`} size={16} />
                          <a href="mailto:dpo@codecraft.com" className={`${COLORS.text.primary} hover:${COLORS.text.primaryHover}`}>
                            dpo@codecraft.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${COLORS.background.primaryLight} rounded-lg p-4`}>
                    <p className={`${COLORS.text.primary} text-sm`}>
                      <strong>Changes to This Policy:</strong> We may update this Privacy Policy from time to time. 
                      We will notify you of any changes by posting the new Privacy Policy on this page and updating 
                      the "Last updated" date.
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

export default PrivacyPage;