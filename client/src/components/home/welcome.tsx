import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Users, Award, TrendingUp, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import hireImg from "@assets/3603649b-9dbb-4079-b5eb-c95af0e719b7.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Description } from "@radix-ui/react-toast";

// Custom arrow components for the slider
const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className="absolute right-4 top-1/2 -mt-5 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-2 cursor-pointer shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300"
      style={{ ...style }}
      onClick={onClick}
    >
      <ArrowRight className="h-6 w-6 text-primary" />
    </div>
  );
};

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className="absolute left-4 top-1/2 -mt-5 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-2 cursor-pointer shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300"
      style={{ ...style }}
      onClick={onClick}
    >
      <ArrowLeft className="h-6 w-6 text-primary" />
    </div>
  );
};

// Custom slider component with the slides
function CustomSlider() {
  // Slides data with SEO-optimized titles and descriptions for Dubai/UAE recruitment
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1920&auto=format&fit=crop",
      title: "Executive Search Dubai",
      subtitle: "Premier Headhunters in UAE",
      description: "The Home of High-End Executive Search in Dubai. From executive recruitment in the UAE to specialized headhunting services, we take a meticulous approach to matching exceptional talent with leading Dubai organizations."
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1920&auto=format&fit=crop",
      title: "Dubai's Top Recruitment Agency",
      subtitle: "Talent Acquisition UAE",
      description: "As the leading recruitment agency in Dubai, we deliver tailored talent acquisition solutions for UAE businesses seeking executive professionals across diverse industries and specializations."
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1920&auto=format&fit=crop",
      title: "Expert Headhunters Dubai",
      subtitle: "UAE's Trusted Recruitment Partner",
      description: "Our Dubai headhunters identify and secure exceptional executive talent for UAE businesses. With our specialized recruitment services, we connect organizations with professionals who will drive your business forward."
    }
  ];

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: "slick-dots custom-dots",
    appendDots: (dots: React.ReactNode) => (
      <div className="absolute bottom-8 left-0 right-0">
        <ul className="m-0 p-0 flex justify-center gap-2"> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 bg-white/40 rounded-full hover:bg-white/60 transition-all"></div>
    ),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        }
      }
    ]
  };

  return (
    <div className="w-full relative overflow-hidden">
      <Slider {...settings} className="full-width-slider">
        {slides.map((slide) => (
          <div key={slide.id} className="relative h-[400px] md:h-[600px] lg:h-[calc(100vh-6rem)] overflow-hidden">
            {/* Background Image with Parallax Effect */}
            <div 
              className="absolute inset-0 bg-cover bg-center scale-110"
              style={{ 
                backgroundImage: `url(${slide.image})`,
                transform: 'scale(1.05)'
              }}
            ></div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/30"></div>

            {/* Content */}
            <div className="container mx-auto h-full flex items-center relative z-10 px-4">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl text-white"
              >
                <span className="bg-primary/90 text-white px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-4">
                  {slide.title}
                </span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white drop-shadow-lg whitespace-nowrap">
                  {slide.subtitle}
                </h2>
                <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl">
                  {slide.description}
                </p>
              </motion.div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default function Welcome() {
  return (
    <section className="pt-0 pb-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"></div>
      <div className="absolute inset-0 -z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjMuNSAzLjIgMS4zLjkuOS0uNiAyLjEtLjYgMy4yIDAgMS4yIDEuNSAyLjQuNiAzLjItLjkuOS0yIDEuMy0zLjIgMS4zLTEuMiAwLTIuMy0uNS0zLjItMS4zLS45LS45LjYtMi4xLjYtMy4yIDAtMS4yLTEuNS0yLjQtLjYtMy4yLjktLjggMi0xLjMgMy4yLTEuM3oiIHN0cm9rZT0icmdiYSgxNDcsIDUxLCAyMzQsIDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-5"></div>

      {/* Animated background shapes */}
      <motion.div 
        className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/5 mix-blend-multiply opacity-60 -z-10"
        animate={{ 
          scale: [1, 1.1, 1],
          y: [0, -15, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-40 left-10 w-80 h-80 rounded-full bg-indigo-500/5 mix-blend-multiply opacity-50 -z-10"
        animate={{ 
          scale: [1, 1.15, 1],
          x: [0, 20, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Full-width slideshow section */}
      <div className="w-full relative mb-16 z-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          {/* Custom Arrows for Slider */}
          <CustomSlider />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10">

        <div className="grid md:grid-cols-2 gap-12 mb-16 items-stretch">
          {/* Left side - Employer content */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 h-full">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-4 shadow-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  For Employers
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                Find the talent your organization needs to thrive. We provide access to a diverse pool of qualified candidates.
              </p>

              <ul className="space-y-3 mb-6">
                {[
                  "Post jobs and reach qualified candidates",
                  "Search for candidates with the right skills",
                  "Manage applications with tracking tools",
                  "Build your employer brand with a profile"
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (index * 0.1), duration: 0.5 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <svg className="h-3 w-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </motion.li>
                ))}
              </ul>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <a 
                  href="/vacancy-form" 
                  className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300"
                >
                  Hire Talent
                  <svg className="ml-2 -mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Job seekers content */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 h-full">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center mr-4 shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  For Job Seekers
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                Take the next step in your career journey with us. We offer access to thousands of opportunities across various industries and locations.
              </p>

              <ul className="space-y-3 mb-6">
                {[
                  "Create a profile that showcases your skills",
                  "Browse jobs that match your qualifications",
                  "Get discovered by employers seeking talent",
                  "Access resources to enhance your search"
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + (index * 0.1), duration: 0.5 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </motion.li>
                ))}
              </ul>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.5 }}
              >
                <a 
                  href="/job-board" 
                  className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-primary to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:from-primary/90 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-300"
                >
                  Browse Jobs
                  <svg className="ml-2 -mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-4 gap-6 mb-10">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-primary">95%</span>
              </div>
              <h3 className="font-semibold mb-2">Client Satisfaction</h3>
              <p className="text-sm text-gray-600">Clients rating their experience as excellent</p>
            </div>
            <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-violet-200 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-violet-600">10k+</span>
              </div>
              <h3 className="font-semibold mb-2">Placements</h3>
              <p className="text-sm text-gray-600">Successful job placements in the last year</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-200 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-emerald-600">67%</span>
              </div>
              <h3 className="font-semibold mb-2">Faster Hiring</h3>
              <p className="text-sm text-gray-600">Reduced time-to-hire compared to industry average</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-amber-200 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-amber-600">92%</span>
              </div>
              <h3 className="font-semibold mb-2">Retention Rate</h3>
              <p className="text-sm text-gray-600">Candidates who stay with their new roles for 1+ years</p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.6 }}
            className="h-full"
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
              <div className="h-2 bg-primary"></div>
              <CardContent className="pt-6 flex flex-col h-full">
                <div className="flex items-start h-full">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-bold text-lg mb-2">Industry-Leading Success</h3>
                    <p className="text-gray-600 flex-1">
                      With a track record of connecting talent with opportunity, we've helped thousands of professionals advance their careers and hundreds of companies build strong teams.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.7 }}
            className="h-full"
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
              <div className="h-2 bg-violet-500"></div>
              <CardContent className="pt-6 flex flex-col h-full">
                <div className="flex items-start h-full">
                  <div className="h-12 w-12 rounded-full bg-violet-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <Award className="h-6 w-6 text-violet-500" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-bold text-lg mb-2">Quality Matches</h3>
                    <p className="text-gray-600 flex-1">
                      We focus on making meaningful connections between candidates and employers, ensuring the right fit for both parties to foster long-term success.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.8 }}
            className="h-full"
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
              <div className="h-2 bg-emerald-500"></div>
              <CardContent className="pt-6 flex flex-col h-full">
                <div className="flex items-start h-full">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <Users className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-bold text-lg mb-2">Expert Support</h3>
                    <p className="text-gray-600 flex-1">
                      Our team of recruitment professionals is dedicated to providing personalized guidance and support throughout your job search or hiring process.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}