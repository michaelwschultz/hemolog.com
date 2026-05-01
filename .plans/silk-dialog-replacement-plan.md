# Plan to Replace Current Dialog Popups with Silk Library

## Overview
The current application uses custom modal implementations for dialogs such as treatment logging and feedback submission. These modals are built using plain CSS with fixed positioning, backdrop overlays, and custom styling. The goal is to replace these with the Silk library's dialog components to improve consistency, accessibility, and responsiveness across desktop and mobile views.

## Current Modal Implementations Identified
1. **TreatmentModal** (`src/components/home/treatmentModal.tsx`)
   - Used for logging treatments (prophy, bleed, preventative, monoclonal antibody)
   - Custom modal with backdrop, white rounded container, form inputs, and action buttons
   - Handles complex form state with Formik

2. **FeedbackModal** (`src/components/home/feedbackModal.tsx`)
   - Used for user feedback submission
   - Similar custom modal structure with textarea input and submit/cancel buttons

Both modals follow the same pattern:
- Conditional rendering based on `visible` prop
- Fixed positioning with `fixed inset-0` for full-screen overlay
- Semi-transparent black backdrop (`bg-black bg-opacity-50`)
- Centered white rounded container (`bg-white rounded-lg max-w-md w-full`)
- Scrollable content with max height
- Action buttons in footer with border separator

## Prerequisites
- Obtain detailed Silk library documentation from https://silkhq.notion.site/Silk-Getting-started-1a6894277f3a80788ccec0c94e7e4244
- Confirm Silk's Dialog component API, props, and styling capabilities
- Verify Silk's support for React, TypeScript, and mobile responsiveness

## Implementation Plan

### Phase 1: Setup and Research
1. **Install Silk Library**
   - Add Silk to package.json dependencies
   - Update pnpm-lock.yaml
   - Verify compatibility with existing React/Next.js setup

2. **Study Silk Dialog Component**
   - Review Dialog component props and API
   - Understand theming and customization options
   - Test basic Dialog implementation in a sandbox component
   - Confirm mobile responsiveness and accessibility features

### Phase 2: Refactor TreatmentModal
1. **Import Silk Dialog Components**
   - Replace custom modal JSX with Silk Dialog
   - Map current props to Silk Dialog props

2. **Adapt Form Structure**
   - Ensure form content fits within Silk Dialog layout
   - Maintain existing Formik integration
   - Preserve all form fields and validation

3. **Update Styling**
   - Remove custom CSS classes for modal container
   - Apply Silk theming if needed
   - Ensure consistent appearance with app design

4. **Test Functionality**
   - Verify form submission works
   - Check modal open/close behavior
   - Test on desktop and mobile viewports

### Phase 3: Refactor FeedbackModal
1. **Apply Same Pattern as TreatmentModal**
   - Use Silk Dialog component
   - Maintain feedback form functionality

2. **Update Component Props**
   - Ensure `visible` and `setVisible` props work with Silk

3. **Styling and Theming**
   - Match Silk Dialog styling to existing design
   - Ensure proper spacing and layout

### Phase 4: Testing and Polish
1. **Cross-Device Testing**
   - Test on various desktop screen sizes
   - Test on mobile devices and browsers
   - Verify touch interactions on mobile

2. **Accessibility Audit**
   - Ensure Silk Dialog meets WCAG guidelines
   - Test keyboard navigation
   - Verify screen reader compatibility

3. **Performance Check**
   - Monitor bundle size impact
   - Ensure no regression in modal open/close performance

4. **Code Cleanup**
   - Remove unused custom modal CSS
   - Update component documentation
   - Add TypeScript types for Silk components if needed

## Potential Challenges
- **API Differences**: Silk Dialog API may differ from current custom implementation
- **Styling Conflicts**: Existing Tailwind classes may conflict with Silk's styling
- **Form Integration**: Ensuring Formik works seamlessly with Silk Dialog
- **Mobile Responsiveness**: Confirming Silk handles mobile layouts better than current implementation

## Success Criteria
- All existing modal functionality preserved
- Improved user experience on mobile devices
- Better accessibility compliance
- Consistent dialog behavior across the application
- No breaking changes to existing modal usage in components

## Rollback Plan
- Keep original modal implementations as backup
- Ability to quickly revert if Silk integration issues arise
- Document any breaking changes for future reference

## Next Steps
1. Provide Silk documentation content for detailed API understanding
2. Proceed with Phase 1 setup once documentation is available
3. Begin implementation with TreatmentModal as the first component
