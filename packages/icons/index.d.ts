import type {HTMLAttributes, JSX} from 'react';

export type IconProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  name: string;
  label?: string;
  size?: 16 | 20;
};

export declare function Icon(props: IconProps): JSX.Element;
