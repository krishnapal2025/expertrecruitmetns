// This is a script that can be used to populate the database with the Executive Recruitment blog posts
// The URLs are placeholders, as we're using imported local images in the codebase

import { pool } from '../server/db.js';

const executiveRecruitmentPosts = [
  {
    title: "Executive Search Firms Find Top Talent",
    subtitle: "The essential guide to working with executive search partners",
    content: "Explore how executive search firms help organizations find top leadership talent and what makes them essential partners in the hiring process. Executive search firms, often known as headhunters, specialize in recruiting high-level executives for organizations. They offer a unique value proposition by leveraging their extensive networks, discreet approach to recruitment, and deep understanding of specific industries.\n\nThis article explores how these specialized recruitment partners operate and why they've become indispensable for companies seeking C-suite and senior leadership talent.",
    banner_image: "/assets/pexels-photo-8730284.webp",
    author_id: 5, // Admin user
    publish_date: new Date(),
    published: true,
    category: "Executive Recruitment",
    tags: ["Executive Search", "C-Suite", "Leadership", "Recruitment"],
    slug: "executive-search-firms-find-top-talent",
    excerpt: "Explore how executive search firms help organizations find top leadership talent and what makes them essential partners in the hiring process.",
    read_time: "10 min read"
  },
  {
    title: "Top Headhunters in Dubai",
    subtitle: "How we helped a tech firm hire the perfect C-Suite candidate",
    content: "How we helped a tech firm hire the perfect C-Suite candidate through our specialized executive search process and industry network. When a leading technology company in Dubai needed to find a visionary CTO to lead their digital transformation initiatives, they turned to our executive search team for assistance.\n\nThis case study details the comprehensive search process we employed, from initial consultation and needs assessment to the successful placement of an exceptional candidate who not only met but exceeded the client's expectations.",
    banner_image: "/assets/pexels-photo-5685937.webp",
    author_id: 5,
    publish_date: new Date(),
    published: true,
    category: "Executive Recruitment",
    tags: ["Headhunting", "Dubai", "Tech Recruitment", "Case Study"],
    slug: "top-headhunters-in-dubai",
    excerpt: "How we helped a tech firm hire the perfect C-Suite candidate through our specialized executive search process and industry network.",
    read_time: "7 min read"
  },
  {
    title: "Recruitment Agencies in the UAE",
    subtitle: "Premier Headhunting Services in Dubai",
    content: "Top Recruitment Agency in UAE: Premier Headhunting Services in Dubai. The UAE's dynamic business landscape demands specialized recruitment partners who understand the unique cultural and professional requirements of the region. This article provides an overview of the recruitment agency ecosystem in the UAE, with particular focus on Dubai's sophisticated talent acquisition market.\n\nWe examine the distinctive attributes that set apart premier agencies from standard recruitment services, and why local expertise matters when sourcing talent in this competitive environment.",
    banner_image: "/assets/pexels-photo-4344860.webp",
    author_id: 5,
    publish_date: new Date(),
    published: true,
    category: "Executive Recruitment",
    tags: ["UAE", "Dubai", "Recruitment Agencies", "Headhunting"],
    slug: "recruitment-agencies-in-the-uae",
    excerpt: "Top Recruitment Agency in UAE: Premier Headhunting Services in Dubai",
    read_time: "8 min read"
  },
  {
    title: "Best Recruitment Agency in Dubai",
    subtitle: "Find Skilled Talent Today",
    content: "Best Recruitment Agency in Dubai – Find Skilled Talent Today through effective partnership with a top recruitment agency. What factors should you consider when selecting a recruitment partner in Dubai? This comprehensive guide outlines the key attributes of exceptional recruitment agencies operating in the region and provides a framework for evaluating their services.\n\nFrom industry specialization and track record to candidate assessment methodologies and post-placement support, we explore the essential criteria that distinguish the best recruitment agencies from the rest.",
    banner_image: "/assets/pexels-photo-3307862.webp",
    author_id: 5,
    publish_date: new Date(),
    published: true,
    category: "Executive Recruitment",
    tags: ["Dubai", "Talent Acquisition", "Recruitment Agency", "Hiring"],
    slug: "best-recruitment-agency-in-dubai",
    excerpt: "Best Recruitment Agency in Dubai – Find Skilled Talent Today through effective partnership with a top recruitment agency.",
    read_time: "10 min read"
  },
  {
    title: "Partner with HeadHunters Dubai",
    subtitle: "Skyrocket Your Talent Acquisition",
    content: "Why Partnering with a HeadHunter in Dubai Can Skyrocket Your Talent Acquisition. In Dubai's competitive talent market, standard recruitment approaches often fall short when seeking specialized or executive-level professionals. This article examines the strategic advantages of partnering with headhunters who offer targeted search methodologies and access to passive candidate networks.\n\nWe discuss how headhunters in Dubai leverage their industry insights, candidate relationships, and nuanced understanding of compensation structures to deliver exceptional talent that traditional recruitment methods might miss.",
    banner_image: "/assets/pexels-photo-5668858.webp",
    author_id: 5,
    publish_date: new Date(),
    published: true,
    category: "Executive Recruitment",
    tags: ["Headhunting", "Dubai", "Strategic Partnership", "Talent Acquisition"],
    slug: "partner-with-headhunters-dubai",
    excerpt: "Why Partnering with a HeadHunter in Dubai Can Skyrocket Your Talent Acquisition",
    read_time: "8 min read"
  },
  {
    title: "Recruitment Agencies for MNCs",
    subtitle: "Simplify Hiring for Multinational Companies",
    content: "How Recruitment Agencies Simplify Hiring for Multinational Companies. Multinational corporations face unique challenges when building teams across diverse global markets while maintaining consistent corporate culture and quality standards. This in-depth analysis explores how specialized recruitment agencies provide tailored solutions for MNCs operating in the Middle East.\n\nFrom navigating local employment regulations to implementing standardized assessment protocols across regions, we highlight the invaluable role that recruitment partners play in supporting international business expansion.",
    banner_image: "/assets/pexels-photo-7078666.jpeg",
    author_id: 5,
    publish_date: new Date(),
    published: true,
    category: "Executive Recruitment",
    tags: ["MNCs", "Global Recruitment", "Multinational Hiring", "Corporate Expansion"],
    slug: "recruitment-agencies-for-mncs",
    excerpt: "How Recruitment Agencies Simplify Hiring for Multinational Companies",
    read_time: "9 min read"
  }
];

