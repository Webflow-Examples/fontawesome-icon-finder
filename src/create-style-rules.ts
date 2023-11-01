import { createClassName } from './styles';

const CLASS_PREFIX = 'wffa-';

const FONT_AWESOME_STYLES = {
  '.svg-inline--fa': {
    display: 'inline-block',
    height: '1em',
    'overflow-x': 'visible',
    'overflow-y': 'visible',
    'vertical-align': '-0.125em',
  },
} as { [key: string]: { [key: string]: string } };

export async function createStyleRules(classes: Array<string>) {
  for (const ogClassName of classes) {
    if (!FONT_AWESOME_STYLES[ogClassName]) {
      continue;
    }

    const className = CLASS_PREFIX + ogClassName;
    const existingStyle = await webflow.getStyleByName(className);
    if (existingStyle) {
      continue;
    }

    const style = webflow.createStyle(createClassName(ogClassName));
    style.setProperties(FONT_AWESOME_STYLES[ogClassName]);
    await style.save();
  }
}
