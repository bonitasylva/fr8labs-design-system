import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "sandbox-fds-icons";
import { IconButton } from "./IconButton";
import { positionOverlay } from "./positionOverlay";

export type DateTimeRangeValue = { start: string; end: string };
export type DateTimeRangePickerProps = {
  label: string;
  value: DateTimeRangeValue;
  onChange: (value: DateTimeRangeValue) => void;
  showTime?: boolean;
  startLabel?: string;
  endLabel?: string;
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
  startName?: string;
  endName?: string;
  step?: number;
};

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
const timeFromParts = (parts?: DateParts) =>
  parts ? `${pad(parts.hour)}:${pad(parts.minute)}` : "00:00";

export function DateTimeRangePicker({
  label,
  value,
  onChange,
  showTime = true,
  startLabel = "Start",
  endLabel = "End",
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
  startName,
  endName,
  step = 60,
}: DateTimeRangePickerProps) {
  const id = useId();
  const popoverId = `${id}-picker`;
  const monthId = `${id}-month`;
  const helpId = `${id}-help`;
  const timezoneId = `${id}-timezone`;
  const start = parseValue(value.start);
  const end = parseValue(value.end);
  const startDate = start ? toDateKey(start.year, start.month, start.day) : undefined;
  const endDate = end ? toDateKey(end.year, end.month, end.day) : undefined;
  const initialDate = startDate ?? todayKey();
  const [focusDate, setFocusDate] = useState(initialDate);
  const [view, setView] = useState(() => ({
    year: Number(initialDate.slice(0, 4)),
    month: Number(initialDate.slice(5, 7)),
  }));
  const [phase, setPhase] = useState<"start" | "end">("start");
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pendingEndTime = useRef(timeFromParts(end));
  const rangeError =
    value.start && value.end && value.end < value.start
      ? `${endLabel} must be on or after ${startLabel.toLowerCase()}.`
      : undefined;
  const message = error ?? rangeError;
  const messages = [description, isDisabled ? disabledMessage : undefined, message].filter(
    (item): item is string => Boolean(item),
  );
  const describedBy =
    [showTime && timezone ? timezoneId : undefined, messages.length ? helpId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;
  const endMin = value.start && (!min || value.start > min) ? value.start : min;
  const toValue = (date: string, time: string) => (showTime ? `${date}T${time}` : date);
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
  const selectDate = (key: string) => {
    if (phase === "start" || !startDate) {
      pendingEndTime.current = timeFromParts(end);
      onChange({ start: toValue(key, timeFromParts(start)), end: "" });
      setPhase("end");
    } else if (key < startDate) {
      onChange({ start: toValue(key, timeFromParts(start)), end: "" });
    } else {
      onChange({ start: value.start, end: toValue(key, pendingEndTime.current) });
      setPhase("start");
    }
    setFocusDate(key);
  };
  const setTime = (target: "start" | "end", time: string) => {
    const date = target === "start" ? startDate : endDate;
    if (date) onChange({ ...value, [target]: `${date}T${time}` });
  };

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
      const key = startDate ?? todayKey();
      const date = dateFromKey(key);
      pendingEndTime.current = timeFromParts(end);
      setPhase("start");
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
    <fieldset className="fds-field fds-date-time-range-picker">
      <legend className="fds-field__label">
        {label}
        {isRequired ? <span aria-hidden="true"> *</span> : null}
      </legend>
      <div
        ref={anchorRef}
        className={[
          "fds-date-time-picker__field",
          "fds-date-time-range-picker__field",
          message && "fds-date-time-picker__field--error",
          isDisabled && "fds-date-time-picker__field--disabled",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <input
          type={showTime ? "datetime-local" : "date"}
          className="fds-date-time-picker__input"
          aria-label={`${startLabel} ${showTime ? "date and time" : "date"}`}
          value={value.start}
          onChange={(event) => onChange({ ...value, start: event.target.value })}
          required={isRequired}
          disabled={isDisabled}
          readOnly={readOnly}
          aria-readonly={readOnly || undefined}
          aria-invalid={message ? true : undefined}
          aria-describedby={describedBy}
          min={min}
          max={max}
          name={startName}
          step={showTime ? step : undefined}
          lang={locale}
        />
        <span className="fds-date-time-range-picker__separator" aria-hidden="true">
          →
        </span>
        <input
          type={showTime ? "datetime-local" : "date"}
          className="fds-date-time-picker__input"
          aria-label={`${endLabel} ${showTime ? "date and time" : "date"}`}
          value={value.end}
          onChange={(event) => onChange({ ...value, end: event.target.value })}
          required={isRequired}
          disabled={isDisabled}
          readOnly={readOnly}
          aria-readonly={readOnly || undefined}
          aria-invalid={message ? true : undefined}
          aria-describedby={describedBy}
          min={endMin}
          max={max}
          name={endName}
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
          aria-label={`Choose ${label.toLowerCase()}`}
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
        <div id={helpId} className={message ? "fds-field__error" : "fds-field__help"}>
          {messages.map((item, index) => (
            <div key={`${index}-${item}`}>{item}</div>
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
        <p className="fds-date-time-range-picker__instruction" role="status">
          Select {phase === "start" ? startLabel.toLowerCase() : endLabel.toLowerCase()} date
        </p>
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
                {cells.slice(row * 7, row * 7 + 7).map((key, column) => {
                  const endpoint = key === startDate || key === endDate;
                  const inRange = Boolean(
                    key && startDate && endDate && key > startDate && key < endDate,
                  );
                  return (
                    <td
                      key={key ?? `empty-${row}-${column}`}
                      aria-selected={endpoint || undefined}
                      data-in-range={inRange || undefined}
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
                          disabled={Boolean(
                            (minDate && key < minDate) || (maxDate && key > maxDate),
                          )}
                          onFocus={() => setFocusDate(key)}
                          onKeyDown={(event) => handleDayKeyDown(event, key)}
                          onClick={() => selectDate(key)}
                        >
                          {Number(key.slice(8, 10))}
                        </button>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {showTime ? <div className="fds-date-time-range-picker__times">
          <label className="fds-field">
            <span className="fds-field__label">{startLabel} time</span>
            <span className="fds-date-time-picker__time-field">
              <input
                type="time"
                className="fds-date-time-picker__time-input"
                value={start ? timeFromParts(start) : ""}
                onChange={(event) => setTime("start", event.target.value)}
                disabled={!startDate || isDisabled}
                readOnly={readOnly}
                step={step}
              />
              {timezone ? <span className="fds-date-time-picker__timezone">{timezone}</span> : null}
            </span>
          </label>
          <label className="fds-field">
            <span className="fds-field__label">{endLabel} time</span>
            <span className="fds-date-time-picker__time-field">
              <input
                type="time"
                className="fds-date-time-picker__time-input"
                value={end ? timeFromParts(end) : ""}
                onChange={(event) => setTime("end", event.target.value)}
                disabled={!endDate || isDisabled}
                readOnly={readOnly}
                step={step}
              />
              {timezone ? <span className="fds-date-time-picker__timezone">{timezone}</span> : null}
            </span>
          </label>
        </div> : null}
      </div>
    </fieldset>
  );
}
