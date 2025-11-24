# 🖥️📱 Responsive design on GFM

## ⚠️ Issue
**GitHub Flavored Markdown (GFM)** has a syntax that limits the possibilities for designing advanced Markdown layouts due to significant security concerns : 
* **CSS spreadsheets and `<style>` elements are not allowed.**
* **JavaScript code and `<script>` elements are not allowed.**

Indeed, that would cause obvious **XSS** or **clickjacking** security issues.

## ✅ Solutions

While the first idea is that it isn't possible to create a responsive and advanced Markdown design in GFM because of the related security issues, there are still a lot of **tricks** that can be used to achieve such design. Here are the tricks that you use:

### Responsive sizing, positioning and theming

> [!IMPORTANT]
> The "**viewBox**" attribute resizes and scales SVG images relative to the defined **"viewBox" coordinates and the natural dimensions** of the SVG image.  
> If you want SVG images to **fit and adjust to the size of the parent preview container** when you set custom "**width**" or "**height**" attributes, **you must remove the "viewBox" attribute from the SVG image**. 

#### Responsive sizing with `<img>`
- `<img>` supports `width` and `height` attributes.
  - Example: `<img src="foo.svg" width="100%" alt="...">` **stretches the image to the parent container width**. In GitHub, using `width="100%"` will make the image fill the preview container width.

<details>
<summary>Examples (expand)</summary>

```html
<!-- This will stretch the provided image according to the fixed "width" and "height" attributes -->
<img width="64" height="32" src="metadata-assets/responsive-md/placeholders/32x32-0078D4-notext.svg" alt="fixed-size" />
```

<img width="64" height="32" src="metadata-assets/responsive-md/placeholders/32x32-0078D4-notext.svg" alt="fixed-size" />

```html
<!-- This will stretch the provided image to the full parent container width with a fixed and defined height -->
<img width="100%" height="32" src="metadata-assets/responsive-md/placeholders/32x32-0078D4-notext.svg" alt="full-parent-width" />
```

<img width="100%" height="32" src="metadata-assets/responsive-md/placeholders/32x32-0078D4-notext.svg" alt="full-parent-width" />

```html
<!-- This will stretch the image to the full parent container width maintaining aspect ratio -->
<img width="100%" src="metadata-assets/responsive-md/placeholders/32x32-0078D4-notext.svg" alt="full-width-height-ratio-preserved" />
```
<img width="100%" src="metadata-assets/responsive-md/placeholders/32x32-0078D4-notext.svg" alt="full-width-height-ratio-preserved" />
</details>

#### Responsive & adaptive theming with `<picture>`

> [!NOTE]
> Color scheme selection will be based on the GitHub user UI settings.

- Use `<picture>` with `<source>` elements to provide multiple resolutions and theme variants.
  - Serve **different resolutions** via `media` queries (e.g., `(max-width: 600px)`).
  - Provide **dark/light variants** using `media="(prefers-color-scheme: dark)"` and `media="(prefers-color-scheme: light)"`.

<details>
<summary>Examples (expand)</summary>

```html
<!-- Change shown image based on device screen width with media queries -->
<picture>
  <source media="(max-width: 512px)" srcset="metadata-assets/responsive-md/placeholders/256x256-0078D4-FFFFFF.svg">
  <source media="(min-width: 513px)" srcset="metadata-assets/responsive-md/placeholders/512x256-0078D4-FFFFFF.svg">
  <img src="metadata-assets/responsive-md/placeholders/256x256-0078D4-FFFFFF.svg" alt="picture-responsive" />
</picture>
```

<picture>
  <source media="(max-width: 512px)" srcset="metadata-assets/responsive-md/placeholders/256x256-0078D4-FFFFFF.svg">
  <source media="(min-width: 513px)" srcset="metadata-assets/responsive-md/placeholders/512x256-0078D4-FFFFFF.svg">
  <img src="metadata-assets/responsive-md/placeholders/256x256-0078D4-FFFFFF.svg" alt="picture-responsive" />
