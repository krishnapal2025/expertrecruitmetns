import PDFDocument from 'pdfkit';
import * as z from 'zod';
import { Readable } from 'stream';

// Define the schema for resume data
export const resumeDataSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().max(100),
    lastName: z.string().max(100),
    email: z.string().email().max(150),
    phone: z.string().max(50),
    address: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
    summary: z.string().optional(),
  }),
  education: z.array(
    z.object({
      institution: z.string().max(150),
      degree: z.string().max(150),
      fieldOfStudy: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      description: z.string().optional(),
    })
  ).max(10),
  experience: z.array(
    z.object({
      company: z.string().max(150),
      position: z.string().max(150),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      description: z.string().optional(),
    })
  ).max(10),
  skills: z.array(
    z.object({
      name: z.string().max(100),
      level: z.string().optional(),
    })
  ).max(20),
});

export type ResumeData = z.infer<typeof resumeDataSchema>;

// Sanitize text to prevent PDF injection and remove potentially problematic characters
function sanitizeText(text: string | undefined): string {
  if (!text) return '';
  // Replace any potentially problematic characters
  return text
    .substring(0, 1000)           // Limit string length
    .replace(/[^\x20-\x7E]/g, '') // Only allow basic ASCII
    .trim();
}

export function generateResumePDF(data: ResumeData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Create a PDF document with minimal metadata to avoid AV flags
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        // Minimal metadata - avoid product names and organization names
        info: {
          Title: 'Resume Document',
          Subject: 'Resume',
          // No Author, Creator, or Producer fields as these can trigger flags
        },
        // Use standard PDF fonts only
        font: 'Helvetica'
      });
      
      // Create a buffer to store the PDF
      const buffers: Buffer[] = [];
      doc.on('data', (buffer: Buffer) => buffers.push(buffer));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);
      
      // Add content to the PDF
      const margin = 50;
      const pageWidth = doc.page.width - margin * 2;
      
      // Clean all input data
      const firstName = sanitizeText(data.personalInfo.firstName);
      const lastName = sanitizeText(data.personalInfo.lastName);
      const email = sanitizeText(data.personalInfo.email);
      const phone = sanitizeText(data.personalInfo.phone);
      
      // Set up styling
      doc.font('Helvetica-Bold').fontSize(18)
         .text(`${firstName} ${lastName}`, {
           align: 'center'
         });
      
      // Contact info
      doc.moveDown(0.5)
         .font('Helvetica').fontSize(10)
         .text(`${email} | ${phone}`, {
           align: 'center'
         });
      
      // Address if available
      if (data.personalInfo.address) {
        let addressParts = [];
        if (data.personalInfo.address) addressParts.push(sanitizeText(data.personalInfo.address));
        if (data.personalInfo.city) addressParts.push(sanitizeText(data.personalInfo.city));
        if (data.personalInfo.postalCode) addressParts.push(sanitizeText(data.personalInfo.postalCode));
        if (data.personalInfo.country) addressParts.push(sanitizeText(data.personalInfo.country));
        
        doc.moveDown(0.5)
           .text(addressParts.join(', '), {
             align: 'center'
           });
      }
      
      // Separator
      doc.moveDown(1)
         .moveTo(margin, doc.y)
         .lineTo(doc.page.width - margin, doc.y)
         .stroke();
      
      // Summary if available
      if (data.personalInfo.summary) {
        doc.moveDown(1)
           .font('Helvetica-Bold').fontSize(12)
           .text('Professional Summary');
        
        doc.moveDown(0.5)
           .font('Helvetica').fontSize(10)
           .text(sanitizeText(data.personalInfo.summary), {
             width: pageWidth,
             align: 'left'
           });
      }
      
      // Experience section - limit to first 10 experiences
      if (data.experience.length > 0) {
        doc.moveDown(1.5)
           .font('Helvetica-Bold').fontSize(12)
           .text('Work Experience');
        
        // Limit number of entries to prevent excessive content
        const limitedExperiences = data.experience.slice(0, 10);
        
        limitedExperiences.forEach((exp) => {
          doc.moveDown(0.5)
             .font('Helvetica-Bold').fontSize(11)
             .text(sanitizeText(exp.position));
          
          let companyText = sanitizeText(exp.company);
          if (exp.startDate && exp.endDate) {
            companyText += ` | ${sanitizeText(exp.startDate)} - ${sanitizeText(exp.endDate)}`;
          }
          
          doc.font('Helvetica').fontSize(10)
             .text(companyText);
          
          if (exp.description) {
            doc.moveDown(0.5)
               .text(sanitizeText(exp.description), {
                 width: pageWidth,
                 align: 'left'
               });
          }
          
          doc.moveDown(0.5);
        });
      }
      
      // Education section - limit to first 10 education entries
      if (data.education.length > 0) {
        doc.moveDown(1)
           .font('Helvetica-Bold').fontSize(12)
           .text('Education');
        
        // Limit number of entries
        const limitedEducation = data.education.slice(0, 10);
        
        limitedEducation.forEach((edu) => {
          doc.moveDown(0.5)
             .font('Helvetica-Bold').fontSize(11)
             .text(sanitizeText(edu.degree));
          
          let institutionText = sanitizeText(edu.institution);
          if (edu.startDate && edu.endDate) {
            institutionText += ` | ${sanitizeText(edu.startDate)} - ${sanitizeText(edu.endDate)}`;
          }
          
          doc.font('Helvetica').fontSize(10)
             .text(institutionText);
          
          if (edu.fieldOfStudy) {
            doc.moveDown(0.2)
               .text(`Field of Study: ${sanitizeText(edu.fieldOfStudy)}`);
          }
          
          if (edu.description) {
            doc.moveDown(0.5)
               .text(sanitizeText(edu.description), {
                 width: pageWidth,
                 align: 'left'
               });
          }
          
          doc.moveDown(0.5);
        });
      }
      
      // Skills section - limit to 15 skills
      if (data.skills.length > 0) {
        doc.moveDown(1)
           .font('Helvetica-Bold').fontSize(12)
           .text('Skills');
        
        // Limit number of skills
        const limitedSkills = data.skills.slice(0, 15);
        
        const skillsText = limitedSkills
          .map((skill) => `${sanitizeText(skill.name)}${skill.level ? ` (${sanitizeText(skill.level)})` : ''}`)
          .join(', ');
        
        doc.moveDown(0.5)
           .font('Helvetica').fontSize(10)
           .text(skillsText, {
             width: pageWidth,
             align: 'left'
           });
      }
      
      // Add simple footer with date (no company names)
      const date = new Date().toLocaleDateString();
      doc.fontSize(8)
         .fillColor('#999999')
         .text(`Generated on ${date}`, 
               margin, 
               doc.page.height - 50, 
               { width: pageWidth, align: 'center' });
      
      // Finalize the PDF
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
}

// Helper to convert Buffer to Readable stream
export function bufferToStream(buffer: Buffer): Readable {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}