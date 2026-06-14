export const typography = {
  fontFamily: {
    heading: 'var(--font-heading)',
    body: 'var(--font-body)',
  },
  fontSize: {
    display: ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }], // 60px
    h1: ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }], // 48px
    h2: ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }], // 36px
    h3: ['1.875rem', { lineHeight: '1.2' }], // 30px
    h4: ['1.5rem', { lineHeight: '1.3' }], // 24px
    h5: ['1.25rem', { lineHeight: '1.3' }], // 20px
    h6: ['1.125rem', { lineHeight: '1.4' }], // 18px
    bodyLarge: ['1.125rem', { lineHeight: '1.5' }], // 18px
    bodyMedium: ['1rem', { lineHeight: '1.5' }], // 16px
    bodySmall: ['0.875rem', { lineHeight: '1.5' }], // 14px
    caption: ['0.75rem', { lineHeight: '1.5' }], // 12px
    label: ['0.875rem', { lineHeight: '1', letterSpacing: '0.02em' }], // 14px uppercase
    button: ['0.875rem', { lineHeight: '1.2' }], // 14px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;
