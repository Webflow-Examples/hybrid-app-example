import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


/**
 * Generates metadata content suggestions and provides analysis based on the site's overall theme, target audience, and specified keywords (optional).
 *
 * @param {string} seoTitle - The current SEO title of the webpage.
 * @param {string} seoDescription - The current SEO description of the webpage.
 * @param {string} openGraphTitle - The current Open Graph title of the webpage.
 * @param {string} openGraphDescription - The current Open Graph description of the webpage.
 * @param {string[]} [targetKeywords] - An optional array of target keywords to optimize the suggestions for. Defaults to an empty array.
 *
 * @returns {Promise<object>} - A Promise that resolves to an object containing metadata analysis and suggestions for each metadata field.
 *
 * @example
 * // Example usage:
 * const seoTitle = "Top 10 Marketing Strategies";
 * const seoDescription = "Learn effective marketing strategies to boost website traffic and conversions.";
 * const openGraphTitle = "Latest Design Trends in Marketing";
 * const openGraphDescription = "Discover the latest design trends in the marketing industry and stay ahead of the competition with actionable insights.";
 * const targetKeywords = ["web design", "conversion rate"];
 *
 * generateMetadataSuggestionsAndAnalysis(seoTitle, seoDescription, openGraphTitle, openGraphDescription, targetKeywords)
 *   .then(metadata => console.log(metadata))
 *   .catch(error => console.error(error));
 * 
 * // Example output:
 * {"SEO title": {
 *   "analysis": "The current SEO title is not very descriptive and lacks focus on the unique selling points of the website template.",
 *   "suggestion": "10 Benefits of Using Specifics HTML Template for Your Website"
 * },
 * "SEO description": {
 *   "analysis": "The current SEO description is decent, but could benefit from using more specific keywords to attract the target audience.",
 *   "suggestion": "Create a clean and engaging website for your marketing business with Specifics HTML Template. Perfect for small businesses and startups."
 * },
 * "Open Graph title": {
 *   "analysis": "The current Open Graph title is not very engaging and lacks creativity.",
 *   "suggestion": "Stand out with Specifics HTML Template: Clean Design, Smooth Animations, Unique Layout"
 * },
 * "Open Graph description": {
 *   "analysis": "The current Open Graph description is decent, but could benefit from using more specific keywords to attract the target audience.",
 *   "suggestion": "Create a clean and engaging website for your marketing business with Specifics HTML Template. Perfect for small businesses and startups. Get inspired by our latest design trends and stay ahead of the competition."
 * }}
 */
export const generateMetadataSuggestionsAndAnalysis = async (seoTitle, seoDescription, openGraphTitle, openGraphDescription) => {
  try {
    const response = await requestMetadataSuggestionsAndAnalysis(seoTitle, seoDescription, openGraphTitle, openGraphDescription);
    return extractMetadataSuggestionsAndAnalysis(response);
  } catch (error) {
    throw new Error(`Failed to generate metadata suggestions and analysis: ${error.message}`);
  }
};

/**
 * This method sends a request to the OpenAI API to generate metadata content suggestions and provide analysis.
 * @param {*} seoTitle 
 * @param {*} seoDescription 
 * @param {*} openGraphTitle 
 * @param {*} openGraphDescription 
 * @param {*} targetKeywords 
 * @returns {object} - An OpenAI API response object containing metadata analysis and suggestions.
 *   The response object has the following properties:
 *   - id (string): The ID of the text completion request.
 *   - object (string): The type of object, which is always "text_completion".
 *   - created (number): The Unix timestamp when the request was created.
 *   - model (string): The name of the GPT-3 model used for the completion.
 *   - choices (array): An array containing one object with the following properties:
 *     - text (string): The generated text that provides metadata analysis and suggestions.
 *     - index (number): The index of the choice, which is always 0.
 *     - logprobs (null): Null, indicating that no log probabilities were generated.
 *     - finish_reason (string): The reason why the text generation stopped, which is always "stop".
*/
const requestMetadataSuggestionsAndAnalysis = async (seoTitle, seoDescription, openGraphTitle, openGraphDescription) => {
  const prompt = `Please generate and return a JSON object with the following keys and information:
  {
    "seoTitleAnalysis": "A one-sentence analysis of the quality and relevance of '${seoTitle}'. If it's missing, explain why not having it is a problem.",
    "seoDescriptionAnalysis": "A one-sentence analysis of the quality and relevance of '${seoDescription}'. If it's missing, explain why not having it is a problem.",
    "openGraphTitleAnalysis": "A one-sentence analysis of the quality and relevance of '${openGraphTitle}'. If it's missing, explain why not having it is a problem.",
    "openGraphDescriptionAnalysis": "A one-sentence analysis of the quality and relevance of '${openGraphDescription}'. If it's missing, explain why not having it is a problem.",
    "seoTitleSuggestions": "A suggestion of a better SEO title instead of '${seoTitle}'.",
    "seoDescriptionSuggestions": "A suggestion of a better SEO title instead of '${seoDescription}'.",
    "openGraphTitleSuggestions": "A suggestion of a better SEO title instead of '${openGraphTitle}'.",
    "openGraphDescriptionSuggestions": "A suggestion of a better SEO title instead of '${openGraphDescription}'."
  }
  `

  return await openai.createCompletion({
    // model specifies the language model to use for generating the completion. In this case, "text-davinci-003" is used,
    // which is one of OpenAI's most advanced models capable of producing high-quality text with diverse styles and tones.
    model: "text-davinci-003",
    prompt: prompt,
    // If you want more creative and diverse output, you can increase the temperature value (e.g., 0.8 or higher).
    // If you want more focused and deterministic output, you can decrease the temperature value (e.g., 0.2 or lower).
    temperature: 0.2,
    // You can set the max_tokens value to control the length of the generated text.
    // If you want shorter output, you can reduce the max_tokens value,
    // but be cautious not to set it too low, as it may result in incomplete or nonsensical text.
    max_tokens: 600,
    // Higher values for top_p (e.g., 0.8 or higher) allow more diversity in the generated text,
    // while lower values (e.g., 0.2 or lower) make the output more focused.
    // You can adjust this parameter based on the level of creativity and diversity you want in the generated text.
    top_p: 1.0,
    // Different values for the frequency_penalty and presence_penalty parameters will
    // penalize or allow repetition and similarity in the generated text based on your preference.
    // Higher values (e.g., 1.0) will penalize repetition or similarity more strongly,
    // while lower values (e.g., 0.0) will allow more repetition or similarity.
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });
};

