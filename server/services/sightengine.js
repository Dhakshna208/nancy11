const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class SightengineService {
  constructor() {
    this.apiUser = process.env.SIGHTENGINE_API_USER;
    this.apiSecret = process.env.SIGHTENGINE_API_SECRET;
    this.baseUrl = 'https://api.sightengine.com';
    this.maxRetries = 2;
    this.timeout = 60000; // 60 seconds
  }

  async analyzeImage(imagePath) {
    let lastError;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const form = new FormData();
        form.append('media', fs.createReadStream(imagePath));
        // Fixed: 'ai-generated' → 'genai', removed invalid 'face-2-simpson', removed stray space
        form.append('models', 'genai,deepfake,nudity-2.1,weapon,recreational_drug,text-content');
        form.append('api_user', this.apiUser);
        form.append('api_secret', this.apiSecret);

        const response = await axios.post(`${this.baseUrl}/1.0/check.json`, form, {
          headers: form.getHeaders(),
          timeout: this.timeout,
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        });

        return response.data;
      } catch (error) {
        lastError = error;
        console.error(`Sightengine API Error (attempt ${attempt}/${this.maxRetries}):`, error.response?.data || error.message);

        if (attempt < this.maxRetries) {
          const delay = attempt * 3000;
          console.log(`Retrying Sightengine in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(lastError?.response?.data?.error?.message || 'Failed to analyze image with Sightengine');
  }

  extractAIDetection(data) {
    // Look for genai result first, then fall back to deepfake
    const genai = data?.type?.ai_generated;
    const deepfake = data?.type?.deepfake;

    // Try the direct probability fields as well
    const aiProb = genai ?? data?.ai_generated?.prob ?? deepfake ?? data?.deepfake?.prob ?? null;

    if (aiProb === null) {
      return { isAIGenerated: null, confidence: null, rawData: data?.type || null };
    }

    return {
      isAIGenerated: aiProb > 0.5,
      confidence: Math.round(aiProb * 100),
      rawData: data?.type || { genai, deepfake }
    };
  }

  extractManipulationDetection(data) {
    const nudity = data?.nudity || {};
    const weapon = data?.weapon || {};
    const drugs = data?.recreational_drug || data?.drugs || {};

    let isManipulated = null;
    let type = null;
    let confidence = null;

    // Check nudity (using raw_probability or sexual_activity for nudity-2.1)
    const nudityProb = nudity?.sexual_activity ?? nudity?.prob ?? 0;
    if (nudityProb > 0.5) {
      isManipulated = true;
      type = 'nudity';
      confidence = Math.round(nudityProb * 100);
    }

    // Check weapon
    const weaponProb = weapon?.prob ?? weapon?.classes?.firearm ?? 0;
    if (!isManipulated && weaponProb > 0.5) {
      isManipulated = true;
      type = 'weapon';
      confidence = Math.round(weaponProb * 100);
    }

    // Check drugs
    const drugsProb = drugs?.prob ?? 0;
    if (!isManipulated && drugsProb > 0.5) {
      isManipulated = true;
      type = 'drugs';
      confidence = Math.round(drugsProb * 100);
    }

    if (isManipulated === null) {
      isManipulated = false;
    }

    return {
      isManipulated,
      type,
      confidence,
      rawData: { nudity, weapon, drugs }
    };
  }

  async analyzeWithFallback(imagePath) {
    try {
      const result = await this.analyzeImage(imagePath);
      return {
        success: true,
        data: result,
        aiDetection: this.extractAIDetection(result),
        manipulationDetection: this.extractManipulationDetection(result)
      };
    } catch (error) {
      console.error('Sightengine analysis failed, using fallback:', error.message);
      return {
        success: false,
        error: error.message,
        aiDetection: { isAIGenerated: null, confidence: null, rawData: null },
        manipulationDetection: { isManipulated: null, type: null, confidence: null, rawData: null }
      };
    }
  }
}

module.exports = new SightengineService();
