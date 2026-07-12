# N-GEMS Official Color Scheme

## Core Colors

### Registry Navy `#0B2545`
**Primary color for headers, main text, and professional elements**
- Used for: Headers, primary text, navbar background, button text
- Tailwind: `navy-900`, `navy` (in components)
- CSS: `bg-navy`, `text-navy`, `text-navy-900`

### Clinical Blue `#146C94`
**Primary accent for interactive elements and focus states**
- Used for: Links, focus states, icons, required field marks, call-to-action accents
- Tailwind: `clinical-500`, `clinical-600`
- CSS: `bg-clinical-600`, `text-clinical-600`, `hover:text-clinical-600`

### Health Green `#1B998B`
**Secondary accent for success states and positive feedback**
- Used for: Success states, "Pending" checkmarks, secondary accents, success badges
- Tailwind: `health-600`, `health-700`, `health-500`
- CSS: `bg-health-600`, `text-health-600`, `from-health-600 to-emerald-600`

### Seal Gold `#B08D57`
**Official registry touches, used sparingly**
- Used for: Official badges, "Official Portal" indicators, Hospital ID stamp boxes
- Tailwind: `seal-500`, `seal-600`, `seal-400`
- CSS: `bg-seal-600`, `text-seal-600`, `border-seal-200`

---

## Component Usage Guide

### Navbar
- Background: `bg-white` with subtle border
- Text: `text-navy`
- Active/Hover: `text-health-600` or `text-clinical-600`
- Accent buttons: Gradient `from-health-600 to-emerald-600`

### Buttons
- Primary: `bg-health-600` or gradient `from-health-600 to-emerald-600`
- Secondary: `text-clinical-600` or outline with `border-clinical-600`
- Text: `text-white` (on colored backgrounds)
- Hover: Darker shade or `shadow-lg`

### Cards
- Background: `bg-white`
- Border: `border-slate-100` or `border-slate-150`
- Headers: `text-navy`
- Accents: Icons in `health-600` or `clinical-600` with colored backgrounds

### Links
- Text: `text-clinical-600`
- Hover: `hover:text-clinical-700` or `hover:underline`

### Forms
- Required marks: `text-clinical-600`
- Focus states: `border-clinical-600` or `ring-clinical-500`
- Labels: `text-navy`
- Help text: `text-navy/60`

### Alerts/Banners
- Demo accounts: `bg-amber-50` with `border-amber-200`
- Success: `bg-health-50` with `border-health-200` or `text-health-600`
- Error: `bg-rose-50` with `border-rose-200` or `text-rose-600`
- Info: `bg-clinical-50` with `border-clinical-200`

### Sidebar
- Background: `bg-white`
- Section labels: `text-navy/40`
- Active item: `bg-health-50` with `text-health-600`
- Inactive items: `text-navy/60`

---

## Implementation Examples

### Tailwind CSS Colors
```
navy: {
  50: "#EEF2F7",
  100: "#D7E1EC",
  300: "#7C93AE",
  600: "#294A6D",
  700: "#193A5C",
  800: "#122C49",
  900: "#0B2545", // Main registry navy
}

clinical: {
  50: "#EAF5F9",
  100: "#CDE9F1",
  200: "#9DD3E3",
  400: "#2C8FB5",
  500: "#146C94", // Main clinical blue
  600: "#0F5A7C",
  700: "#0C4863",
}

health: {
  50: "#E9F8F6",
  100: "#CBEEE9",
  400: "#3CB6A8",
  500: "#1B998B", // Main health green
  600: "#158176",
  700: "#116A61",
}

seal: {
  50: "#F8F3EA",
  200: "#E4D2AE",
  400: "#C4A15F",
  500: "#B08D57", // Main seal gold
  600: "#8F7245",
}
```

---

## Color Accessibility

- Navy (`#0B2545`) provides strong contrast on white/light backgrounds
- Clinical Blue (`#146C94`) is accessible for text on white backgrounds
- Health Green (`#1B998B`) is accessible for text on white backgrounds
- Seal Gold (`#B08D57`) should primarily be used for backgrounds/accents, not small text

---

## Components Already Updated

- ✅ PharmacyNavbar
- ✅ PharmacySidebar
- ✅ PharmacyDashboardStats
- ✅ PharmacyCard
- ✅ Login Pages (Hospital & Staff)
- ✅ Demo Accounts Info Banner
- ✅ DashboardCard components
- ✅ Reception components
- ✅ Laboratory components

All components are using the official N-GEMS color scheme throughout the application.
