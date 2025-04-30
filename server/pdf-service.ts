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

export function generateResumePDF(data: ResumeData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Create a PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
          Title: `Resume - ${data.personalInfo.firstName} ${data.personalInfo.lastName}`,
          Author: 'Expert Recruitments Resume Builder',
          Subject: 'Professional Resume',
          Keywords: 'resume,cv,professional',
          Creator: 'Expert Recruitments LLC',
          Producer: 'PDFKit',
        }
      });
      
      // Create a buffer to store the PDF
      const buffers: Buffer[] = [];
      doc.on('data', (buffer: Buffer) => buffers.push(buffer));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);
      
      // Add content to the PDF
      const margin = 50;
      const pageWidth = doc.page.width - margin * 2;
      
      // Set up styling
      doc.font('Helvetica-Bold').fontSize(18)
         .text(`${data.personalInfo.firstName} ${data.personalInfo.lastName}`, {
           align: 'center'
         });
      
      // Contact info
      doc.moveDown(0.5)
         .font('Helvetica').fontSize(10)
         .text(`${data.personalInfo.email} | ${data.personalInfo.phone}`, {
           align: 'center'
         });
      
      // Address if available
      if (data.personalInfo.address) {
        let addressParts = [];
        if (data.personalInfo.address) addressParts.push(data.personalInfo.address);
        if (data.personalInfo.city) addressParts.push(data.personalInfo.city);
        if (data.personalInfo.postalCode) addressParts.push(data.personalInfo.postalCode);
        if (data.personalInfo.country) addressParts.push(data.personalInfo.country);
        
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
           .text(data.personalInfo.summary, {
             width: pageWidth,
             align: 'left'
           });
      }
      
      // Experience section
      if (data.experience.length > 0) {
        doc.moveDown(1.5)
           .font('Helvetica-Bold').fontSize(12)
           .text('Work Experience');
        
        data.experience.forEach((exp) => {
          doc.moveDown(0.5)
             .font('Helvetica-Bold').fontSize(11)
             .text(exp.position);
          
          let companyText = exp.company;
          if (exp.startDate && exp.endDate) {
            companyText += ` | ${exp.startDate} - ${exp.endDate}`;
          }
          
          doc.font('Helvetica').fontSize(10)
             .text(companyText);
          
          if (exp.description) {
            doc.moveDown(0.5)
               .text(exp.description, {
                 width: pageWidth,
                 align: 'left'
               });
          }
          
          doc.moveDown(0.5);
        });
      }
      
      // Education section
      if (data.education.length > 0) {
        doc.moveDown(1)
           .font('Helvetica-Bold').fontSize(12)
           .text('Education');
        
        data.education.forEach((edu) => {
          doc.moveDown(0.5)
             .font('Helvetica-Bold').fontSize(11)
             .text(edu.degree);
          
          let institutionText = edu.institution;
          if (edu.startDate && edu.endDate) {
            institutionText += ` | ${edu.startDate} - ${edu.endDate}`;
          }
          
          doc.font('Helvetica').fontSize(10)
             .text(institutionText);
          
          if (edu.fieldOfStudy) {
            doc.moveDown(0.2)
               .text(`Field of Study: ${edu.fieldOfStudy}`);
          }
          
          if (edu.description) {
            doc.moveDown(0.5)
               .text(edu.description, {
                 width: pageWidth,
                 align: 'left'
               });
          }
          
          doc.moveDown(0.5);
        });
      }
      
      // Skills section
      if (data.skills.length > 0) {
        doc.moveDown(1)
           .font('Helvetica-Bold').fontSize(12)
           .text('Skills');
        
        const skillsText = data.skills
          .map((skill) => `${skill.name}${skill.level ? ` (${skill.level})` : ''}`)
          .join(', ');
        
        doc.moveDown(0.5)
           .font('Helvetica').fontSize(10)
           .text(skillsText, {
             width: pageWidth,
             align: 'left'
           });
      }
      
      // Add footer with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      doc.fontSize(8)
         .fillColor('#999999')
         .text(`Generated: ${timestamp} | Expert Recruitments LLC`, 
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