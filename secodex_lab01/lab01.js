// Lab01: Fetch a URL and inspect the response.

import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body ?? {};

  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return res.status(400).json({ error: 'Invalid or missing URL' });
  }

  try {
    const response = await axios.get(url, {
      timeout: 3000
    });

    const contentType = response.headers['content-type'] || '';
    const data = response.data;

    if (contentType.includes('text/html')) {
      const $ = cheerio.load(data);

      return res.status(200).json({
        title: $('title').text(),
        description:
          $('meta[name="description"]').attr('content') || ''
      });
    }

    return res.status(200).json({
      content: data
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Unable to retrieve URL'
    });
  }
}
