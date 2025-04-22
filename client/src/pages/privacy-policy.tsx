import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Expert Recruitments LLC</title>
        <meta 
          name="description" 
          content="Our privacy policy outlines how Expert Recruitments LLC collects, uses, and protects your personal information."
        />
      </Helmet>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              How we collect, use, and protect your personal information
            </p>
          </div>
        </div>
      </section>
      
      {/* Privacy Policy Content */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 md:p-10 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Introduction</h2>
              <p>
                Expert Recruitments LLC ("we", "our", or "us") is an Executive Search and Head Hunting agency based in Dubai. We are committed to protecting the privacy and security of personal data we collect in the course of our business operations. This Privacy Policy outlines how we collect, use, store, and protect personal information of both candidates and employers.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 mt-8">Information We Collect</h2>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Candidate Information</h3>
              <p>We collect and process the following types of personal data from candidates:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Full name and contact details (email, phone number, address)</li>
                <li>Career history and educational background</li>
                <li>Professional qualifications and skills</li>
                <li>CV/resume and cover letters</li>
                <li>References and recommendations</li>
                <li>Salary expectations and preferences</li>
                <li>Any other information provided during the application process</li>
              </ul>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Employer Information</h3>
              <p>We collect and process the following types of information from employers:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Company name and contact details</li>
                <li>Key personnel information (name, position, contact details)</li>
                <li>Job requirements and descriptions</li>
                <li>Company profile and culture information</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 mt-8">How We Use Your Information</h2>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">For Candidates</h3>
              <p>We use your personal information to:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Assess your suitability for job opportunities</li>
                <li>Match your profile with potential employers</li>
                <li>Communicate with you about job opportunities</li>
                <li>Conduct background checks and verify information (with your consent)</li>
                <li>Improve our recruitment services</li>
              </ul>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">For Employers</h3>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Identify suitable candidates for your job openings</li>
                <li>Provide recruitment and talent acquisition services</li>
                <li>Communicate about potential candidates and placement progress</li>
                <li>Maintain our business relationship</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 mt-8">Legal Basis for Processing</h2>
              <p>We process personal data based on the following legal grounds:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Consent: Where you have given explicit consent for processing</li>
                <li>Contractual necessity: To fulfill our contractual obligations</li>
                <li>Legitimate interests: To provide our recruitment services effectively</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 mt-8">Data Retention</h2>
              <p>
                We retain personal data only for as long as necessary to fulfill the purposes for which it was collected, or as required by applicable laws. Candidate data is typically retained for 2 years from the last point of contact, unless consent is given for a longer period.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 mt-8">Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect personal data against unauthorized access, alteration, disclosure, or destruction.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 mt-8">Your Rights</h2>
              <p>Under applicable data protection laws, you have the right to:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Access your personal data</li>
                <li>Rectify inaccurate personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing</li>
                <li>Data portability</li>
              </ul>
              <p>To exercise these rights, please contact us using the details provided below.</p>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 mt-8">International Data Transfers</h2>
              <p>
                We may transfer your personal data to countries outside the UAE. In such cases, we ensure appropriate safeguards are in place to protect your information.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 mt-8">Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. The most current version will be posted on our website.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 mt-8">Contact Us</h2>
              <p>If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
              <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg mt-4 mb-6">
                <p className="font-medium text-primary mb-1">Expert Recruitments LLC</p>
                <p>Office no: 306, Al Shali Building, Dubai, United Arab Emirates</p>
                <p>Email: <a href="mailto:talent@expertrecruitments.com" className="text-primary hover:underline">talent@expertrecruitments.com</a></p>
                <p>Phone: <a href="tel:+971526207777" className="text-primary hover:underline">+971 52 620 7777</a></p>
              </div>
              
              <p className="text-sm text-gray-500 mt-8 border-t border-gray-100 pt-6">
                This Privacy Policy was last updated on March 12, 2023.
              </p>
            </motion.div>
          </div>
          
          <div className="max-w-4xl mx-auto flex justify-center">
            <a 
              href="/" 
              className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-200 shadow-sm transition-colors"
            >
              <span>Back to Homepage</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}