</picture>

```html
<!-- Switch between dark and light themes -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="metadata-assets/responsive-md/placeholders/256x256-000000-FFFFFF.svg">
  <source media="(prefers-color-scheme: light)" srcset="metadata-assets/responsive-md/placeholders/256x256-FFFFFF-000000.svg">
  <img src="metadata-assets/responsive-md/placeholders/256x256-000000-FFFFFF.svg" alt="picture-theme" />
</picture>
```

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="metadata-assets/responsive-md/placeholders/256x256-000000-FFFFFF.svg">
  <source media="(prefers-color-scheme: light)" srcset="metadata-assets/responsive-md/placeholders/256x256-FFFFFF-000000.svg">
  <img src="metadata-assets/responsive-md/placeholders/256x256-000000-FFFFFF.svg" alt="picture-theme" />
</picture>

```html
<!-- Switch between dark and light themes, with full-width responsive rectangle design -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="metadata-assets/responsive-md/placeholders/FULLx32-000000-FFFFFF.svg">
  <source media="(prefers-color-scheme: light)" srcset="metadata-assets/responsive-md/placeholders/FULLx32-FFFFFF-000000.svg">
  <img width="100%" height="32" src="metadata-assets/responsive-md/placeholders/FULLx32-000000-FFFFFF.svg" alt="picture-theme-responsive" />
</picture>
```

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="metadata-assets/responsive-md/placeholders/FULLx32-000000-FFFFFF.svg">
  <source media="(prefers-color-scheme: light)" srcset="metadata-assets/responsive-md/placeholders/FULLx32-FFFFFF-000000.svg">
  <img width="100%" height="32" src="metadata-assets/responsive-md/placeholders/FULLx32-000000-FFFFFF.svg" alt="picture-theme-responsive" />
</picture>
</details>

> A lot of media queries can be used: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Using

#### Alignment
- Align `<img>` and `<p>` with the `align` property: **left, center, right**

<details>
<summary>Examples (expand)</summary>

```md
### align="left"
<img align="left" src="metadata-assets/responsive-md/placeholders/128x24-0078D4-FFFFFF.svg" alt="align-left" />
Left alignment

### align="right"
<img align="right" src="metadata-assets/responsive-md/placeholders/128x24-0078D4-FFFFFF.svg" alt="align-right" />
Right alignment
```

### align="left"
<img align="left" src="metadata-assets/responsive-md/placeholders/128x24-0078D4-FFFFFF.svg" alt="align-left" />
Left alignment

### align="right"
<img align="right" src="metadata-assets/responsive-md/placeholders/128x24-0078D4-FFFFFF.svg" alt="align-right" />
Right alignment

```html
<p align="left">
  <img src="metadata-assets/responsive-md/placeholders/128x128-0078D4-FFFFFF.svg" alt="p-align-left" />
  <img src="metadata-assets/responsive-md/placeholders/128x128-0078D4-FFFFFF.svg" alt="p-align-left" />
</p>

<p align="center">
  <img src="metadata-assets/responsive-md/placeholders/128x128-0078D4-FFFFFF.svg" alt="p-align-center" />
  <img src="metadata-assets/responsive-md/placeholders/128x128-0078D4-FFFFFF.svg" alt="p-align-center" />
</p>

<p align="right">
  <img src="metadata-assets/responsive-md/placeholders/128x128-0078D4-FFFFFF.svg" alt="p-align-right" />
  <img src="metadata-assets/responsive-md/placeholders/128x128-0078D4-FFFFFF.svg" alt="p-align-right" />
</p>
```

<p align="left">
  <img src="metadata-assets/responsive-md/placeholders/128x128-0078D4-FFFFFF.svg" alt="p-align-left" />
  <img src="metadata-assets/responsive-md/placeholders/128x128-0078D4-FFFFFF.svg" alt="p-align-left" />
</p>

