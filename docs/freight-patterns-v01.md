# Freight Patterns v0.1

## Shipment Job Pattern

Common needs:

- Shipment identifiers and status.
- Party details: shipper, consignee, agent, carrier.
- Mode, route, ETD/ETA, origin/destination.
- Linked HBL/MBL records.
- Documents, invoices, and exceptions.

Template candidate:

- Shipment detail shell with summary header, tabs, status timeline, documents, and charge table.

## HBL/MBL Pattern

Common needs:

- Parent/child relationship.
- Document status.
- Cargo and container details.
- Print/preview action.
- Audit trail.

Template candidate:

- Bill of lading workspace with metadata, cargo table, document preview, and action drawer.

## Invoice And Charge Pattern

Common needs:

- AR/AP separation.
- Charge lines.
- Currency and exchange rate.
- Tax/discount fields.
- Approval and payment state.
- Export/print preview.

Template candidate:

- Invoice review page with charge table, totals, approval state, and document preview.

## Approval Pattern

Common needs:

- Current owner.
- Required action.
- Reason/comments.
- History.
- Exception state.

Template candidate:

- Approval drawer usable from shipment, invoice, document, and rate workflows.

## Reporting Pattern

Common needs:

- Filters.
- Saved views later.
- Data table.
- Export.
- Empty/loading/error states.

Template candidate:

- Report page shell with filter bar, summary metrics, and table.

## Sample Data Rule

Use fake, non-sensitive freight data only. Do not use real customer, shipment, invoice, or financial data in prototypes or AI prompts.

