import { dom } from '@fortawesome/fontawesome-svg-core';

export const getFaCssStyleRules = (): Array<CSSStyleRule> => {
  const styleContent = dom.css();
  const doc = document.implementation.createHTMLDocument('');
  const styleElement = document.createElement('style');

  styleElement.textContent = styleContent;
  doc.body.appendChild(styleElement);

  const cssRules = styleElement.sheet?.cssRules;
  if (!cssRules) {
    return [];
  }

  const rules = [];
  for (let i = 0; i < cssRules.length; i++) {
    const rule = cssRules[i];
    if (rule instanceof window.CSSStyleRule) {
      rules.push(rule);
    }
  }

  return rules;
};