<p align="center">
  <img src="metadata-assets/responsive-md/placeholders/128x128-0078D4-FFFFFF.svg" alt="p-align-center" />
  <img src="metadata-assets/responsive-md/placeholders/128x128-0078D4-FFFFFF.svg" alt="p-align-center" />
</p>

<p align="right">
  <img src="metadata-assets/responsive-md/placeholders/128x128-0078D4-FFFFFF.svg" alt="p-align-right" />
  <img src="metadata-assets/responsive-md/placeholders/128x128-0078D4-FFFFFF.svg" alt="p-align-right" />
</p>

```html
<table align="left">
  <thead>
    <tr>
      <th>First header</th>
      <th>Second header</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Content</td>
      <td>Content</td>
    </tr>
    <tr>
      <td>Content</td>
      <td>Content</td>
    </tr>
  </tbody>
</table>

<table align="center">
  <thead>
    <tr>
      <th>First header</th>
      <th>Second header</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Content</td>
      <td>Content</td>
    </tr>
    <tr>
      <td>Content</td>
      <td>Content</td>
    </tr>
  </tbody>
</table>

<table align="right">
  <thead>
    <tr>
      <th>First header</th>
      <th>Second header</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Content</td>
      <td>Content</td>
    </tr>
    <tr>
      <td>Content</td>
      <td>Content</td>
    </tr>
  </tbody>
</table>
```

<table align="left">
  <thead>
    <tr>
      <th>First header</th>
      <th>Second header</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Content</td>
      <td>Content</td>
    </tr>
    <tr>
      <td>Content</td>
      <td>Content</td>
    </tr>
  </tbody>
</table>

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<table align="center">
  <thead>
    <tr>
      <th>First header</th>
      <th>Second header</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Content</td>
      <td>Content</td>
    </tr>
    <tr>
      <td>Content</td>
      <td>Content</td>
    </tr>
  </tbody>
</table>

<br/>

<table align="right">
  <thead>
    <tr>
      <th>First header</th>
      <th>Second header</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Content</td>
      <td>Content</td>
    </tr>
    <tr>
      <td>Content</td>
      <td>Content</td>
    </tr>
  </tbody>
</table>

<br/>
<br/>
<br/>
<br/>
<br/>

</details>

---

### SVG-based techniques

Because of their **vector** nature, SVG files allow for **very advanced layouts**. Keep markup inside the `.svg` file and reference it from Markdown inside a `img` element.

#### Styling (`<style>` inside SVG)

