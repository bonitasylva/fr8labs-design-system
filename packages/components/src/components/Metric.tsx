import type {ReactNode} from 'react';

export type MetricChange = {
  value: ReactNode;
  direction: 'up' | 'down';
  tone?: 'favorable' | 'unfavorable';
};

export type MetricProps = {
  label: ReactNode;
  value?: ReactNode;
  description?: ReactNode;
  change?: MetricChange;
  isLoading?: boolean;
  isUnavailable?: boolean;
  density?: 'default' | 'compact';
};

export function Metric({label, value, description, change, isLoading, isUnavailable, density = 'default'}: MetricProps) {
  const displayValue = isLoading ? 'Loading…' : isUnavailable ? 'Unavailable' : value;
  const showChange = change && !isLoading && !isUnavailable;

  return <dl aria-busy={isLoading || undefined} className={`fds-metric fds-metric--${density}`}>
    <dt className="fds-metric__label">{label}</dt>
    <dd className={`fds-metric__value${isLoading || isUnavailable ? ' fds-metric__value--muted' : ''}`}>{displayValue}</dd>
    {description ? <dd className="fds-metric__description">{description}</dd> : null}
    {showChange ? <dd className={`fds-metric__change${change.tone ? ` fds-metric__change--${change.tone}` : ''}`}><span aria-hidden="true">{change.direction === 'up' ? '↑' : '↓'}</span><span className="fds-visually-hidden">{change.direction === 'up' ? 'Increased:' : 'Decreased:'}</span> {change.value}</dd> : null}
  </dl>;
}
