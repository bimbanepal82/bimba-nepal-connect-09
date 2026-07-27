# Meta Tag Fixes for Bimba Nepal

## Changes Required

Apply these fixes to your `src/routes/__root.tsx` (or your root layout component) to fix the meta tags that were accidentally left from the template.

### 1. Remove @Lovable Twitter Site

**Find:**
```tsx
{
  name: 'twitter:site',
  content: '@Lovable',
},
```

**Delete this entry entirely.** It's a template artifact that should not be in production.

---

### 2. Update Author Meta Tag

**Find:**
```tsx
{
  name: 'author',
  content: 'Lovable Generated Project',
},
```

**Replace with:**
```tsx
{
  name: 'author',
  content: 'Bimba Nepal',
},
```

---

### 3. Update og:description

**Find:**
```tsx
{
  property: 'og:description',
  content: 'Lovable Generated Project',
},
```

**Replace with:**
```tsx
{
  property: 'og:description',
  content: 'Bimba Nepal - Connecting our community with essential information and services.',
},
```

---

### 4. Check description Meta Tag

**Find:**
```tsx
{
  name: 'description',
  content: 'Lovable Generated Project',
},
```

**Replace with:**
```tsx
{
  name: 'description',
  content: 'Bimba Nepal connects our community with essential information, notices, reports, and support services.',
},
```

---

### Example Root Meta Configuration

```tsx
export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'description',
        content: 'Bimba Nepal connects our community with essential information, notices, reports, and support services.',
      },
      {
        name: 'author',
        content: 'Bimba Nepal',
      },
      {
        property: 'og:title',
        content: 'Bimba Nepal',
      },
      {
        property: 'og:description',
        content: 'Bimba Nepal - Connecting our community with essential information and services.',
      },
      {
        property: 'og:image',
        content: 'https://bimba.org.np/og-image.png',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      // Note: @Lovable twitter:site tag has been removed
    ],
  }),
  // ... rest of your route
})
```

---

## Verification

After applying these changes, verify by:

1. Running `npm run build` to check for errors
2. Visiting your site and running: `view-source:https://bimba.org.np`
3. Searching for `Lovable` in the page source — it should not appear
4. Checking that author shows `Bimba Nepal`

## Why These Changes Matter

- **@Lovable in meta**: Exposes that the site was auto-generated; unprofessional for production
- **Correct author/description**: Improves SEO and social media sharing
- **og: tags**: Ensures proper preview when shared on Facebook, Twitter, Discord, etc.