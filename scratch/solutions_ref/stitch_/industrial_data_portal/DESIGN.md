---
name: Industrial Data Portal
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fd'
  on-secondary-container: '#57657b'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001d31'
  on-tertiary-container: '#188ace'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d5e3fd'
  secondary-fixed-dim: '#b9c7e0'
  on-secondary-fixed: '#0d1c2f'
  on-secondary-fixed-variant: '#3a485c'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d31'
  on-tertiary-fixed-variant: '#004b73'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  data-mono:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin: 32px
  container-max: 1440px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered to project the stability and structural integrity of the steel industry. It adopts a **Corporate / Modern** aesthetic that prioritizes information density without sacrificing clarity. The brand personality is one of an authoritative industry veteran: serious, precise, and reliable. 

To evoke an emotional response of trust and efficiency, the visual language avoids trendy embellishments. Instead, it utilizes a rigorous alignment to a technical grid and a sophisticated interplay of cold industrial tones. This approach ensures that procurement officers and supply chain analysts feel they are interacting with a high-performance tool built for mission-critical industrial logistics.

## Colors

The palette is anchored in **Deep Industrial Blue** (#0F172A), representing the strength of graphite and steel. **Slate Gray** is used for secondary structural elements and UI controls, providing a technical, architectural feel. The background uses a "Clean White" (#F8FAFC) to ensure maximum contrast for data-heavy views.

For data visualization and status tracking, a high-chroma semantic set is used:
- **Emerald Green** (#059669) for positive market trends and supply availability.
- **Amber** (#D97706) for logistics delays or inventory warnings.
- **Sky Blue** (#0284C7) as a functional accent for interactive elements like links and primary actions.

## Typography

This design system utilizes **Inter** for all applications due to its exceptional legibility in technical contexts. The typographic scale is optimized for reading complex specifications and market pricing tables. 

A specific "data-mono" style is utilized for numerical figures and technical specifications to ensure alignment and readability in dense tables. Headlines are kept tight and bold to establish a clear hierarchy, while body copy maintains a generous line height to reduce eye fatigue during long reading sessions.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model for desktop views, centered at a maximum container width of 1440px to ensure data density remains manageable. A 12-column system is used with 24px gutters, providing a robust framework for card-based dashboards.

Spacing is based on a 4px base unit, creating a rhythmic consistency throughout the interface. Vertical "stacks" are used to group related technical data, with larger gaps (32px) separating distinct content blocks or chart sections.

## Elevation & Depth

Visual hierarchy in the design system is achieved through **Tonal Layers** and subtle **Ambient Shadows**. The primary workspace sits on a light gray base (#F1F5F9), with white cards representing the "active" layer.

Shadows are used sparingly; they are extra-diffused with low opacity (10-15%) to avoid looking "soft" or "playful." Instead, they serve to lift critical data summaries and interactive modals above the base information layer. Depth is also conveyed through the use of 1px borders in Slate Gray (#E2E8F0) to define table boundaries and card edges, reinforcing a sense of precision.

## Shapes

The design system employs a **Soft** shape language (Level 1). Elements such as buttons, input fields, and cards feature a 0.25rem (4px) corner radius. This subtle rounding maintains a professional, rigid industrial feel while preventing the interface from feeling dangerously sharp. Larger containers like dashboard cards may occasionally use `rounded-lg` (8px) to soften the perimeter of complex data visualizations, but the overall geometry remains disciplined and architectural.

## Components

### Buttons & Inputs
Buttons are rendered with solid fills for primary actions and "ghost" styles (slate borders) for secondary actions. Input fields use a high-contrast white background with a 1px slate border, which shifts to industrial blue on focus. 

### Cards & Data Visualization
Cards are the primary container for data. They feature a clean white background, a subtle border, and no header background color to keep the focus on the content. Charts should use the defined emerald and amber accents, with grid lines kept in a very faint gray to ensure the data points remain the focal point.

### Lists & Tables
Tables are high-density. Row highlighting on hover is mandatory for data tracking. Column headers use the `label-sm` style with a subtle background tint to distinguish them from the data rows.

### Chips & Status Indicators
Status chips use a "light-fill" approach: a desaturated version of the semantic color for the background with high-contrast text on top (e.g., light emerald background with dark emerald text). This ensures status visibility without overwhelming the visual hierarchy.