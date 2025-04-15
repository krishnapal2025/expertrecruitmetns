import { Helmet } from "react-helmet";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | RH Job Portal</title>
        <meta name="description" content="Our privacy policy outlines how we collect, use, and protect your personal information when you use our job portal services." />
      </Helmet>

      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl max-w-2xl">
            We are committed to protecting your privacy and ensuring the security of your personal information.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <p className="text-gray-600 mb-6">Last Updated: June 1, 2023</p>

            <div className="prose prose-lg max-w-none">
              <h2>Introduction</h2>
              <p>
                RH Job Portal ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
              <p>
                Please read this Privacy Policy carefully. By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
              </p>

              <h2>Information We Collect</h2>
              <p>We may collect information about you in a variety of ways:</p>
              <h3>Personal Data</h3>
              <p>When you register on our platform, we may collect personally identifiable information, such as:</p>
              <ul>
                <li>Your name, email address, and phone number</li>
                <li>Employment history and educational background</li>
                <li>Skills, certifications, and professional qualifications</li>
                <li>Resume/CV and cover letters</li>
                <li>For employers: company name, industry, and contact information</li>
              </ul>

              <h3>Automatically Collected Information</h3>
              <p>When you access our website, we may automatically collect certain information, including:</p>
              <ul>
                <li>IP addresses</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent</li>
                <li>Device information</li>
                <li>Referring website addresses</li>
              </ul>

              <h2>Use of Your Information</h2>
              <p>We may use the information we collect about you for various purposes, including to:</p>
              <ul>
                <li>Create and manage your account</li>
                <li>Connect job seekers with potential employment opportunities</li>
                <li>Assist employers in finding suitable candidates</li>
                <li>Provide and maintain our services</li>
                <li>Respond to your inquiries and fulfill your requests</li>
                <li>Send administrative information</li>
                <li>Send marketing communications related to our services</li>
                <li>Personalize your experience</li>
                <li>Generate anonymized statistical data</li>
                <li>Ensure the security of our services</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2>Disclosure of Your Information</h2>
              <p>We may share your information with third parties in the following situations:</p>
              <ul>
                <li>With employers when you apply for jobs or match their search criteria</li>
                <li>With service providers who perform services on our behalf</li>
                <li>To comply with legal obligations</li>
                <li>To protect the rights, property, or safety of our company, our users, or others</li>
                <li>In connection with a business transaction such as a merger, sale of assets, or acquisition</li>
              </ul>

              <h2>Security of Your Information</h2>
              <p>
                We use administrative, technical, and physical security measures to protect your personal information. While we have taken reasonable steps to secure the information you provide to us, please be aware that no security measures are perfect or impenetrable, and we cannot guarantee the security of your information.
              </p>

              <h2>Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
              </p>

              <h2>Your Rights Regarding Your Information</h2>
              <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
              <ul>
                <li>The right to access the personal information we hold about you</li>
                <li>The right to request correction of inaccurate information</li>
                <li>The right to request deletion of your information</li>
                <li>The right to restrict or object to our processing of your information</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent</li>
              </ul>

              <h2>Children's Privacy</h2>
              <p>
                Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child without parental consent, we will take steps to remove that information.
              </p>

              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p>
                Email: privacy@rhjobportal.com<br />
                Phone: +1 (555) 123-4567<br />
                Address: 123 Business Avenue, Suite 456, New York, NY 10001
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
