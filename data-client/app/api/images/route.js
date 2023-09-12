import { generateImages } from '@/utils/openai_helper';
import { getAPIClient } from '@/utils/webflow_helper';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { promises as fs, readFileSync } from "fs";
import { join } from 'path';
import os from 'os';
import { pipeline } from 'stream';
import { promisify } from 'util';
import FormData from 'form-data';
import fetch from 'isomorphic-fetch';

const pipelineAsync = promisify(pipeline);

/**
 * An asynchronous function that handles POST requests. 
 * 
 * This function performs the following operations:
 * 1. Checks if the 'webflow_auth' cookie is present. If not, it returns a JSON response indicating that the user is not authenticated.
 * 2. Retrieves the 'webflow_auth' cookie value and initializes the Webflow API client.
 * 3. Extracts the 'imageURL' and 'siteId' from the request body. If either of these is missing, it returns a JSON response indicating the missing parameters.
 * 4. Downloads the file from the provided 'imageURL', generates its MD5 hash, and stores it in a temporary directory.
 * 5. Makes a POST request to the Webflow API to generate an AWS S3 presigned post, using the 'siteId', file name, and file hash.
 * 6. Uploads the file to AWS S3 using the details provided in the presigned post.
 * 7. If the upload is successful, it deletes the file from the temporary directory and returns a JSON response indicating success and the status of the upload response.
 * 8. If any error occurs during the process, it returns a JSON response with the error message.
 * 
 * @param {Object} request - The request object, expected to contain 'imageURL' and 'siteId' in its JSON body.
 * @returns {Object} A NextResponse object containing a JSON response. The response contains a status of the operation and, in case of an error, an error message.
 * 
 * @throws Will throw an error if the 'imageURL' or 'siteId' is missing in the request, if there's an HTTP error when fetching the image, or if the upload to Webflow fails.
 */
export async function POST(request) {
  const { imageURL, siteId, auth } = await request.json();
  if (!imageURL || !siteId || !auth) {
    return NextResponse.json({ error: 'Missing imageURL or siteId or auth' }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
  const webflowAPI = getAPIClient(auth);

  try {
    // Download the file
    // TODO: Identify a way to stream the File to AWS without saving it to disk
    const splitURL = imageURL.split('?')[0].split('/');
    const fileName = splitURL[splitURL.length - 1];
    const filePath = join(os.tmpdir(), fileName);
    const res = await fetch(imageURL);
    const buffer = await res.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(buffer));

    // Generate the md5 file hash and store it in a variable
    // TODO: Optimize this so that fetch is only called once.
    const res2 = await fetch(imageURL);
    if (!res2.ok) {
      throw new Error(`HTTP error! status: ${res2.status}`);
    }
    const fileStream = res2.body;
    const hashStream = crypto.createHash('md5');
    await pipelineAsync(
      fileStream,
      hashStream
    );
    const fileHash = hashStream.digest('hex');

    // Generate an AWS s3 Presigned Post
    const response  = await webflowAPI.post(`/sites/${siteId}/assets`, {fileName, fileHash});
    const { uploadDetails } = response.data;
    
    // Upload the file to AWS
    const form = new FormData();
    Object.entries(uploadDetails).forEach(([field, value]) => {
      if (value === null) {
        // TODO: Track down why X-Amz-Security-Token is showing a null value.
        return;
      }
      form.append(field, value);
    });    
    form.append("file", readFileSync(filePath));
    // TODO: This URL should be returned from the API
    const uploadUrl2 = 'https://webflow-prod-assets.s3.amazonaws.com/';
    const uploadResponse = await fetch(uploadUrl2, {
      method: 'POST',
      body: form,
    });
    if (!uploadResponse.ok) {
      throw new Error(`Upload to Webflow failed! status: ${uploadResponse.status}\n${uploadResponse.text()}}`);
    }
    await fs.unlink(filePath);
    return NextResponse.json({ ok: true, status: uploadResponse.status }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}

// Send query to DALL-E
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (!searchParams.get('auth')) {
    return NextResponse.json({ok: false, error: 'Not authenticated'}, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  const prompt = searchParams.get('prompt');
  const n = parseInt(searchParams.get('n'));
  const size = parseInt(searchParams.get('size'));
  try {
    const response = await generateImages(prompt, n, size);
    return NextResponse.json({ images: response.data.data }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
