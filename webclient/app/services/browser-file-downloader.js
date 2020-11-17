/**
 * Service for downloading file which was already loaded into browser.
 */
export default class BrowserFileDownloader {

  /**
   * Downloads file.
   *
   * @param {File} file - file to download.
   */
  async downloadFile(file) {
    const anchor = document.createElement('a');
    const url = URL.createObjectURL(file);
    anchor.setAttribute('href', url);
    anchor.setAttribute('download', file.name);
    anchor.click();
  }
}
