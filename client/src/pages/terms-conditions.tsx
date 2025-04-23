import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet";

export default function TermsConditionsPage() {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions | Expert Recruitments LLC</title>
        <meta 
          name="description" 
          content="Terms and conditions for using the Expert Recruitments LLC website and services."
        />
      </Helmet>
      
      {/* Hero Section with Content */}
      <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-28 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight">
              Terms and Conditions
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-0 leading-relaxed">
              Full terms and conditions for use of the Expert Recruitments LLC website
            </p>
          </div>
        </div>
      </section>
      
      {/* Terms and Conditions Content */}
      <section className="pt-0 pb-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 md:p-10 mb-12 mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Introduction</h2>
              <p>
                Expert Recruitments LLC (referred to as "Expert Recruitments LLC", "we" or "us"), with its address at office no 306, Al Shali Building, Dubai, United Arab Emirates, provides you access to the ExpertRecruitments.com and other Expert Recruitments LLC group websites (the "Site") in order to help you at every stage of the recruitment process and offer you other specialist services. Please read these Terms of Use carefully before using the Site. Using the site indicates that you accept these Terms of Use regardless of whether or not you choose to register with us. If you do not accept these Terms of Use, do not use the Site.
              </p>
              
              <p>
                Where Expert Recruitments LLC introduces by telephone, postal mail or electronic mail any candidate for a temporary assignment or employment with our hiring clients the introductions shall be subject to our standard Terms of Business as applicable. We will provide all of our hiring clients with a copy of the standard Terms of Business applicable to them at the point of registration or following registration. These Terms of Use are in addition to and not in substitution for our standard Terms of Business.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 mt-8">Your Use of the Site</h2>
              <p>
                You may access most areas of the Site without registering your details with us. Certain areas of the site are only open to you if you register by accessing any part of the Site, you shall be deemed to have accepted these Terms of Use in full. If you do not accept these Terms of Use in full, you must leave this Site immediately.
              </p>
              
              <p>You will not use the Site for any of the following purposes:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>To post or transmit any material for which you have not obtained all necessary licences and/or approvals;</li>
                <li>To post or transmit on the Site inaccurate, incomplete or false information (including in the case of candidates, biographical information about yourself and/or information about your ability to work in the United Arab Emirates or elsewhere);</li>
                <li>To post or transmit on the Site any libellous, abusive, threatening, harmful, vulgar, obscene or otherwise objectionable material;</li>
                <li>To post or transmit on the Site any material which contains any virus or other disabling devices which interferes or may interfere with the operation of the Site; or which alters or deletes any information which you have no authority to alter or delete; or which overloads the Site by spamming or flooding it;</li>
                <li>To use any device, routine or software to crash, delay, or otherwise damage the operation of this Site;</li>
                <li>To take any action that affects Expert Recruitments LLC's reputation or that defames, abuses, harasses or threatens others;</li>
                <li>To encourage conduct that would be considered a criminal offence, give rise to civil liability, or otherwise be contrary to the law; or carry out such conduct yourself.</li>
              </ul>
              
              <p>
                Expert Recruitments LLC in its sole discretion shall determine your compliance with the above and shall have the right to prevent you from using the Site and/or to delete from the Site immediately and without prior notice any material that it deems not to comply or to be objectionable for any reason. Expert Recruitments LLC shall co-operate fully with any law enforcement authorities or court order requesting or directing Expert Recruitments LLC to disclose the identity or locate any person posting any material in breach of this section.
              </p>
              
              <p>
                As the services on the Site are made available to users and employers immediately, you do not enjoy any cancellation or "cooling-off" rights in relation to these Terms of Use.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 mt-8">Links to or from Other Websites</h2>
              <p>
                As a convenience to users, this Site contains links to external websites and you may be offered a number of automatic links to other sites, which may interest you. We accept no responsibility for or liability in respect of the content of those third party sites. Expert Recruitments LLC has not reviewed or approved such sites and does not control and is not responsible for those sites or their content. Expert Recruitments LLC does not warrant that any links to such sites work or are up to date. We do not endorse or make any representations about those sites or any material found there or any results that may be obtained from using them. If you decide to access any of the third party websites linked to this Site, you do so entirely at your own risk.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 mt-8">Security and Passwords</h2>
              <p>
                When you register with this site or log in when you visit the Site, you will need to use a user name and password. You are solely responsible for the security and proper use of the password, which should be kept confidential at all times and not disclosed to anyone. You must notify us immediately if you believe that your password is in the possession of someone else or if it may be used in an unauthorised way. We accept no liability for any unauthorised or improper use of disclosure of any password.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 mt-8">Aggregate Information</h2>
              <p>
                We may gather information and statistics collectively about all visitors to this Site which may include the information supplied by you which will help us to understand our users thereby creating a better recruitment process. We will not disclose individual names or identifying information. All data will be in aggregate form only. We believe this information helps us determine what is most beneficial for our users and how we can continually improve our online service. We may share this kind of aggregate data with selected third parties to assist with these purposes.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 mt-8">Intellectual Property Rights</h2>
              <p>
                Unless otherwise stated, the copyright and other intellectual property rights in all material on this Site (including without limitation photographs and graphical images) are owned by Expert Recruitments LLC or its licensors. You may not download copy or print any of the pages of the Site except for your own personal use, and provided you keep intact all copyright and proprietary notices. No copying or distribution for any business or commercial use is allowed. No framing, harvesting, scraping or mining of this Site is permitted. No part of the Site may be reproduced or transmitted to or stored in any other website, nor may any of its pages or part thereof be disseminated in any electronic or non-electronic form, nor included in any public or private electronic retrieval system or service without Expert Recruitments LLC's prior written permission.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 mt-8">Changes to or Temporary Unavailability of this Site</h2>
              <p>
                Every effort is made to keep the Site up and running smoothly and fault-free. However, Expert Recruitments LLC takes no responsibility for, and will not be liable for, the Site being temporarily unavailable for reasons of maintenance / improvement, or due to technical issues beyond our control. We may change, suspend or discontinue any aspect of the Site at any time, including the availability of any of the Site features, databases or content. Expert Recruitments LLC may amend these Terms of Use at any time by posting the amended terms on the Site. All amended terms shall be automatically effective after they are posted on the Site. Your continued use of the Site after posting of the changes will constitute your agreement to such changes.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 mt-8">Termination</h2>
              <p>
                We may at our absolute discretion deny you access to this Site (which may include any of the services or information available through it) or any part of it at any time without explanation.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 mt-8">Liability and Disclaimer</h2>
              <p>
                The information contained on this Site including any salary information or surveys are given in good faith and Expert Recruitments LLC uses all reasonable efforts to ensure that it is accurate. However, Expert Recruitments LLC gives no representation or warranty in respect of such information and all such representations and warranties, whether express or implied, are excluded.
              </p>
              
              <p>
                No liability is accepted by Expert Recruitments LLC for any loss or damage which may arise out of any person relying on or using any information on this Site. Expert Recruitments LLC shall not be liable to any person relying on or using any such information for (a) loss of revenue, loss of actual or anticipated salary; loss of actual or anticipated profits whether arising in the normal course of business or otherwise (including, without limitation, loss of profits on contracts); loss of or damage to employment prospects; loss of opportunity; loss of the use of money; loss of anticipated savings; loss of business; loss of goodwill; loss of or damage to reputation; loss of or corruption to data; loss of management time or office time; or (b) any indirect or consequential loss or damages however caused (including without limitation by reason of misrepresentation, negligence or other tort, breach of contract or breach of statutory duty) which arise directly or indirectly from the subject matter of this Site. However, nothing in the above shall limit or exclude Expert Recruitments LLC's liability for fraud or for death or personal injury caused by negligence, or to the extent otherwise not permitted by law.
              </p>
              
              <p>
                You agree fully to indemnify us and keep us fully indemnified against all costs, expenses, claims, losses, liabilities or proceedings arising from use or misuse by you of this Site.
              </p>
              
              <p>
                We do not guarantee that any employer or client will ask for a candidate's information, or will interview or hire a candidate, or that any candidates will be available or will meet the needs of any employer or client. We make no representation or warranty as to the final terms and duration of any appointment obtained through this Site. Whilst we take all reasonable endeavours to ensure it is the case, we do not guarantee that any employer or client will keep confidential any candidate information or data provided to them.
              </p>
              
              <p>
                If any provision of these terms and conditions is held to be invalid by a court of competent jurisdiction, such invalidity shall not affect the validity of the remaining provisions, which shall remain in full force and effect.
              </p>
              
              <p>
                Your use of the Site and downloads from it, and the operation of these terms and conditions, shall be governed in accordance with the laws of the Emirate of Dubai and the applicable federal laws of the United Arab Emirates. The courts of the Emirate of Dubai shall have exclusive jurisdiction over any dispute arising out of the use of this website.
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg mt-4 mb-6">
                <p className="font-medium text-primary mb-1">Expert Recruitments LLC</p>
                <p>ExpertRecruitments.com is the website for Expert Recruitments LLC, a company registered in the United Arab Emirates, whose registered office is office no 306, Al Shali Building, Dubai, United Arab Emirates and is also registered in India and the USA.</p>
                <p>In case of any query regarding the information on this website, please contact <a href="mailto:info@expertrecruitments.com" className="text-primary hover:underline">info@expertrecruitments.com</a></p>
              </div>
              
              <p className="text-sm text-gray-500 mt-8 border-t border-gray-100 pt-6">
                © Expert Recruitments LLC 2025. All rights reserved.
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