import { Icon, AbstractElement } from '@fortawesome/fontawesome-svg-core';

const createElementWithAttributes = (node: AbstractElement): DOMElement => {
  // create the DOM element that Webflow will use to render the icon
  const domElement = webflow.createDOM(node.tag);
  const attributes = node.attributes;
  Object.keys(attributes).forEach(attrKey => {
    const value = attributes[attrKey];
    if (attrKey === 'class') {
      // skip adding class attributes because we don't have the css that goes with it
      return;
    }
    // set the attributes for the DOM element
    domElement.setAttribute(attrKey, value);
  });
  return domElement;
};

const addStyleToElement = async (
  element: DOMElement,
  color: string
): Promise<DOMElement> => {
  const className = `FA Icon ${color.replace('#', '')}`;
  // check if the style already exists
  let style = await webflow.getStyleByName(className);

  if (!style) {
    // create the style if it doesn't already exist
    style = webflow.createStyle(className);
    style.setProperty('color', color);
    await style.save();
  }

  // set the styles on the DOM element
  element.setStyles([style]);
  return element;
};

export async function insertIcon(
  icon: Icon,
  element: AnyElement,
  color: string
) {
  // loop over each node for the icon. `icon.abstract` is an array of SVG nodes (e.g. svg, path, etc.)
  for (const node of icon.abstract) {
    let domElement = createElementWithAttributes(node);
    if (node.tag === 'svg') {
      // add the color to the svg element and return the same element so we can keep working with it below
      domElement = await addStyleToElement(domElement, color);
    }

    const children = node.children;
    if (children?.length) {
      // loop through each child node and add it to the `domElement` we created above
      children.forEach(child => {
        const childElement = createElementWithAttributes(child);
        // append the child node to the outermost parent element (should be an svg element)
        domElement.setChildren([childElement]);
      });
    }

    if (element.configurable && element.children) {
      // append the svg node (with its existing children) to the selected element on the Webflow Designer canvas
      element.setChildren([...element.getChildren(), domElement]);
      await element.save();
    }
  }
}
