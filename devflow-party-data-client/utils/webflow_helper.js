import Webflow from "webflow-api";

const { CLIENT_ID, CLIENT_SECRET } = process.env;

// TODO: We should update our API Client so that any requests that fail with a 403 status code
// to inform the user that they should check to ensure they authorized the user for the correct scopes.

export function getAPIClient(token, beta=true) {
  return new Webflow({ 
    token: token,
    version: beta ? "2.0.0" : "1.0.0",
    host: beta ? "webflow.com/beta" : "webflow.com",
    headers: {
      "User-Agent": "Devflow.party",
    }
  });
}

export async function revokeToken(access_token) {
  const webflowAPI = getAPIClient(access_token);
  await webflowAPI.revokeToken({access_token, client_id: CLIENT_ID, client_secret: CLIENT_SECRET});
}

const ALL_SCOPES = [
  'assets:read',
  'assets:write',
  'authorized_user:read',
  'cms:read',
  'cms:write',
  'custom_code:read',
  'custom_code:write',
  'forms:read',
  'forms:write',
  'pages:read',
  'pages:write',
  'sites:read',
  'sites:write',
];

export function getAuthUrl(scope = ALL_SCOPES){
  const webflow = new Webflow();
  return webflow.authorizeUrl({
    scope: scope.join(' '),
    client_id: CLIENT_ID,
  });
}

/**
 * Retrieves an access token from the Webflow API using an authorization code.
 * 
 * Since we're getting the access token from the server in our middleware, we need to use the node-fetch package 
 * instead of the browser fetch API. This is because the browser fetch API is not available in
 * the server runtime. See the following 2 links:
 * https://nextjs.org/docs/messages/node-module-in-edge-runtime
 * https://nextjs.org/docs/api-reference/edge-runtime
 * 
 * @param {string} code - An authorization code previously obtained from Webflow.
 * @returns {Promise<string>} - A promise that resolves to the access token string.
 * @throws {Error} - If the API request fails or the response cannot be parsed.
 */
export async function getAccessToken(code){
  try {
    const response = await fetch("https://api.webflow.com/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code,
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });
    if (!response.ok) {
      // If the response status code is not in the 200-299 range, throw an error.
      throw new Error(`Failed to fetch access token: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    // Return the access token string from the response data object.
    return data.access_token;
  } catch (error) {
    // If there is an error while parsing the response, throw an error.
    throw new Error(`Failed to parse response: ${error.message}`);
  }
}