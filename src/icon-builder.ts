import { Icon, AbstractElement } from '@fortawesome/fontawesome-svg-core';

const createElementWithAttributes = (node: AbstractElement): DOMElement => {
  const nodeElement = webflow.createDOM(node.tag);
  const attributes = node.attributes;
  Object.keys(attributes).forEach(attrKey => {
    nodeElement.setAttribute(attrKey, attributes[attrKey]);
  });
  return nodeElement;
};

export async function buildAndAppendIcon(icon: Icon, element: AnyElement) {
  for (const node of icon.abstract) {
    const nodeElement = createElementWithAttributes(node);

    const children = node.children;
    if (children?.length) {
      children.forEach(child => {
        const childElement = createElementWithAttributes(child);
        nodeElement.setChildren([childElement]);
      });
    }

    if (element.configurable && element.children) {
      element.setChildren([nodeElement]);
      await element.save();
    }
  }
}
