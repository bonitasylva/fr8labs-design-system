---
name: Fr8Labs Design System
description: Operational interface foundations for clear, dependable freight workflows.
colors:
  route-blue: "#0067e7"
  active-route-blue: "#023c9b"
  accent-blue: "#008de4"
  navy-ink: "#002245"
  secondary-ink: "#3f556b"
  quiet-text: "#5e758d"
  canvas: "#ffffff"
  mist-surface: "#f6f8fb"
  hover-surface: "#eef2f6"
  border: "#c8d2dc"
  subtle-border: "#e3eaf1"
  success-ink: "#193b2d"
  warning-ink: "#4f3422"
  error-red: "#c8393a"
typography:
  title:
    fontFamily: "IBM Plex Sans Condensed, Arial Narrow, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "28px"
  body:
    fontFamily: "IBM Plex Sans Condensed, Arial Narrow, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  data:
    fontFamily: "IBM Plex Sans Condensed, Arial Narrow, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "18px"
  label:
    fontFamily: "IBM Plex Sans Condensed, Arial Narrow, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "16px"
rounded:
  control: "4px"
  pill: "999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "24px"
components:
  button-primary:
    backgroundColor: "{colors.route-blue}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "32px"
  button-secondary:
    backgroundColor: "{colors.mist-surface}"
    textColor: "{colors.navy-ink}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "32px"
  button-tertiary:
    backgroundColor: "transparent"
    textColor: "{colors.navy-ink}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "32px"
  field-default:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.navy-ink}"
    rounded: "{rounded.control}"
    padding: "0 8px"
    height: "32px"
  panel-default:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.control}"
    padding: "12px"
---

# Design System: Fr8Labs Design System

## Overview

**Creative North Star: "Operational Precision"**

FDS is a compact interface system for freight work that must stay legible while people review records, act on exceptions, and move work forward. Its visual language is deliberate rather than decorative: narrow, highly readable type; a small spacing scale; clear borders; and a single blue action signal make dense operational screens calm to scan.

The system is flat by default, with tactile feedback reserved for controls and overlays. That makes an action feel responsive without turning the application into a stack of floating cards. Route Blue marks meaningful action and focus; dark navy text carries the working content; pale neutral surfaces separate information without weakening hierarchy.

**Key Characteristics:**

- Compact semantic typography for forms, tables, and record details.
- Route Blue is reserved for action, focus, and selected state.
- Borders and tonal surfaces establish structure before elevation.
- Controls respond with light depth and clear state changes.

## Colors

Route Blue is the system's controlled signal within a cool navy-and-mist operational palette.

### Primary

- **Route Blue:** primary actions, keyboard focus, selected controls, and active table interaction.
- **Active Route Blue:** pressed primary actions and active navigation text.
- **Accent Blue:** brand accent where a lighter action signal is required.

### Neutral

- **Navy Ink:** default text, dark tooltips, and the system's strongest reading anchor.
- **Secondary Ink:** supporting text and non-selected tab labels.
- **Quiet Text:** lower-emphasis field, status, and metadata content.
- **Canvas:** default page, field, and container surface.
- **Mist Surface:** quiet grouping, secondary controls, and disabled backgrounds.
- **Hover Surface:** hover feedback for secondary actions, tabs, and date selection.
- **Border / Subtle Border:** the structural grid for fields, panels, tables, and section dividers.

### Feedback

- **Success Ink:** approved and paid states.
- **Warning Ink:** pending and blocked states.
- **Error Red:** rejected, overdue, invalid, and dangerous actions.

**The One Signal Rule.** Use Route Blue for actionable or selected UI only; it should never become a general decoration color.

## Typography

**Display Font:** IBM Plex Sans Condensed, with Arial Narrow and Arial fallbacks.

**Character:** Condensed sans-serif keeps operational labels and data legible in compact spaces. The semantic scale moves from metadata and labels to page titles without introducing a second display voice.

### Hierarchy

