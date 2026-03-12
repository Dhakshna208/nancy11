const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

class SerpApiService {
  constructor() {
    this.apiKey = process.env.SERPAPI_KEY;
    this.baseUrl = 'https://serpapi.com/search.json';
    this.maxRetries = 2;
    this.timeout = 60000; // 60 seconds
  }

  /**
   * Upload image to freeimage.host to get a publicly accessible URL.
   * SerpApi's Google Lens requires a public URL — local files/data URIs won't work.
   */
  async uploadToTempHost(imagePath) {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // freeimage.host is a free image hosting API (no key required for basic uploads)
    const form = new FormData();
    form.append('source', base64Image);
    form.append('type', 'base64');
    form.append('action', 'upload');

    const response = await axios.post('https://freeimage.host/api/1/upload', form, {
      headers: form.getHeaders(),
      params: { key: '6d207e02198a847aa98d0a2a901485a5' }, // freeimage.host public demo key
      timeout: 30000
    });

    if (response.data?.image?.url) {
      return response.data.image.url;
    }
    throw new Error('Failed to upload image to temporary host');
  }

  async searchByImage(imagePath) {
    let lastError;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        // Step 1: Upload image to get a public URL
        console.log(`Uploading image for reverse search (attempt ${attempt})...`);
        const publicUrl = await this.uploadToTempHost(imagePath);
        console.log('Image uploaded, searching with SerpApi...');

        // Step 2: Use the public URL with SerpApi Google Lens
        const response = await axios.get(this.baseUrl, {
          params: {
            engine: 'google_lens',
            url: publicUrl,
            api_key: this.apiKey
          },
          timeout: this.timeout
        });

        return response.data;
      } catch (error) {
        lastError = error;
        console.error(`SerpApi Error (attempt ${attempt}/${this.maxRetries}):`, error.response?.data?.error || error.message);

        if (attempt < this.maxRetries) {
          const delay = attempt * 3000;
          console.log(`Retrying SerpApi in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(lastError?.response?.data?.error || 'Failed to perform reverse image search');
  }

  getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif'
    };
    return mimeTypes[ext] || 'image/jpeg';
  }

  extractSimilarImages(data) {
    const similarImages = [];
    
    try {
      const visualMatches = data?.visual_matches || [];
      const imageResults = data?.image_results || [];
      
      const allResults = [...visualMatches, ...imageResults];
      
      for (const result of allResults.slice(0, 10)) {
        similarImages.push({
          title: result.title || 'No title',
          link: result.link || result.image?.link || '',
          source: result.source || result.domain || '',
          thumbnail: result.thumbnail || result.image?.thumbnail || result.img || ''
        });
      }
    } catch (error) {
      console.error('Error extracting similar images:', error);
    }

    return similarImages;
  }

  async searchWithFallback(imagePath) {
    try {
      const result = await this.searchByImage(imagePath);
      return {
        success: true,
        data: result,
        similarImages: this.extractSimilarImages(result)
      };
    } catch (error) {
      console.error('SerpApi search failed, using fallback:', error.message);
      return {
        success: false,
        error: error.message,
        similarImages: []
      };
    }
  }
}

module.exports = new SerpApiService();
