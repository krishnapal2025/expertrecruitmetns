import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Get the current file's directory path (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory containing the original high-resolution images
const sourcePath = path.join(__dirname, '../client/src/assets');
// Directory to save the optimized images
const outputPath = path.join(__dirname, '../client/src/assets/optimized');

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

// Define sizes for responsive images
const sizes = {
  small: { width: 640, suffix: '-sm' }, // For mobile devices
  medium: { width: 1024, suffix: '-md' }, // For tablets and small desktops 
};

// Configure optimization settings
const optimizationConfig = {
  jpeg: { quality: 80, progressive: true },
  webp: { quality: 80 },
  avif: { quality: 65 }, // More aggressive compression for AVIF
};

// List of hero images to be optimized 
const heroImages = [
  'aerial-view-business-team.jpg',
  'job-board-hero.jpg',
  'business-people-shaking-hands-meeting-room.jpg',
  'city-financial-district-glows-blue-twilight-generated-by-ai.jpg',
  // Add other hero images as needed
];

// Function to optimize and resize an image
async function optimizeImage(filename) {
  const inputFile = path.join(sourcePath, filename);
  const fileExtension = path.extname(filename);
  const baseName = path.basename(filename, fileExtension);
  
  console.log(`Optimizing: ${filename}`);
  
  // Process each size
  for (const [sizeName, sizeConfig] of Object.entries(sizes)) {
    const { width, suffix } = sizeConfig;
    
    // Create optimized JPEG
    const jpegOutputPath = path.join(outputPath, `${baseName}${suffix}.jpg`);
    await sharp(inputFile)
      .resize({ width, withoutEnlargement: true })
      .jpeg(optimizationConfig.jpeg)
      .toFile(jpegOutputPath);
    console.log(`Created: ${baseName}${suffix}.jpg`);
    
    // Create WebP version (better compression)
    const webpOutputPath = path.join(outputPath, `${baseName}${suffix}.webp`);
    await sharp(inputFile)
      .resize({ width, withoutEnlargement: true })
      .webp(optimizationConfig.webp)
      .toFile(webpOutputPath);
    console.log(`Created: ${baseName}${suffix}.webp`);
    
    // Create AVIF version (best compression but less browser support)
    const avifOutputPath = path.join(outputPath, `${baseName}${suffix}.avif`);
    try {
      await sharp(inputFile)
        .resize({ width, withoutEnlargement: true })
        .avif(optimizationConfig.avif)
        .toFile(avifOutputPath);
      console.log(`Created: ${baseName}${suffix}.avif`);
    } catch (error) {
      console.warn(`Failed to create AVIF: ${error.message}`);
    }
  }
}

// Process all images
async function processAllImages() {
  try {
    // Create a promise for each image
    const promises = heroImages.map(filename => optimizeImage(filename));
    
    // Wait for all optimizations to complete
    await Promise.all(promises);
    
    console.log('All hero images have been optimized successfully!');
    console.log(`Optimized images saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

// Run the optimization
processAllImages();