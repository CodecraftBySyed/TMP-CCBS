IMPORTANT: Local server required

Browsers block fetch() for local file:// requests due to CORS. To view this site correctly you must open it through a local web server (not by double-clicking index.html).

Options:
- VS Code: install and use the "Live Server" extension, then click "Go Live".
- Python: run `python -m http.server` in the `tmp-website` folder and open http://localhost:8000
- Any static host (Netlify, GitHub Pages, etc.)

Editing content
- To add a new machine: edit `data/machines.json` and append an object. Match `image` filename inside `images/machines/`.
- To add a gallery photo: edit `data/gallery.json` and append an object. Match `image` filename inside `images/gallery/`.
- To add a testimonial: edit `data/testimonials.json` and append an object.

Technical note in code: fetch() calls will fail when opened on file://; use a server.
