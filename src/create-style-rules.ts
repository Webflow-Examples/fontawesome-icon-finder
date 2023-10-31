const CLASS_PREFIX = 'wffa-';

export async function createStyleRules(
  classes: Array<string>,
  cssStyleRules: Array<CSSStyleRule>
) {
  for (const ogClassName of classes) {
    const className = CLASS_PREFIX + ogClassName;
    const existingStyle = await webflow.getStyleByName(className);
    if (existingStyle) {
      continue;
    }

    const newStyle = webflow.createStyle(className);
    const styleRule = cssStyleRules.find(
      rule => rule.selectorText === `.${ogClassName}`
    );

    if (!styleRule) {
      continue;
    }

    Array.from(styleRule).forEach(key => {
      const val = styleRule[key];
      console.log(key, val);
    });

    Array.from(styleRule.styleMap).forEach(style => {
      const key = style[0];
      let val = Array.from(style[1])[0];
      if (val instanceof CSSUnparsedValue) {
        const variable = val[0] as CSSVariableReferenceValue;
        if (!variable.fallback) {
          return;
        }

        val = String(variable.fallback[0]).trim();
      } else {
        if (val instanceof CSSUnitValue) {
          val = val.value + val.unit;
        } else if (val instanceof CSSKeywordValue) {
          val = val.value;
        }
      }

      console.log({ key, val });
    });
  }
}
