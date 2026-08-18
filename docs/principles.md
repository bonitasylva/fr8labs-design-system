---
title: Fr8Labs Design System v1 Design Principles
status: approved
approved: 2026-08-15
approver: FDS v1 final approver
---

# Fr8Labs Design System v1 Design Principles

## 1. Dense But Legible

Freight operators work in tables, statuses, forms, and documents all day. The UI should fit real operational density without becoming cramped.

## 2. Status First

Shipments, invoices, documents, approvals, and exceptions need clear status treatment. Status should never rely on color alone.

## 3. Audit-Friendly

Accounting and operations workflows need traceability. Show key identifiers, timestamps, ownership, and state changes where they affect decisions.

## 4. Fast Repeated Work

Common paths should support keyboard use, predictable filters, saved views later, compact controls, and low-friction review.

## 5. Plain Business Language

Use freight terms consistently: shipment job, HBL, MBL, invoice, charge, AR, AP, approval, document, carrier, consignee, shipper.

## 6. Accessible By Default

Use visible labels, focus states, contrast-safe status treatment, keyboard paths, and readable text. Icon-only actions need accessible names.

## 7. Component Decisions Serve Workflows

Do not choose components because they look modern. Choose components because they make shipment, accounting, document, and approval work clearer.

## 8. Reference, Do Not Copy

Legacy screens and Figma files may explain business behavior. They should not define the new visual foundation.

## 9. Stable Fr8Labs Contracts

Public FDS APIs must be stable, composable, and independent of internal implementation choices. Consumers use Fr8Labs components, icons, and tokens, not MUI, shadcn, Radix, or other internal primitives directly.

## 10. Reuse Before Variation

Use an approved component or composition before creating a local variant. Exceptions require workflow evidence and approval; repeated improvements return through the FDS proposal process.

## Approval Gate

Every proposed token, component, template, Studio composition rule, MCP response contract, and adoption recipe must identify the principles it satisfies. A proposal that conflicts with an approved principle cannot enter an FDS release without an explicit principle amendment or approved exception.
