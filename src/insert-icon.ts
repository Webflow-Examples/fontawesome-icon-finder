import { Icon, AbstractElement } from '@fortawesome/fontawesome-svg-core';

const createElementWithAttributes = (
  node: AbstractElement
): { domElement: DOMElement } => {
  const domElement = webflow.createDOM(node.tag);
  const attributes = node.attributes;
  Object.keys(attributes).forEach(attrKey => {
    const value = attributes[attrKey];
    if (attrKey === 'class') {
      return;
    }
    domElement.setAttribute(attrKey, value);
  });
  return { domElement };
};

const addStyleToElement = async (
  element: DOMElement,
  color: string
): Promise<DOMElement> => {
  const className = `FA Icon ${color.replace('#', '')}`;
  let style = await webflow.getStyleByName(className);

  if (!style) {
    // create the style if it doesn't already exist
    style = webflow.createStyle(className);
    style.setProperty('color', color);
    await style.save();
  }

  element.setStyles([style]);
  return element;
};

export async function insertIcon(
  icon: Icon,
  element: AnyElement,
  color: string
) {
  for (const node of icon.abstract) {
    let { domElement } = createElementWithAttributes(node);
    if (node.tag === 'svg') {
      domElement = await addStyleToElement(domElement, color);
    }

    const children = node.children;
    if (children?.length) {
      children.forEach(child => {
        const { domElement: childElement } = createElementWithAttributes(child);
        domElement.setChildren([childElement]);
      });
    }

    if (element.configurable && element.children) {
      element.setChildren([...element.getChildren(), domElement]);
      await element.save();
    }
  }
}
