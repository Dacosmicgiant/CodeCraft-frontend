import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Code, 
  Users, 
  Target, 
  Award, 
  Heart, 
  ArrowRight,
  CheckCircle,
  Star,
  Quote
} from 'lucide-react';
import { COLORS } from '../constants/colors';

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('mission');

  const stats = [
    { label: 'Students Taught', value: '10,000+', icon: Users },
    { label: 'Tutorials Created', value: '500+', icon: BookOpen },
    { label: 'Programming Languages', value: '15+', icon: Code },
    { label: 'Success Stories', value: '2,500+', icon: Award }
  ];

  const features = [
    {
      title: 'Interactive Learning',
      description: 'Learn by doing with hands-on coding exercises and real-time feedback.',
      icon: Code
    },
    {
      title: 'Structured Curriculum',
      description: 'Follow carefully designed learning paths that build skills progressively.',
      icon: Target
    },
    {
      title: 'Expert Guidance',
      description: 'Learn from industry professionals with years of real-world experience.',
      icon: Award
    },
    {
      title: 'Community Support',
      description: 'Join a supportive community of learners and mentors ready to help.',
      icon: Users
    }
  ];

  const team = [
    {
      name: 'Shubhali',
      role: 'Founder & Lead Instructor',
      bio: 'Passionate educator with 8+ years of experience in software development and teaching.',
      image: '/api/placeholder/120/120'
    }
  ];

  const milestones = [
    { year: '2020', title: 'CodeCraft Founded', description: 'Started with a vision to make coding education accessible to everyone' },
    { year: '2021', title: 'First 1,000 Students', description: 'Reached our first major milestone of serving 1,000 learners' },
    { year: '2022', title: 'Mobile Platform Launch', description: 'Expanded access with our mobile-friendly learning platform' },
    { year: '2023', title: 'Industry Partnerships', description: 'Formed partnerships with leading tech companies for career placement' },
    { year: '2024', title: '10,000+ Graduates', description: 'Celebrated helping over 10,000 students launch their tech careers' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`${COLORS.background.primary} text-white py-20`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Empowering the Next Generation of Developers
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              At CodeCraft, we believe everyone deserves access to quality programming education. 
              We're dedicated to making coding skills accessible, engaging, and practical for learners worldwide.
            </p>
            <Link 
              to="/tutorials"
              className={`inline-flex items-center gap-2 px-8 py-3 ${COLORS.background.white} ${COLORS.text.primary} font-semibold rounded-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1`}
            >
              Start Learning Today <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 ${COLORS.background.white}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 ${COLORS.background.primaryLight} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className={`${COLORS.text.primary}`} size={32} />
                </div>
                <div className={`text-3xl font-bold ${COLORS.text.dark} mb-2`}>{stat.value}</div>
                <div className={`${COLORS.text.secondary} text-sm`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values Tabs */}
      <section className={`py-16 ${COLORS.background.secondary}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${COLORS.text.dark} mb-4`}>Our Foundation</h2>
            <p className={`text-lg ${COLORS.text.secondary} max-w-2xl mx-auto`}>
              Everything we do is guided by our core principles and commitment to excellence
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className={`${COLORS.background.white} p-1 rounded-lg inline-flex`}>
              {[
                { id: 'mission', label: 'Mission' },
                { id: 'vision', label: 'Vision' },
                { id: 'values', label: 'Values' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    activeTab === tab.id 
                      ? `${COLORS.background.primary} ${COLORS.text.white}` 
                      : `${COLORS.text.secondary} hover:${COLORS.text.dark}`
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className={`${COLORS.background.white} rounded-xl p-8 max-w-4xl mx-auto`}>
            {activeTab === 'mission' && (
              <div className="text-center">
                <Target className={`${COLORS.text.primary} mx-auto mb-6`} size={48} />
                <h3 className={`text-2xl font-bold ${COLORS.text.dark} mb-4`}>Our Mission</h3>
                <p className={`text-lg ${COLORS.text.secondary} leading-relaxed`}>
                  To democratize programming education by providing high-quality, interactive learning experiences 
                  that empower individuals to build technical skills, pursue meaningful careers, and contribute 
                  to technological innovation worldwide.
                </p>
              </div>
            )}

            {activeTab === 'vision' && (
              <div className="text-center">
                <Star className={`${COLORS.text.primary} mx-auto mb-6`} size={48} />
                <h3 className={`text-2xl font-bold ${COLORS.text.dark} mb-4`}>Our Vision</h3>
                <p className={`text-lg ${COLORS.text.secondary} leading-relaxed`}>
                  To become the world's leading platform for practical programming education, where learners 
                  from all backgrounds can master coding skills through engaging, hands-on experiences that 
                  prepare them for successful careers in technology.
                </p>
              </div>
            )}

            {activeTab === 'values' && (
              <div>
                <Heart className={`${COLORS.text.primary} mx-auto mb-6`} size={48} />
                <h3 className={`text-2xl font-bold ${COLORS.text.dark} mb-6 text-center`}>Our Values</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { title: 'Accessibility', desc: 'Making quality education available to everyone, regardless of background or experience level' },
                    { title: 'Excellence', desc: 'Maintaining the highest standards in content quality, user experience, and learning outcomes' },
                    { title: 'Community', desc: 'Fostering a supportive environment where learners help each other succeed' },
                    { title: 'Innovation', desc: 'Continuously improving our teaching methods and embracing new technologies' }
                  ].map((value, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className={`${COLORS.text.primary} flex-shrink-0 mt-1`} size={20} />
                      <div>
                        <h4 className={`font-semibold ${COLORS.text.dark} mb-1`}>{value.title}</h4>
                        <p className={`${COLORS.text.secondary} text-sm`}>{value.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-16 ${COLORS.background.white}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${COLORS.text.dark} mb-4`}>Why Choose CodeCraft</h2>
            <p className={`text-lg ${COLORS.text.secondary} max-w-2xl mx-auto`}>
              We've designed our platform with learners in mind, focusing on practical skills and real-world application
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 ${COLORS.background.primaryLight} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <feature.icon className={`${COLORS.text.primary}`} size={28} />
                </div>
                <h3 className={`text-lg font-semibold ${COLORS.text.dark} mb-2`}>{feature.title}</h3>
                <p className={`${COLORS.text.secondary} text-sm leading-relaxed`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className={`py-16 ${COLORS.background.secondary}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${COLORS.text.dark} mb-4`}>Our Journey</h2>
            <p className={`text-lg ${COLORS.text.secondary} max-w-2xl mx-auto`}>
              From a simple idea to a thriving learning community
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className={`absolute left-8 top-0 bottom-0 w-0.5 ${COLORS.background.primary} hidden md:block`}></div>
            
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex items-start gap-6">
                  {/* Timeline dot */}
                  <div className={`w-16 h-16 ${COLORS.background.primary} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 relative z-10`}>
                    {milestone.year}
                  </div>
                  
                  {/* Content */}
                  <div className={`${COLORS.background.white} rounded-lg p-6 flex-1 shadow-sm`}>
                    <h3 className={`text-lg font-semibold ${COLORS.text.dark} mb-2`}>{milestone.title}</h3>
                    <p className={`${COLORS.text.secondary}`}>{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={`py-16 ${COLORS.background.white}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${COLORS.text.dark} mb-4`}>Meet Our Team</h2>
            <p className={`text-lg ${COLORS.text.secondary} max-w-2xl mx-auto`}>
              Dedicated educators and developers committed to your learning success
            </p>
          </div>

          <div className="flex justify-center">
            {team.map((member, index) => (
              <div key={index} className="text-center max-w-sm">
                <div className={`w-32 h-32 ${COLORS.background.primaryLight} rounded-full mx-auto mb-6 flex items-center justify-center`}>
                  <span className={`text-4xl font-bold ${COLORS.text.primary}`}>
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className={`text-xl font-semibold ${COLORS.text.dark} mb-2`}>{member.name}</h3>
                <p className={`${COLORS.text.primary} font-medium mb-4`}>{member.role}</p>
                <p className={`${COLORS.text.secondary} leading-relaxed`}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 ${COLORS.background.primary} text-white`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg opacity-90 mb-8">
            Join our community of learners and start building the skills that will shape your future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register"
              className={`px-8 py-3 ${COLORS.background.white} ${COLORS.text.primary} font-semibold rounded-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1`}
            >
              Get Started Free
            </Link>
            <Link 
              to="/tutorials"
              className="px-8 py-3 bg-white bg-opacity-20 text-white font-semibold rounded-lg hover:bg-opacity-30 transition-all duration-200 border border-white border-opacity-30"
            >
              Explore Tutorials
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;