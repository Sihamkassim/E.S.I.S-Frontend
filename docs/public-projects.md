# Public Projects Feature

## Overview
Implements a public-facing projects catalogue with:
- Featured projects hero grid (top 3 FEATURED status entries).
- Search + pagination for APPROVED and FEATURED projects.
- Project detail modal with media gallery & lightbox playback.
- Accessible keyboard navigation (Escape to close, Tab trapping).

## Data Sources
Backend endpoints (public):
- `GET /public/projects` list (approved + featured) with filters: `tag, team, stack, country, page, limit`.
- `GET /public/projects/:slug` project detail (includes media, tags, user profile).

## Store (`publicProjectsStore.ts`)
State:
- `projects: Project[]` full page list
- `featured: Project[]` derived subset where status === FEATURED
- `meta: { page, pages, limit, total }`
- `loading`, `error`
- `selected` detail record (with media)
- `detailLoading`

Actions:
- `fetch(params)` loads list + meta, extracts `featured` from response
- `fetchDetail(slug)` loads a single project (skips if already selected)
- `clearSelected()` resets detail state

## Components
### `FeaturedProjectCard`
- Large visual card with gradient overlay, subtle zoom hover, FEATURED badge.
- Click -> opens detail modal (sets `activeSlug`).

### `ProjectDetailModal`
- Two-column layout (cover + meta) + media gallery section.
- Media thumbs grid (image/video) -> launches `MediaLightbox` for immersive viewing.
- Focus trapped; ESC closes; initial focus on close button.

### `ProjectsPage`
Enhancements:
- Integrates `publicProjectsStore` instead of user project store.
- Featured section appears only on page 1 and when at least one featured exists (top 3 displayed).
- Grid cards redesigned (hover elevate + transitions).
- Detail modal rendered at root of page with `activeSlug` state.

## Lightbox (`MediaLightbox` Reuse)
- Passed `items` + `index` mapping from project's `media` array.
- Supports keyboard navigation (left/right arrows) and ESC close.

## Styling / Theming
- Dark & light mode support (utility classes with `dark:` variants).
- Gradient overlays and subtle transitions for visual polish.

## Accessibility
- All interactive cards are `<button>` elements with `aria-label`.
- Modal uses `role="dialog"` + `aria-modal="true"` and implements focus trap.
- ESC key closes modal; arrow keys in lightbox for navigation.

## Extension Points
- Add filter UI (tags, country, stack) by forwarding params into `fetch`.
- Add infinite scroll: replace pagination with intersection observer invoking `fetch` with next page & append.
- Add share/download actions inside modal (adjacent to close button toolbar).
- Add related projects carousel inside modal (query by overlapping tags/stack).

## Usage Example
```
const { fetch } = usePublicProjectsStore();
useEffect(()=> { fetch({ page:1, limit:12 }); }, []);
```

## Error Handling
- List and detail requests maintain separate loading flags.
- Non-fatal detail fetch errors surface via `error` state but keep list visible.

## Performance Considerations
- Media detail only fetched when user opens a project.
- Featured subset derived client-side (cheap filter on current page results). If global featured list needed, dedicated endpoint may be introduced.

## Future Improvements
1. Skeleton loaders for cards and media gallery.
2. Preload next/prev lightbox items for smoother navigation.
3. Analytics events on card open, media view.
4. Tag filter chips with active state & clear all.
5. SEO-friendly static route fallback (SSR path for slug pages if converting to Next.js).

---
This document reflects the implementation state after integrating the public projects showcase & detail UX.
