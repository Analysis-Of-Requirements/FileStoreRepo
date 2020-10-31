import Component from './component.js';

/**
 * Component for rendering icon element of glyphicon family.
 */
export default class Glyphicon extends Component {

  /**
   * Instantiates Glyphicon component.
   *
   * @param {HTMLElement} container - parent container.
   * @param {object} properties - configuration properties for the component.
   * @param {string} properties.glyphIconClass - defines glyphicon to be displayed.
   */
  constructor(container, {glyphIconClass}) {
    super(container, {
      _glyphIconClass: glyphIconClass,
    });
  }

  /**
   * @inheritdoc
   * @return {string} markup of icon element.
   */
  markup() {
    const iconClass = this.properties._glyphIconClass || '';
    return `
      <span class="glyphicon ${iconClass}" data-test="glyphicon"></span>
    `;
  }
}
