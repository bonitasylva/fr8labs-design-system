import {DialogSurface, type DialogProps} from './Dialog';

export type DrawerProps = DialogProps;

export function Drawer(props: DrawerProps) {
  return <DialogSurface {...props} drawer />;
}
