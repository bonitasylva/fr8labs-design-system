import {useId, type KeyboardEvent, type ReactNode} from 'react';

export type TabsItem = {value: string; label: string; content: ReactNode; disabled?: boolean};
export type TabsProps = {ariaLabel: string; items: readonly TabsItem[]; value: string; onChange: (value: string) => void};

export function Tabs({ariaLabel, items, value, onChange}: TabsProps) {
  const id = useId();
  const enabledItems = items.filter((item) => !item.disabled);
  const activeValue = enabledItems.some((item) => item.value === value) ? value : enabledItems[0]?.value;

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, item: TabsItem) {
    const current = enabledItems.indexOf(item);
    let next = current;
    if (event.key === 'ArrowLeft') next = (current - 1 + enabledItems.length) % enabledItems.length;
    else if (event.key === 'ArrowRight') next = (current + 1) % enabledItems.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = enabledItems.length - 1;
    else return;
    event.preventDefault();
    if (!enabledItems[next]) return;
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)')[next]?.focus();
  }

  return <div className="fds-tabs">
    <div className="fds-tabs__list" role="tablist" aria-label={ariaLabel}>
      {items.map((item, index) => {
        const selected = item.value === activeValue;
        return <button key={item.value} id={`${id}-tab-${index}`} className="fds-tabs__tab" type="button" role="tab" aria-selected={selected} aria-controls={`${id}-panel-${index}`} tabIndex={selected ? 0 : -1} disabled={item.disabled} onFocus={() => {if (!selected) onChange(item.value);}} onClick={(event) => {if (event.currentTarget !== event.currentTarget.ownerDocument.activeElement) onChange(item.value);}} onKeyDown={(event) => handleKeyDown(event, item)}>{item.label}</button>;
      })}
    </div>
    {items.map((item, index) => {
      const selected = item.value === activeValue;
      return <div key={item.value} id={`${id}-panel-${index}`} className="fds-tabs__panel" role="tabpanel" aria-labelledby={`${id}-tab-${index}`} tabIndex={selected ? 0 : -1} hidden={!selected}>{item.content}</div>;
    })}
  </div>;
}
