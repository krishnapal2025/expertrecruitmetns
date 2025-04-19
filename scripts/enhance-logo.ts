import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

// Setup OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function enhanceLogo() {
  try {
    console.log('Starting logo enhancement process...');
    
    // Define the paths
    const inputLogoDir = path.join(__dirname, '../client/src/assets');
    const outputLogoDir = path.join(__dirname, '../client/src/assets');
    
    // Make sure assets directory exists
    if (!fs.existsSync(inputLogoDir)) {
      fs.mkdirSync(inputLogoDir, { recursive: true });
    }
    
    // We'll generate a new logo completely with DALL-E
    console.log('Generating new refined logo with AI...');

    // Use OpenAI to generate an enhanced logo
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Create a professional, high-quality recruitment company logo for 'Expert Recruitments LLC'. Logo should be corporate and modern. Color scheme should be professional blue and gold. Make it clean, polished with sleek typography. Create a design that would look good at 250x250 pixels. Ensure it's highly detailed with sharp edges and refined appearance. The logo should work well on white backgrounds.",
      n: 1,
      size: "1024x1024",
      response_format: "b64_json"
    });
    
    if (!response.data[0].b64_json) {
      throw new Error('No image data received from OpenAI');
    }
    
    // Save the enhanced logo
    const outputLogoPath = path.join(outputLogoDir, 'enhanced-expert-logo.png');
    const enhancedImageBuffer = Buffer.from(response.data[0].b64_json, 'base64');
    fs.writeFileSync(outputLogoPath, enhancedImageBuffer);
    
    console.log(`Enhanced logo saved to ${outputLogoPath}`);
    console.log('Enhancement completed successfully!');
    
    return outputLogoPath;
  } catch (error) {
    console.error('Error enhancing logo:', error);
    throw error;
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  enhanceLogo()
    .then(outputPath => {
      console.log(`Logo enhanced and saved to: ${outputPath}`);
    })
    .catch(error => {
      console.error('Logo enhancement failed:', error);
      process.exit(1);
    });
}

export default enhanceLogo;