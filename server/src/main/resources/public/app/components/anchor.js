import Component from './component.js';

/**
 * Component for rendering link element.
 */
export default class Anchor extends Component {

  /**
   * Instantiates Anchor component.
   *
   * @param {HTMLElement} container - parent container.
   * @param {object} properties - configuration properties for Anchor component.
   * @param {string} properties.className - name of the class of anchor element..
   * @param {string} properties.anchorReference - value of 'href' attribute.
   * @param {string} properties.target - value of target attribute.
   * @param {string} properties.innerContent - inner html or text of <a> element.
   */
  constructor(container,
              {className = 'form-link', anchorReference, target, innerContent, title}) {
    super(container, {
      _className: className,
      _anchorReference: anchorReference,
      _target: target,
      _innerContent: innerContent,
      _title: title,
    });
  }

  /**
   * @inheritdoc
   * @return {string} markup of <a> element.
   */
  markup() {
    const {_className, _anchorReference, _target, _innerContent, _title} = this.properties;

    return `
      <a class="${_className}" 
        href="${_anchorReference}" 
        target="${_target}" 
        title="${_title}" 
        data-test="anchor">
        ${_innerContent}
      </a>
    `;
  }
}
