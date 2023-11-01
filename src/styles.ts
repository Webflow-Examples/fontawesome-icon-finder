const CLASS_PREFIX = 'wffa-';
export const createClassName = (className: string): string =>
  CLASS_PREFIX + '-' + className;
