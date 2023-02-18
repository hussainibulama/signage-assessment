import * as FileSystem from 'expo-file-system';

{
  /*
   *helper function for download and store file in the native file system(phone)
   */
}
export function downloadFile(url, ext) {
  // we take two inputs, url and extension and so to the file system
  const downloadResumable = FileSystem.createDownloadResumable(
    `${url}`,
    FileSystem.documentDirectory + `${Date.now()}.${ext}`,
    {},
  );
  return downloadResumable;
  {
    /*
    i was using Date.now() as the name for the file, i want the filePath to always be  different when saving the file
     */
  }
}

//take a string url and get the extension of that url
export function getUrlExtension(url) {
  return url.split(/[#?]/)[0].split('.').pop().trim();
}
