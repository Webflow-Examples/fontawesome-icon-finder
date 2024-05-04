import { Icon, AbstractElement } from "@fortawesome/fontawesome-svg-core";

const createElementWithAttributes = async (
  node: AbstractElement,
  newDomElement: DOMElement
): Promise<DOMElement> => {
  // create the DOM element that Webflow will use to render the icon
  await newDomElement.setTag(node.tag);
  const attributes = node.attributes;
  const attributePromises: Promise<null>[] = [];
  Object.keys(attributes).forEach((attrKey) => {
    const value = attributes[attrKey];
    if (attrKey === "class") {
      // skip adding class attributes because we don't have the css that goes with it
      return;
    }
    // set the attributes for the DOM element
    attributePromises.push(newDomElement.setAttribute(attrKey, value));
  });
  await Promise.all(attributePromises);
  return newDomElement;
};

const addStyleToElement = async (
  element: DOMElement,
  color: string
): Promise<DOMElement> => {
  const className = `FA Icon ${color.replace("#", "")}`;
  // check if the style already exists
  let style = await webflow.getStyleByName(className);

  if (!style) {
    // create the style if it doesn't already exist
    style = await webflow.createStyle(className);
    await style.setProperty("color", color);
  }

  // set the styles on the DOM element
  await element.setStyles([style]);
  return element;
};

export async function insertIcon(
  icon: Icon,
  element: AnyElement,
  color: string
) {
  if (!element.children) {
    await webflow.notify({
      type: "Error",
      message: "Cannot append an SVG here",
    });
    return;
  }
  // loop over each node for the icon. `icon.abstract` is an array of SVG nodes (e.g. svg, path, etc.)
  for (const node of icon.abstract) {
    const newDomElement = await element.append(webflow.elementPresets.DOM);
    let modifiedElement = await createElementWithAttributes(
      node,
      newDomElement
    );
    if (node.tag === "svg") {
      // add the color to the svg element and return the same element so we can keep working with it below
      modifiedElement = await addStyleToElement(modifiedElement, color);
    }

    const children = node.children;
    if (children?.length) {
      // loop through each child node and add it to the `domElement` we created above
      children.forEach(async (child) => {
        // append the child node to the outermost parent element (should be an svg element)
        const newChildDomElement = await modifiedElement.append(
          webflow.elementPresets.DOM
        );
        await createElementWithAttributes(child, newChildDomElement);
      });
    }
  }
}
