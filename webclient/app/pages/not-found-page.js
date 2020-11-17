import Component from '../components/component.js';

/**
 * Represents 'not found page' component.
 * Can be displayed when wrongly typed url.
 */
export default class NotFoundPage extends Component {

  /**
   * Instantiates NotFoundPage.
   *
   * @param {HTMLElement} container - parent container.
   * @param {object} properties - configuration properties.
   * @param {string} properties.resourceName - name of not found resource.
   * @param {string} properties.linkToFollow - link to follow to leave not found page.
   * @param {TitleService} properties.titleService - title service.
   */
  constructor(container, {resourceName, linkToFollow, titleService}) {
    super(container, {resourceName, linkToFollow, titleService});
  }

  /**
   * @inheritdoc
   */
  initComponent() {
    this.properties.titleService.setPage(`${this.properties.resourceName} Not Found`);
    super.initComponent();
  }

  /**
   * @inheritdoc
   */
  markup() {
    const {linkToFollow, resourceName} = this.properties;

    return `
      <div class="application-box form-box" data-test="page-not-found">
        <div class="header">
          <h1 data-test="page-not-found-message">${resourceName} was not found. 
            <a href="#${linkToFollow}" data-test="page-not-found-link">Try this way</a>.
          </h1>  
        </div>
      </div>
    `;
  }
}
