import TitleService from '../../../app/services/title-service.js';

const {module, test} = QUnit;

export default module('Title service', () => {

  test('should set default caption as title.', (assert) => {
    const initialTitle = 'NotFileHub';
    const expectedTitle = 'FileHub';
    const document = new DocumentMock(initialTitle);
    new TitleService(document);
    const actualTitle = document.title;

    assert.equal(actualTitle, expectedTitle, 'Should set title after initialization.');
  });

  test('should set provided caption as title.', (assert) => {
    const initialTitle = 'NotFileHub';
    const expectedTitle = 'ExpectedTitle';
    const document = new DocumentMock(initialTitle);
    new TitleService(document, {
      caption: expectedTitle,
    });
    const actualTitle = document.title;

    assert.equal(actualTitle, expectedTitle, 'Should set title after initialization.');
  });

  test('should initially set page name to the title.', (assert) => {
    const initialTitle = 'NotFileHub';
    const caption = 'Caption';
    const page = 'Log In';
    const expectedTitle = `${page} - ${caption}`;
    const document = new DocumentMock(initialTitle);
    new TitleService(document, {
      caption,
      page,
    });
    const actualTitle = document.title;

    assert.equal(actualTitle, expectedTitle, 'Should set page name to the title.');
  });

  test('should change existing page name.', (assert) => {
    const caption = 'World!';
    const oldPage = 'Hello ';
    const document = new DocumentMock();
    const titleService = new TitleService(document, {
      caption,
      page: oldPage,
    });
    const newPage = 'That\'s all, ';
    titleService.setPage(newPage);

    const expectedTitle = `${newPage} - ${caption}`;
    const actualTitle = document.title;
    assert.equal(actualTitle, expectedTitle, 'Should not append page name to the existing one.');
  });
});

class DocumentMock extends Document {
  constructor(title = '') {
    super();
    this._title = title;
  }

  set title(title) {
    this._title = title;
  }

  get title() {
    return this._title;
  }
}
