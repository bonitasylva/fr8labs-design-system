import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "sandbox-fds-icons";
import { IconButton } from "./IconButton";
import { positionOverlay } from "./positionOverlay";
import { DateTimeRangePicker, type DateTimeRangePickerProps } from "./DateTimeRangePicker";
export type { DateTimeRangeValue } from "./DateTimeRangePicker";

export type SingleDateTimePickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  range?: false;
  showTime?: boolean;
  timezone?: string;
  locale?: string;
  description?: string;
  error?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  disabledMessage?: string;
  readOnly?: boolean;
  min?: string;
  max?: string;
  name?: string;
  step?: number;
};
export type DateTimePickerProps =
  | SingleDateTimePickerProps
  | (DateTimeRangePickerProps & { range: true });

type DateParts = { year: number; month: number; day: number; hour: number; minute: number };
const pad = (value: number) => String(value).padStart(2, "0");
const toDateKey = (year: number, month: number, day: number) => `${year}-${pad(month)}-${pad(day)}`;
const parseValue = (value: string): DateParts | undefined => {
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(value);
  if (!match) return undefined;
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4] ?? 0),
    minute: Number(match[5] ?? 0),
  };
};
const todayKey = () => {
  const today = new Date();
  return toDateKey(today.getFullYear(), today.getMonth() + 1, today.getDate());
};
const dateFromKey = (key: string) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};
const shiftDate = (key: string, days: number) => {
  const date = dateFromKey(key);
  date.setUTCDate(date.getUTCDate() + days);
  return toDateKey(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
};
const shiftMonth = (key: string, months: number) => {
  const date = dateFromKey(key);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  return toDateKey(date.getUTCFullYear(), date.getUTCMonth() + 1, Math.min(day, lastDay));
};

function SingleDateTimePicker({
  label,
  value,
  onChange,
  showTime = true,
  timezone,
  locale,
  description,
  error,
  isRequired,
  isDisabled,
  disabledMessage,
  readOnly,
  min,
  max,
  name,
  step = 60,
}: SingleDateTimePickerProps) {
  const inputId = useId();
  const popoverId = `${inputId}-picker`;
  const monthId = `${inputId}-month`;
  const helpId = `${inputId}-help`;
  const timezoneId = `${inputId}-timezone`;
  const selected = parseValue(value);
  const selectedDate = selected
    ? toDateKey(selected.year, selected.month, selected.day)
    : undefined;
  const initialDate = selectedDate ?? todayKey();
  const [focusDate, setFocusDate] = useState(initialDate);
  const [view, setView] = useState(() => ({
    year: Number(initialDate.slice(0, 4)),
    month: Number(initialDate.slice(5, 7)),
  }));
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const messages = [description, isDisabled ? disabledMessage : undefined, error].filter(
    (message): message is string => Boolean(message),
  );
  const describedBy =
    [showTime && timezone ? timezoneId : undefined, messages.length ? helpId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;
  const minDate = min?.slice(0, 10);
  const maxDate = max?.slice(0, 10);
  const monthName = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(view.year, view.month - 1, 1)));
  const weekdays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(Date.UTC(2021, 7, index + 1));
    return {
      short: new Intl.DateTimeFormat(locale, { weekday: "narrow", timeZone: "UTC" }).format(date),
      full: new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" }).format(date),
    };
  });
  const firstWeekday = new Date(Date.UTC(view.year, view.month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(view.year, view.month, 0)).getUTCDate();
  const cells: Array<string | undefined> = Array.from({ length: firstWeekday }, () => undefined);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(toDateKey(view.year, view.month, day));
  while (cells.length % 7) cells.push(undefined);

  const place = () => {
    if (anchorRef.current && panelRef.current) positionOverlay(anchorRef.current, panelRef.current);
  };
  const focusDay = (key: string) =>
    requestAnimationFrame(() =>
      panelRef.current?.querySelector<HTMLButtonElement>(`[data-date="${key}"]`)?.focus(),
    );
  const moveFocus = (key: string) => {
    if ((minDate && key < minDate) || (maxDate && key > maxDate)) return;
    const date = dateFromKey(key);
    setFocusDate(key);
    setView({ year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 });
    focusDay(key);
  };
  const setDate = (key: string) => {
    const time = selected ? `${pad(selected.hour)}:${pad(selected.minute)}` : "00:00";
    onChange(showTime ? `${key}T${time}` : key);
    setFocusDate(key);
  };
  const setTime = (time: string) => onChange(`${selectedDate ?? focusDate}T${time}`);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  const handleToggle = () => {
    const panel = panelRef.current;
    const nextOpen = panel?.matches(":popover-open") ?? false;
    setOpen(nextOpen);
    if (nextOpen) {
      const key = selectedDate ?? todayKey();
      const date = dateFromKey(key);
      setFocusDate(key);
      setView({ year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 });
      place();
      focusDay(key);
    } else if (panel?.contains(document.activeElement)) {
      triggerRef.current?.focus();
    }
  };
  const handleDayKeyDown = (event: KeyboardEvent<HTMLButtonElement>, key: string) => {
    let target: string | undefined;
    if (event.key === "ArrowLeft") target = shiftDate(key, -1);
    if (event.key === "ArrowRight") target = shiftDate(key, 1);
    if (event.key === "ArrowUp") target = shiftDate(key, -7);
    if (event.key === "ArrowDown") target = shiftDate(key, 7);
    if (event.key === "Home") target = shiftDate(key, -dateFromKey(key).getUTCDay());
    if (event.key === "End") target = shiftDate(key, 6 - dateFromKey(key).getUTCDay());
    if (event.key === "PageUp") target = shiftMonth(key, event.shiftKey ? -12 : -1);
    if (event.key === "PageDown") target = shiftMonth(key, event.shiftKey ? 12 : 1);
    if (target) {
      event.preventDefault();
      moveFocus(target);
    }
  };
  const changeMonth = (months: number) => {
    const next = shiftMonth(focusDate, months);
    setFocusDate(next);
    setView({ year: Number(next.slice(0, 4)), month: Number(next.slice(5, 7)) });
  };

  return (
    <div className="fds-field">
      <label className="fds-field__label" htmlFor={inputId}>
        {label}
        {isRequired ? <span aria-hidden="true"> *</span> : null}
      </label>
      <div
        ref={anchorRef}
        className={[
          "fds-date-time-picker__field",
          error && "fds-date-time-picker__field--error",
          isDisabled && "fds-date-time-picker__field--disabled",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <input
          id={inputId}
          type={showTime ? "datetime-local" : "date"}
          className="fds-date-time-picker__input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={isRequired}
          disabled={isDisabled}
          readOnly={readOnly}
          aria-readonly={readOnly || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          min={min}
          max={max}
          name={name}
          step={showTime ? step : undefined}
          lang={locale}
        />
        {showTime && timezone ? (
          <span id={timezoneId} className="fds-date-time-picker__timezone">
            {timezone}
          </span>
        ) : null}
        <IconButton
          ref={triggerRef}
          aria-label={value ? `Change ${label.toLowerCase()}` : `Choose ${label.toLowerCase()}`}
          size="small"
          disabled={isDisabled || readOnly}
          popoverTarget={popoverId}
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <Icon name="calendar_month" />
        </IconButton>
      </div>
      {messages.length ? (
        <div id={helpId} className={error ? "fds-field__error" : "fds-field__help"}>
          {messages.map((message, index) => (
            <div key={`${index}-${message}`}>{message}</div>
          ))}
        </div>
      ) : null}
      <div
        ref={panelRef}
        id={popoverId}
        popover="auto"
        role="dialog"
        aria-label={`Choose ${label.toLowerCase()}`}
        className="fds-date-time-picker__popover"
        onToggle={handleToggle}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            panelRef.current?.hidePopover();
            triggerRef.current?.focus();
          }
        }}
      >
        <div className="fds-date-time-picker__calendar-header">
          <IconButton aria-label="Previous month" size="small" onClick={() => changeMonth(-1)}>
            <Icon name="chevron_left" />
          </IconButton>
          <h2 id={monthId} aria-live="polite">
            {monthName}
          </h2>
          <IconButton aria-label="Next month" size="small" onClick={() => changeMonth(1)}>
            <Icon name="chevron_right" />
          </IconButton>
        </div>
        <table role="grid" aria-labelledby={monthId} className="fds-date-time-picker__calendar">
          <thead>
            <tr>
              {weekdays.map((weekday) => (
                <th key={weekday.full} abbr={weekday.full} scope="col">
                  {weekday.short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: cells.length / 7 }, (_, row) => (
              <tr key={row}>
                {cells.slice(row * 7, row * 7 + 7).map((key, column) => (
                  <td
                    key={key ?? `empty-${row}-${column}`}
                    aria-selected={key === selectedDate || undefined}
                  >
                    {key ? (
                      <button
                        type="button"
                        data-date={key}
                        tabIndex={key === focusDate ? 0 : -1}
                        aria-label={new Intl.DateTimeFormat(locale, {
                          dateStyle: "full",
                          timeZone: "UTC",
                        }).format(dateFromKey(key))}
                        disabled={Boolean((minDate && key < minDate) || (maxDate && key > maxDate))}
                        onFocus={() => setFocusDate(key)}
                        onKeyDown={(event) => handleDayKeyDown(event, key)}
                        onClick={() => setDate(key)}
                      >
                        {Number(key.slice(8, 10))}
                      </button>
                    ) : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {showTime ? (
          <label className="fds-field fds-date-time-picker__time">
            <span className="fds-field__label">Time</span>
            <span className="fds-date-time-picker__time-field">
              <input
                type="time"
                className="fds-date-time-picker__time-input"
                value={selected ? `${pad(selected.hour)}:${pad(selected.minute)}` : ""}
                onChange={(event) => setTime(event.target.value)}
                step={step}
              />
              {timezone ? <span className="fds-date-time-picker__timezone">{timezone}</span> : null}
            </span>
          </label>
        ) : null}
      </div>
    </div>
  );
}

export function DateTimePicker(props: DateTimePickerProps) {
  if (props.range) {
    const { range: _range, ...rangeProps } = props;
    return <DateTimeRangePicker {...rangeProps} />;
  }
  return <SingleDateTimePicker {...props} />;
}
