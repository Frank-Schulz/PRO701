import { atom } from 'recoil';

/**
 * It is the default margin setting.
 */
const margin = {
  left: 50,
  right: 50,
  top: 40,
  bottom: 0,
};

/**
 * It is the atom to track chart width.
 */
export const widthAtom = atom({
  key: 'width',
  default: margin.left + margin.right,
});

/**
 * It is the atom to track chart height, and the default value is margin top + bottom.
 */
export const heightAtom = atom({
  key: 'height',
  default: margin.top + margin.bottom,
});

/**
 * It is the atom to track chart margin.
 */
export const marginAtom = atom({
  key: 'margin',
  default: margin,
});