> [!WARNING]
> Due to a [**WebKit long-lasting issue**](https://bugs.webkit.org/show_bug.cgi?id=199134), the **prefers-color-scheme** media query **doesn't work when embedded inside a SVG in Safari**.  
> The `<style>` element work, but not the **prefers-color-scheme** media query.  
> **A workaround exists in the GFM syntax for maximum cross-browser interoperability**.  
> Please refer to the [**Responsive & adaptive theming with `<picture>`**](#responsive--adaptive-theming-with-picture) section.

- **Styling** inside the SVG (`<style>`) applies only within the SVG. Consequence ? This is not stripped out by GFM processor.

<details>
<summary>Example (expand)</summary>

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100">
  <style>
    .title {
      font: bold 20px 'Segoe UI', sans-serif;
    }

    @media (prefers-color-scheme: dark) {
      .title {
        fill: #FFFFFF;
      }
    }

    @media (prefers-color-scheme: light) {
      .title {
        fill: #000000;
      }
    }
  </style>

  <text class="title" x="10" y="55">Styled inside SVG</text>
</svg>
```

<img src="metadata-assets/responsive-md/svg-techniques/style.svg" alt="svg-styling" />

</details>

#### HTML inside SVG (`<foreignObject>`)
- Use `<foreignObject>` to include **HTML** inside the SVG.

<details>
<summary>Example (expand)</summary>

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100">
  <style>
    .container {
      font-family: 'Segoe UI', sans-serif;

      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;

      background-color: #0078D4;
      color: #FFFFFF;
      border-radius: 8px;
    }
  </style>

  <foreignObject x="0" y="0" width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" class="container">
      <strong>Centered text inside SVG</strong>
    </div>
  </foreignObject>
</svg>
```

<img src="metadata-assets/responsive-md/svg-techniques/html.svg" alt="svg-html" />

</details>

#### Patterns, transforms & positioned elements
- Use `<pattern>` for **tiled backgrounds**; `transform` to **rotate/position elements**.

<details>
<summary>Example (expand)</summary>

```xml
<!-- Example with circle pattern tiling on the rectangle and a right-aligned element on top of it -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 82">
  <defs>
    <pattern fill="#0078D4" id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.5" />
    </pattern>
  </defs>

  <rect width="100%" height="80" fill="url(#dots)" transform="rotate(1)"  />
  <rect width="8" height="74" fill="#0078D4" x="100%" transform="rotate(1) translate(-8,0)"  />
</svg>
```

<img src="metadata-assets/responsive-md/svg-techniques/pattern-transform.svg" alt="pattern-tiling-and-transforms" />

</details>

#### Adaptive sizing without proportional stretching
- Omitting `viewBox` and using `width` or `height` attributes can make the SVG **adapt to parent "preview" container sizing rather than stretching the whole image proportionally in width and height to the "viewBox" coordinates**. Furthermore, **without `viewBox`, the SVG and its elements will adapt to the defined "width" and "height" internal sizes, as well as to the current window size, just as a standard HTML document would**.

<details>
<summary>Example (expand)</summary>

```xml
<!-- Example combined with pattern tiling and full-width adaptive and responsive design -->
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="92">
  <defs>
    <pattern fill="#0078D4" id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.5" />
    </pattern>
  </defs>

  <rect width="100%" height="80" fill="url(#dots)" transform="rotate(1)"  />
  <rect width="8" height="74" fill="#0078D4" x="100%" transform="rotate(1) translate(-8,0)"  />
</svg>
```

```html
<img src="metadata-assets/responsive-md/svg-techniques/responsive-pattern-transform.svg" width="100%" alt="responsive-pattern-tiling-and-transforms" />
```

<img src="metadata-assets/responsive-md/svg-techniques/responsive-pattern-transform.svg" width="100%" alt="responsive-pattern-tiling-and-transforms" />

</details>

---

### Anchors & navigation
- Use HTML anchors: `<a name="gate"></a>` and link with `#gate`.

<details>
<summary>Examples (expand)</summary>

```md
### The gate (HTML)
<a name="gate"></a>
...

### [Go to gate](#gate)
```

```md
### The gate (Markdown)
...

## [Go to gate](#the-gate-markdown)
```

### The gate (HTML)
<a name="gate"></a>
...

### [Go to gate](#gate)

### The gate (Markdown)
...

## [Go to gate](#the-gate-markdown)

</details>

If you combine all of these tricks, you can create quite an advanced GFM layout.


## 💡 Solving our [README.md](README.md) responsive issue

The goal we are trying to achieve here is to replicate the style of the VSCode tabs bar, but there are major design considerations to keep in mind:
* The tabs bar that lists active files contains a placeholder container that extends to the end of the view
* The action buttons must be placed at the end of the view, on top of the tabs bar
* These two components are repositioned and resized based on the size of the window
* Colors must adapt to light/dark themes.

### Implementation

1. **Create six SVG images "components"**  
   Repeat these steps for the dark / light themes:
   - `vscode-preview-tab.svg` — the active "preview" file tab (placed at `x=0`).
   - `vscode-tabs-bar-filler.svg` — the placeholder container tile pattern that will be repeated across the remaining width.
   - `vscode-editor-actions.svg` — action buttons (anchored to the right, placed on top of the placeholder container).

2. **Assemble the six "components" inside a single composite SVG image**  
   For each theme:
   - Create a group `<g class="<name-of-the-theme>">` that separates each theme, and repeat the next steps inside the appropriate created groups.
   - Place the `vscode-preview-tab.svg` image at `x=0`.
   - Define a `<pattern>` that uses `vscode-tabs-bar-filler.svg` to create a repeating pattern that fills the remaining width of the view with `width="100%"`. 
   - Draw a `<rect>` filled with `url(#pattern)` starting at `x=<[vscode-preview-tab.svg]-width>` and extending with `width="100%"`.
   - Add the `vscode-editor-actions.svg` image and use `x="100%"` with `transform="translate(-<[vscode-preview-tab.svg]-width>, 0)"` to anchor it visually to the right end of the filler.

3. **Make the composite SVG theme-aware**
   - Include a `<style>` block inside the SVG
   - Use `@media (prefers-color-scheme: dark)` and `@media (prefers-color-scheme: light)` to swap colors between created groups.

4. **Sizing & responsiveness**  
   - Do **not** include `viewBox` if you want the SVG to scale by the parent container dimensions (remove `viewBox`).
   - Use `width="100%"` when embedding the SVG in README.

5. **Embedding in README**  
   
   ```html
   <img src="<link-to-the-composite-svg-image.svg>" width="100%" alt="Preview README.md">
   ```

## SVG

```xml
<svg xmlns="http://www.w3.org/2000/svg"
     height="36" 
     aria-hidden="true">
  <style>
    .light { display: none; }
    .dark  { display: inline; }

    @media (prefers-color-scheme: light) {
      .light { display: inline; }
      .dark  { display: none; }
    }
  </style>

  <!-- tile filler pattern that spans the entire view width -->
  <!-- allows repeating the 1px tile until the end of the view width -->
  <defs>
    <!-- dark variant pattern -->
    <pattern id="tileFiller-dark" width="100%" height="36">
      <image width="100%" height="36"
             href="data:image/svg+xml;base64,..." />
    </pattern>

    <!-- light variant pattern -->
    <pattern id="tileFiller-light" width="100%" height="36">
      <image width="100%" height="36"
             href="data:image/svg+xml;base64,..." />
    </pattern>
  </defs>

  <!-- DARK variant -->
  <g class="dark" id="vscode-tabs-dark">
    <!-- preview tab image: fixed box at x=0 -->
    <image id="preview-tab-dark"
           href="data:image/svg+xml;base64,..." />

    <!-- tabs bar filler, starting at x = 164 (end of the preview tab image) and covering 100% of remaining screen width -->
    <!-- responsive design made possible by using "tileFiller" -->
    <rect id="tabs-bar-filler-dark" x="164" y="0" width="100%" height="36" fill="url(#tileFiller-dark)" />

    <!-- editor actions image: positioned at the end of the view width using offset translation with x=calc(100% - 90px) -->
    <image id="editor-actions-dark" x="100%" transform="translate(-90,0)"
           href="data:image/svg+xml;base64,..." />
  </g>

  <!-- LIGHT variant -->
  <g class="light" id="vscode-tabs-light">
    <!-- preview tab image: fixed box at x=0 -->
    <image id="preview-tab-light"
           href="data:image/svg+xml;base64,..." />

    <!-- tabs bar filler, starting at x = 164 (end of the preview tab image) and covering 100% of remaining screen width -->
    <!-- responsive design made possible by using "tileFiller" -->
    <rect id="tabs-bar-filler-light" x="164" y="0" width="100%" height="36" fill="url(#tileFiller-light)" />

    <!-- editor actions image: positioned at the end of the view width using offset translation with x=calc(100% - 90px) -->
    <image id="editor-actions-light" x="100%" transform="translate(-90,0)"
           href="data:image/svg+xml;base64,..." />
  </g>
</svg>
```

## Markdown (GFM)

```html
<img src="<link-to-the-composite-svg-image.svg>" width="100%" alt="Preview README.md">
```

<a href="https://github.com/Zemasterkrom/zemasterkrom-assets">
  <img src="https://github.com/Zemasterkrom/zemasterkrom-assets/blob/rev2-fix-bootstrap-logo/header/vscode-tabs-bar.svg?raw=true" alt="Preview README.md" width="100%">
</a>