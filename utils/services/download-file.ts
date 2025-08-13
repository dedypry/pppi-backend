import axios from 'axios';
import { uploadFile } from './file-gallery.service';

function getDownloadUrl(url) {
  const gdriveRegex = /https:\/\/drive\.google\.com\/file\/d\/([^/]+)\/view/;
  const match = url.match(gdriveRegex);

  if (match && match[1]) {
    const fileId = match[1];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }

  return url;
}

export async function getImageFromUrl(url, folder = 'profiles') {
  if (!url) return null;

  url = getDownloadUrl(url);

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
    });

    const buffer = Buffer.from(response.data, 'binary');

    const file = await uploadFile(buffer, folder);

    if (file) {
      return file.url;
    }
    return null;
  } catch (error) {
    console.error('ERRORR ===', error);
    return null;
  }
}
