export function positionOverlay(anchor: HTMLElement, overlay: HTMLElement, align: 'start' | 'center' = 'start') {
  const gap = 8;
  const anchorRect = anchor.getBoundingClientRect();
  const overlayRect = overlay.getBoundingClientRect();
  const below = anchorRect.bottom + gap;
  const top = below + overlayRect.height <= window.innerHeight - gap ? below : Math.max(gap, anchorRect.top - overlayRect.height - gap);
  const preferredLeft = align === 'center' ? anchorRect.left + (anchorRect.width - overlayRect.width) / 2 : anchorRect.left;
  const left = Math.max(gap, Math.min(preferredLeft, window.innerWidth - overlayRect.width - gap));
  overlay.style.inset = `${top}px auto auto ${left}px`;
}
