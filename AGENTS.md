<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

<!-- LOVABLE:BEGIN (project rules) -->
- Owner-uploaded videos/photos live in the private `media` storage bucket and are served
  through the `/api/public/media/$` server route (302 to a signed URL), because public
  buckets are blocked in this workspace. Upload helper: `src/lib/media-upload.ts`.
  URLs stored in the database start with `/api/public/media/`; `isVideoFile()` in
  TrendingVideos.tsx treats that path (or a direct video extension) as an auto-playing clip.
<!-- LOVABLE:END -->
