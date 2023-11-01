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

export async function insertIcon(icon: Icon, element: AnyElement) {
  for (const node of icon.abstract) {
    const { domElement } = createElementWithAttributes(node);

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
