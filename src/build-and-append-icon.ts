import { Icon, AbstractElement } from '@fortawesome/fontawesome-svg-core';

const createElementWithAttributes = (
  node: AbstractElement
): { domElement: DOMElement; classList: Array<string> } => {
  const classList = [] as Array<string>;
  const domElement = webflow.createDOM(node.tag);
  const attributes = node.attributes;
  Object.keys(attributes).forEach(attrKey => {
    const value = attributes[attrKey];
    if (attrKey === 'class') {
      const classes = value.split(' ');
      classList.push(...classes);
    }
    domElement.setAttribute(attrKey, value);
  });
  return { domElement, classList };
};

export async function buildAndAppendIcon(
  icon: Icon,
  element: AnyElement
): Promise<Array<string>> {
  const allClasses = [];

  for (const node of icon.abstract) {
    const { domElement, classList } = createElementWithAttributes(node);
    allClasses.push(...classList);

    const children = node.children;
    if (children?.length) {
      children.forEach(child => {
        const { domElement: childElement, classList: childClassList } =
          createElementWithAttributes(child);
        allClasses.push(...childClassList);
        domElement.setChildren([childElement]);
      });
    }

    if (element.configurable && element.children) {
      element.setChildren([...element.getChildren(), domElement]);
      await element.save();
    }
  }

  return allClasses;
}