async function uploadBlogPosts() {
  try {
    console.log('Checking if executive recruitment blog posts exist...');
    
    // Check if posts already exist
    const result = await pool.query(
      "SELECT COUNT(*) FROM blog_posts WHERE category = 'Executive Recruitment'"
    );
    
    const count = parseInt(result.rows[0].count);
    
    if (count > 0) {
      console.log(`${count} Executive recruitment blog posts already exist, skipping upload.`);
      return;
    }
    
    console.log('Adding executive recruitment blog posts...');
    
    // Create all executive recruitment blog posts
    for (const post of executiveRecruitmentPosts) {
      await pool.query(
        `INSERT INTO blog_posts (
          title, subtitle, content, banner_image, author_id, publish_date, 
          published, category, tags, slug, excerpt, read_time
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
        )`,
        [
          post.title,
          post.subtitle,
          post.content,
          post.banner_image,
          post.author_id,
          post.publish_date,
          post.published,
          post.category,
          post.tags,
          post.slug,
          post.excerpt,
          post.read_time
        ]
      );
      console.log(`Added blog post: ${post.title}`);
    }
    
    console.log('Successfully added executive recruitment blog posts!');
  } catch (error) {
    console.error('Error uploading blog posts:', error);
  } finally {
    pool.end();
  }
}

uploadBlogPosts();