export const generateImages = async (prompt, n, size, response_format) => {
  const getImageSize = (size) => {
    switch (size) {
      case 256:
        return "256x256";
      case 512:
        return "512x512";
      case 1024:
        return "1024x1024";
      default:
        return "512x512";
    }
  };

  return await openai.createImage({
    prompt: prompt,
    n: n,
    size: getImageSize(size),
  })
};

/**
 * Extracts metadata suggestions and analysis from an OpenAI API response object.
 *
 * @param {object} response - An OpenAI API response object containing metadata suggestions and analysis.
 *
 * @returns {object} - An object containing metadata analysis and suggestions for each metadata field.
 *
 * @example
 * // Example usage:
 * const response = {
 *   "choices": [
 *     {
 *       "text": "SEO title:\n\nThe current SEO title is not very descriptive and lacks focus on the unique selling points of the website template. Consider revising the title to highlight the key benefits and features of the template, such as its clean design, smooth animations, and unique layout.\n\nSuggestion:\n\n10 Benefits of Using Specifics HTML Template for Your Website\n\nOpen Graph title:\n\nThe current Open Graph title is not very engaging and lacks creativity. Consider using a more attention-grabbing title that highlights the unique selling points of the template and encourages users to click on the shared link.\n\nSuggestion:\n\nStand out with Specifics HTML Template: Clean Design, Smooth Animations, Unique Layout\n\nSEO description:\n\nThe current SEO description is decent, but could benefit from using more specific keywords to attract the target audience. Consider mentioning the industries or niches that the template is designed for, such as marketing, advertising, or e-commerce.\n\nSuggestion:\n\nCreate a clean and engaging website for your marketing business with Specifics HTML Template. Perfect for small businesses and startups.\n\nOpen Graph description:\n\nThe current Open Graph description is decent, but could benefit from using more specific keywords to attract the target audience. Consider mentioning the industries or niches that the template is designed for, such as marketing, advertising, or e-commerce.\n\nSuggestion:\n\nCreate a clean and engaging website for your marketing business with Specifics HTML Template. Perfect for small businesses and startups. Get inspired by our latest design trends and stay ahead of the competition."
 *     }
 *   ]
 * };
 *
 * const metadataSuggestionsAndAnalysis = extractMetadataSuggestionsAndAnalysis(response);
 * console.log(metadataSuggestionsAndAnalysis);
 * // Output: {
 * //   "seoTitleAnalysis": "The current SEO title is not very descriptive and lacks focus on the unique selling points of the website template.",
 * //   "seoTitleSuggestions": "10 Benefits of Using Specifics HTML Template for Your Website",
 * //   "seoDescriptionAnalysis": "The current SEO description is decent, but could benefit from using more specific keywords to attract the target audience.",
 * //   "seoDescriptionSuggestions": "Create a clean and engaging website for your marketing business with Specifics HTML Template. Perfect for small businesses and startups.",
 * //   "openGraphTitleAnalysis": "The current Open Graph title is not very engaging and lacks creativity.",
 * //   "openGraphTitleSuggestions": "Stand out with Specifics HTML Template: Clean Design, Smooth Animations, Unique Layout",
 * //   "openGraphDescriptionAnalysis": "The current Open Graph description is decent, but could benefit from using more specific keywords to attract the target audience.",
 * //   "openGraphDescriptionSuggestions": "Create a clean and engaging website for your marketing business with Specifics HTML Template. Perfect for small businesses and startups."
 * // }
 */
const extractMetadataSuggestionsAndAnalysis = (response) => {
  return JSON.parse(response.data.choices[0].text);
};

