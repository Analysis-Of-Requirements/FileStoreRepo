/**
 * Enumeration of all possible types of file model.
 *
 * @type {Readonly<{MUSIC: string, IMAGE: string, VIDEO: string, DOC: string, SPREADSHEET: string}>}
 */
const FileType = Object.freeze({
  IMAGE: 'image',
  DOC: 'doc',
  SPREADSHEET: 'excel',
  VIDEO: 'video',
  MUSIC: 'music',
  UNDEFINED: 'undefined',
});

export default FileType;