- **Title:** page and section hierarchy; semibold and concise.
- **Body:** default instructional and workflow text.
- **Data:** dense table, summary, and transactional content.
- **Label:** field labels, table headers, and structured metadata; semibold where it defines hierarchy.

**The Compact Measure Rule.** Use the shared semantic roles instead of enlarging body text to create hierarchy; reserve larger headline treatment for Storybook's orientation pages.

## Layout

FDS uses a four-step working rhythm inside a five-step spacing scale. Core forms and reading content remain bounded, while operational lists can fill their container and scroll horizontally when that protects column meaning. Page headers and filter bars wrap rather than compress controls below a usable width; drawers become edge-to-edge on narrow viewports.

**The Meaning-First Wrap Rule.** Preserve labels, field targets, and table columns when space narrows. Wrap actions and fields before reducing text or creating ambiguous icon-only controls.

## Elevation & Depth

The system is tactile but controlled. Containers and panels rely on borders and tonal contrast at rest; interactive primary controls carry a light control shadow, while popovers and overlays use a stronger layered shadow to separate an active task from the underlying workflow. Hover, press, and focus states provide the main sense of response.

### Shadow Vocabulary

- **Control lift:** subtle depth on primary interactive controls.
- **Overlay lift:** stronger, compact shadow for popovers and calendar surfaces.

**The Earned Elevation Rule.** Persistent panels stay structurally flat. Add depth only when a control is actionable or a layer must clearly sit above the current task.

## Shapes

Gently squared geometry gives the system a precise, workmanlike character. Controls, panels, fields, status badges, and overlays share a small corner radius; only compact status chips, switch tracks, and date selections use the full pill shape. Borders are thin and consistently visible, making form and table boundaries explicit without heavy dividers.

## Components

### Buttons

- **Character:** tactile and confident, never oversized or ornamental.
- **Primary:** Route Blue action surface with inverse text and light control lift; its pressed state deepens to Active Route Blue.
- **Secondary:** Mist Surface, visible border, dark text, and no resting shadow.
- **Tertiary:** transparent background for lower-emphasis actions; gains Hover Surface on interaction.
- **Danger:** quiet neutral resting treatment that reveals Error Red at hover, avoiding permanent visual alarm.
- **Focus:** every button has a clearly offset Route Blue focus ring; disabled actions retain their label but reduce opacity.

### Inputs / Fields

- **Style:** Canvas field surface, visible field border, and compact horizontal padding.
- **Focus:** a clearly offset Route Blue focus ring.
- **Error / Disabled:** error changes the field border; disabled and read-only fields move to Mist Surface with quieter text.

### Cards / Containers

- **Corner Style:** shared control radius.
- **Background:** Canvas surface with a visible Border edge.
- **Shadow Strategy:** flat at rest; hierarchy comes from borders, spacing, and headers.
- **Internal Padding:** the middle step of the spacing rhythm.

### Status Badges

- **Style:** compact pill-like labels with an outlined, mostly Canvas surface.
- **State:** border and text communicate neutral, success, warning, or danger meaning; do not rely on color without the text label.

### Navigation

- **Tabs:** a quiet text baseline with Hover Surface feedback. The selected tab uses stronger type and a Route Blue inset indicator.
- **Responsive behavior:** labels wrap when required; dense task actions wrap before losing their text labels.

## Do's and Don'ts

### Do:

- **Do** use semantic color, type, spacing, and component tokens rather than primitive values in component code.
- **Do** make action, selected, and keyboard-focus states unmistakable with Route Blue and visible focus treatment.
- **Do** keep operational surfaces compact, bordered, and readable at narrow widths.
- **Do** use tactile depth for interactive controls and active overlays only.

### Don't:

- **Don't** use Route Blue as a general decorative background or a substitute for hierarchy.
- **Don't** create floating card stacks where a border or tonal surface already explains grouping.
- **Don't** remove visible labels, keyboard focus, or status text to make a dense workflow look cleaner.
- **Don't** bypass the shared 4px-based spacing and small-radius form language with one-off visual treatments.
