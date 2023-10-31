import { IconPrefix } from '@fortawesome/fontawesome-svg-core';

export function transformIconPrefix(style: string): IconPrefix {
  let prefix = '' as IconPrefix;
  switch (style) {
    case 'solid':
      prefix = 'fas';
      break;
    case 'regular':
      prefix = 'far';
      break;
    case 'light':
      prefix = 'fal';
      break;
    case 'thin':
      prefix = 'fat';
      break;
    case 'duotone':
      prefix = 'fad';
      break;
    case 'brands':
      prefix = 'fab';
      break;
    case 'knockout':
      prefix = 'fak';
      break;
    case 'solid-style':
      prefix = 'fass';
      break;
    case 'regular-style':
      prefix = 'fasr';
      break;
    case 'light-style':
      prefix = 'fasl';
      break;
    default:
      prefix = 'fas';
      break;
  }

  return prefix;
}
