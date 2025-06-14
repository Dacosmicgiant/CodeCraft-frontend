import { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  MapPin, 
  Phone, 
  Clock,
  CheckCircle,
  AlertCircle,
  Loader,
  User,
  HelpCircle,
  Book,
  Users
} from 'lucide-react';
import { COLORS } from '../constants/colors';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'general', label: 'General Inquiry', icon: HelpCircle },
    { value: 'technical', label: 'Technical Support', icon: Book },
    { value: 'partnership', label: 'Partnership', icon: Users },
    { value: 'feedback', label: 'Feedback', icon: MessageSquare }
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'hello@codecraft.com',
      subtitle: 'We respond within 24 hours'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      details: 'Available 9 AM - 6 PM EST',
      subtitle: 'Monday through Friday'
    },
    {
      icon: MapPin,
      title: 'Location',
      details: 'Remote-First Company',
      subtitle: 'Serving students globally'
    }
  ];

  const faqs = [
    {
      question: 'How do I get started with CodeCraft?',
      answer: 'Simply create a free account and explore our beginner-friendly tutorials. No prior experience required!'
    },
    {
      question: 'Are the tutorials really free?',
      answer: 'Yes! All our core tutorials are completely free. We believe quality education should be accessible to everyone.'
    },
    {
      question: 'Can I track my learning progress?',
      answer: 'Absolutely! Our platform tracks your progress through each tutorial and shows your completion status.'
    },
    {
      question: 'Do you offer certificates?',
      answer: 'We provide completion certificates for finished tutorials that you can add to your portfolio or LinkedIn.'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`${COLORS.background.primary} text-white py-20`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Have questions about CodeCraft? Need technical support? We're here to help! 
              Reach out to us and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className={`${COLORS.background.white} rounded-xl shadow-lg p-8`}>
              <h2 className={`text-2xl font-bold ${COLORS.text.dark} mb-6`}>Send us a Message</h2>
              
              {submitStatus === 'success' && (
                <div className={`${COLORS.status.success.bg} ${COLORS.border.secondary} border rounded-lg p-4 mb-6 flex items-center gap-3`}>
                  <CheckCircle size={20} className={COLORS.status.success.text} />
                  <span className={`${COLORS.status.success.text}`}>
                    Message sent successfully! We'll get back to you within 24 hours.
                  </span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className={`${COLORS.status.error.bg} ${COLORS.border.secondary} border rounded-lg p-4 mb-6 flex items-center gap-3`}>
                  <AlertCircle size={20} className={COLORS.status.error.text} />
                  <span className={`${COLORS.status.error.text}`}>
                    Failed to send message. Please try again later.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className={`block text-sm font-medium ${COLORS.text.dark} mb-2`}>
                      Your Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <User className={`h-5 w-5 ${COLORS.text.tertiary}`} />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-3 ${COLORS.border.secondary} border rounded-lg ${COLORS.interactive.focus.outline} ${COLORS.interactive.focus.ring} ${COLORS.interactive.focus.border} transition-colors duration-200 ${
                          errors.name ? `border-red-500 ${COLORS.status.error.bg}` : ''
                        }`}
                        placeholder="Enter your full name"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.name && (
                      <p className={`mt-1 text-sm ${COLORS.status.error.text}`}>{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium ${COLORS.text.dark} mb-2`}>
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <Mail className={`h-5 w-5 ${COLORS.text.tertiary}`} />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-3 ${COLORS.border.secondary} border rounded-lg ${COLORS.interactive.focus.outline} ${COLORS.interactive.focus.ring} ${COLORS.interactive.focus.border} transition-colors duration-200 ${
                          errors.email ? `border-red-500 ${COLORS.status.error.bg}` : ''
                        }`}
                        placeholder="Enter your email"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.email && (
                      <p className={`mt-1 text-sm ${COLORS.status.error.text}`}>{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className={`block text-sm font-medium ${COLORS.text.dark} mb-3`}>
                    What can we help you with?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categories.map((category) => (
                      <label
                        key={category.value}
                        className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          formData.category === category.value
                            ? `${COLORS.border.primaryDark} ${COLORS.background.primaryLight}`
                            : `${COLORS.border.secondary} hover:${COLORS.border.primary}`
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.value}
                          checked={formData.category === category.value}
                          onChange={handleChange}
                          className="sr-only"
                          disabled={isSubmitting}
                        />
                        <category.icon className={`h-6 w-6 mb-2 ${
                          formData.category === category.value ? COLORS.text.primary : COLORS.text.tertiary
                        }`} />
                        <span className={`text-xs font-medium text-center ${
                          formData.category === category.value ? COLORS.text.primary : COLORS.text.secondary
                        }`}>
                          {category.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className={`block text-sm font-medium ${COLORS.text.dark} mb-2`}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-3 py-3 ${COLORS.border.secondary} border rounded-lg ${COLORS.interactive.focus.outline} ${COLORS.interactive.focus.ring} ${COLORS.interactive.focus.border} transition-colors duration-200 ${
                      errors.subject ? `border-red-500 ${COLORS.status.error.bg}` : ''
                    }`}
                    placeholder="Brief description of your inquiry"
                    disabled={isSubmitting}
                  />
                  {errors.subject && (
                    <p className={`mt-1 text-sm ${COLORS.status.error.text}`}>{errors.subject}</p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className={`block text-sm font-medium ${COLORS.text.dark} mb-2`}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-3 py-3 ${COLORS.border.secondary} border rounded-lg ${COLORS.interactive.focus.outline} ${COLORS.interactive.focus.ring} ${COLORS.interactive.focus.border} transition-colors duration-200 resize-none ${
                      errors.message ? `border-red-500 ${COLORS.status.error.bg}` : ''
                    }`}
                    placeholder="Please provide details about your question or concern..."
                    disabled={isSubmitting}
                  />
                  {errors.message && (
                    <p className={`mt-1 text-sm ${COLORS.status.error.text}`}>{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center items-center gap-2 py-3 px-4 ${COLORS.button.primary} rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 hover:shadow-lg`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className={`${COLORS.background.white} rounded-xl shadow-lg p-6`}>
              <h3 className={`text-xl font-bold ${COLORS.text.dark} mb-6`}>Contact Information</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`${COLORS.background.primaryLight} p-3 rounded-lg`}>
                      <info.icon className={`h-5 w-5 ${COLORS.text.primary}`} />
                    </div>
                    <div>
                      <h4 className={`font-semibold ${COLORS.text.dark} mb-1`}>{info.title}</h4>
                      <p className={`${COLORS.text.secondary} text-sm mb-1`}>{info.details}</p>
                      <p className={`${COLORS.text.tertiary} text-xs`}>{info.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className={`${COLORS.background.white} rounded-xl shadow-lg p-6`}>
              <h3 className={`text-xl font-bold ${COLORS.text.dark} mb-6`}>Frequently Asked Questions</h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index}>
                    <h4 className={`font-medium ${COLORS.text.dark} mb-2 text-sm`}>{faq.question}</h4>
                    <p className={`${COLORS.text.secondary} text-sm leading-relaxed`}>{faq.answer}</p>
                    {index < faqs.length - 1 && <hr className={`my-4 ${COLORS.border.secondary}`} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;