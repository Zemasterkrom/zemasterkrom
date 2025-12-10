# 🖥️📱 Responsive design on GFM

## ⚠️ Issue
**GitHub Flavored Markdown (GFM)** has a syntax that limits the possibilities for designing advanced Markdown layouts due to significant security concerns : 
* **CSS spreadsheets and `<style>` elements are not allowed.**
* **JavaScript code and `<script>` elements are not allowed.**

Indeed, that would cause obvious **XSS** or **clickjacking** security issues.

## ✅ Solutions

While the first idea is that it isn't possible to create a responsive and advanced Markdown design in GFM because of the related security issues, there are still a lot of **tricks** that can be used to achieve such design. Here are the tricks that you use:

### Responsive sizing, positioning and theming

#### Responsive sizing with `<img>`
- `<img>` supports `width` and `height` attributes.
  - Example: `<img src="foo.svg" width="100%" alt="...">` **stretches the image to the parent container width**. In GitHub, using `width="100%"` will make the image fill the preview container width.

<details>
<summary>Examples (expand)</summary>

```html
<!-- This will stretch the provided image according to the fixed "width" and "height" attributes -->
<img width="64" height="32" src="metadata-assets/responsive-md/placeholders/32x32-0078D4-notext.svg" alt="fixed-size | fixed-width | fixed-height | responsive-sizing" />
```

<img width="64" height="32" src="metadata-assets/responsive-md/placeholders/32x32-0078D4-notext.svg" alt="fixed-size | fixed-width | fixed-height | responsive-sizing" />

```html
<!-- This will stretch the provided image to the full parent container width with a fixed and defined height -->
<img width="100%" height="32" src="metadata-assets/responsive-md/placeholders/32x32-0078D4-notext.svg" alt="full-width | fixed-height | responsive-sizing" />
```

<img width="100%" height="32" src="metadata-assets/responsive-md/placeholders/32x32-0078D4-notext.svg" alt="full-width | fixed-height | responsive-sizing" />

```html
<!-- This will stretch the image to the full parent container width maintaining aspect ratio -->
<img width="100%" src="metadata-assets/responsive-md/placeholders/32x32-0078D4-notext.svg" alt="full-width | full-height" />
```
<img width="100%" src="metadata-assets/responsive-md/placeholders/32x32-0078D4-notext.svg" alt="full-width | full-height" />
</details>

#### Responsive & adaptive theming with `<picture>`

> [!NOTE]
> Color theme selection depends on three factors:
> - If the user is logged in, the color theme defined in the GitHub user settings will be used.
> - If the user is not logged in, the browser or operating system color theme will be used.
> - It could depend on the time of the day.

- Use `<picture>` with `<source>` elements to provide multiple resolutions and theme variants.
  - Serve **different resolutions** via `media` queries (e.g., `(max-width: 600px)`).
  - Provide **dark and light variants** using `media="(prefers-color-scheme: dark)"` and `media="(prefers-color-scheme: light)"`.

<details>
<summary>Examples (expand)</summary>

```html
<!-- Change shown image based on device screen width with media queries -->
<picture>
  <source media="(max-width: 1023px)" srcset="metadata-assets/responsive-md/placeholders/256x256-0078D4-FFFFFF.svg">
  <source media="(min-width: 1024px)" srcset="metadata-assets/responsive-md/placeholders/512x256-0078D4-FFFFFF.svg">
  <img src="metadata-assets/responsive-md/placeholders/256x256-0078D4-FFFFFF.svg" alt="picture | responsive[max-width: 1023px, min-width: 1024px]" />
</picture>
```

<picture>
  <source media="(max-width: 1023px)" srcset="metadata-assets/responsive-md/placeholders/256x256-0078D4-FFFFFF.svg">
  <source media="(min-width: 1024px)" srcset="metadata-assets/responsive-md/placeholders/512x256-0078D4-FFFFFF.svg">
  <img src="metadata-assets/responsive-md/placeholders/256x256-0078D4-FFFFFF.svg" alt="picture | responsive[max-width: 1023px, min-width: 1024px]" />
</picture>

```html
<!-- Switch between dark and light themes -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="metadata-assets/responsive-md/placeholders/256x256-000000-FFFFFF.svg">
  <source media="(prefers-color-scheme: light)" srcset="metadata-assets/responsive-md/placeholders/256x256-FFFFFF-000000.svg">
  <img src="metadata-assets/responsive-md/placeholders/256x256-000000-FFFFFF.svg" alt="picture | theme | fixed-height | dark-mode[dark-bg] | light-mode[light-bg]" />
</picture>
```

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="metadata-assets/responsive-md/placeholders/256x256-000000-FFFFFF.svg">
  <source media="(prefers-color-scheme: light)" srcset="metadata-assets/responsive-md/placeholders/256x256-FFFFFF-000000.svg">
  <img src="metadata-assets/responsive-md/placeholders/256x256-000000-FFFFFF.svg" alt="picture | theme | fixed-height | dark-mode[dark-bg] | light-mode[light-bg]" />
</picture>

```html
<!-- Switch between dark and light themes, with full-width responsive rectangle design -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="metadata-assets/responsive-md/placeholders/FULLx32-000000-FFFFFF.svg">
  <source media="(prefers-color-scheme: light)" srcset="metadata-assets/responsive-md/placeholders/FULLx32-FFFFFF-000000.svg">
  <img width="100%" height="32" src="metadata-assets/responsive-md/placeholders/FULLx32-000000-FFFFFF.svg" alt="picture | theme | full-width | fixed-height | dark-mode[dark-bg] | light-mode[light-bg]" />
</picture>
```

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="metadata-assets/responsive-md/placeholders/FULLx32-000000-FFFFFF.svg">
  <source media="(prefers-color-scheme: light)" srcset="metadata-assets/responsive-md/placeholders/FULLx32-FFFFFF-000000.svg">
  <img width="100%" height="32" src="metadata-assets/responsive-md/placeholders/FULLx32-000000-FFFFFF.svg" alt="picture | theme | full-width | fixed-height | dark-mode[dark-bg] | light-mode[light-bg]" />
</picture>
</details>

> Many media queries can be used. See: [Using Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Using)

#### Alignment
- Align `<img>` and `<p>` with the `align` property: **left, center, right**

<details>
<summary>Examples (expand)</summary>

```md
### align="left"
<img align="left" src="metadata-assets/responsive-md/placeholders/128x24-0078D4-FFFFFF.svg" alt="align-left | fixed-width | fixed-height" />
Left alignment

### align="right"
<img align="right" src="metadata-assets/responsive-md/placeholders/128x24-0078D4-FFFFFF.svg" alt="align-right | fixed-width | fixed-height" />
Right alignment
```

### align="left"
<img align="left" src="metadata-assets/responsive-md/placeholders/128x24-0078D4-FFFFFF.svg" alt="align-left | fixed-width | fixed-height" />
Left alignment

### align="right"
<img align="right" src="metadata-assets/responsive-md/placeholders/128x24-0078D4-FFFFFF.svg" alt="align-right | fixed-width | fixed-height" />
Right alignment

```html
<p align="left">
  <img src="metadata-assets/responsive-md/placeholders/128x128-0078D4-FFFFFF.svg" alt="align-left | fixed-width | fixed-height" />
  <img src="metadata-assets/responsive-md/placeholders/128x128-0078D4-FFFFFF.svg" alt="align-left | fixed-width | fixed-height" />
</p>

<p align="center">
  <img src="metadata-assets/responsive-md/placeholders/128x128-0078D4-FFFFFF.svg" alt="align-center | fixed-width | fixed-height" />
  <img src="metadata-assets/responsive-md/placeholders/128x128-0078D4-FFFFFF.svg" alt="align-center | fixed-width | fixed-height" />
</p>

<p align="right">
  <img src="metadata-assets/responsive-md/placeholders/128x128-0078D4-FFFFFF.svg" alt="align-right | fixed-width | fixed-height" />
  <img src="metadata-assets/responsive-md/placeholders/128x128-0078D4-FFFFFF.svg" alt="align-right | fixed-width | fixed-height" />
</p>
```

<p align="left">
  <img src="metadata-assets/responsive-md/placeholders/128x128-0078D4-FFFFFF.svg" alt="align-left | fixed-width | fixed-height" />
  <img src="metadata-assets/responsive-md/placeholders/128x128-0078D4-FFFFFF.svg" alt="align-left | fixed-width | fixed-height" />
</p>

<p align="center">
  <img src="metadata-assets/responsive-md/placeholders/128x128-0078D4-FFFFFF.svg" alt="align-center | fixed-width | fixed-height" />
  <img src="metadata-assets/responsive-md/placeholders/128x128-0078D4-FFFFFF.svg" alt="align-center | fixed-width | fixed-height" />
</p>

<p align="right">
  <img src="metadata-assets/responsive-md/placeholders/128x128-0078D4-FFFFFF.svg" alt="align-right | fixed-width | fixed-height" />
  <img src="metadata-assets/responsive-md/placeholders/128x128-0078D4-FFFFFF.svg" alt="align-right | fixed-width | fixed-height" />
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

Because of their **vector** nature, SVG files allow for **very advanced, HTML-like layouts**. Keep the markup inside the `.svg` file and reference it from Markdown using an `<img>` element.

#### Styling (`<style>` inside SVG)

> [!WARNING]
> Due to a [**WebKit long-lasting issue**](https://bugs.webkit.org/show_bug.cgi?id=199134), the **prefers-color-scheme** media query **doesn't work when embedded inside a SVG in Safari**.  
> The `<style>` element work, but the **prefers-color-scheme** media query does not.  
> **A workaround exists in the GFM syntax for maximum cross-browser interoperability**.  
> Please refer to the [**Responsive & adaptive theming with `<picture>`**](#responsive--adaptive-theming-with-picture) section.

- **Styling** inside the SVG (`<style>`) applies only within the SVG. Consequence ? It is not stripped out by GFM processor.

<details>
<summary>Example (expand)</summary>

```xml
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="256" height="100" viewBox="0 0 256 100">
  <style>
    .title {
      font: bold 20px '-apple-system', BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
    }

    @media (prefers-color-scheme: dark) {
      .title {
        fill: #AFAFAFFF;
      }
    }

    @media (prefers-color-scheme: light) {
      .title {
        fill: #3A3A3AFF;
      }
    }
  </style>

  <text class="title" x="10" y="55">Styled inside SVG</text>
</svg>
```

```html
<img src="metadata-assets/responsive-md/svg-techniques/style.svg" alt="svg-styling | font | fixed-width | fixed-height" />
```

<img src="metadata-assets/responsive-md/svg-techniques/style.svg" alt="svg-styling | font | fixed-width | fixed-height" />

</details>

#### HTML inside SVG (`<foreignObject>`)
- Use `<foreignObject>` to embed **HTML** within the SVG.

<details>
<summary>Example (expand)</summary>

```xml
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 400 100">
  <style>
    .container {
      font-family: '-apple-system', BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';

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

  <foreignObject x="0" y="0" width="400" height="100">
    <div xmlns="http://www.w3.org/1999/xhtml" class="container">
      <strong>Centered text inside SVG</strong>
    </div>
  </foreignObject>
</svg>
```

```html
<img width="100%" src="metadata-assets/responsive-md/svg-techniques/html.svg" alt="svg-styling | html | font | full-width | full-height" />
```

<img width="100%" src="metadata-assets/responsive-md/svg-techniques/html.svg" alt="svg-styling | html | font | full-width | full-height" />

</details>

#### Patterns, transforms & positioned elements
- Use `<pattern>` for **tiled backgrounds** and `transform` to **rotate/position elements**.

<details>
<summary>Example (expand)</summary>

```xml
<!-- Example with circle pattern tiling on the rectangle and a right-aligned element on top of it -->
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 400 82">
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
<img src="metadata-assets/responsive-md/svg-techniques/pattern-transform.svg" alt="pattern | transform | full-width | full-height" />
```

<img src="metadata-assets/responsive-md/svg-techniques/pattern-transform.svg" alt="pattern | transform | full-width | full-height" />

</details>

---

### Anchors & navigation
- Use HTML or Markdown anchors and link with `#<anchor-name>`.

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
If you want an even more responsive Markdown document, check out the above [3-slice scaling · Replicating the design of the Visual Studio Code workspace bar](#%EF%B8%8F-3-slice-scaling--replicating-the-design-of-the-visual-studio-code-workspace-bar) section, which explains how the responsive design of the VS Code workspace bar [README.md](README.md) works.

## 🟦↔️🟦 3-slice scaling · Replicating the design of the Visual Studio Code workspace bar

### 💡Idea
We're trying to replicate the style of the Visual Studio Code workspace bar, divided into three parts:
* A **preview tab** representing the active file, anchored at the start of the view
* A **fluid filler container** spanning the full width of the view
* An **action buttons container**, anchored at the end of the view

What we're trying to achieve is inspired by the [**9-slice scaling**](https://en.wikipedia.org/wiki/9-slice_scaling)[^1].  
In our case, since our Visual Studio Code workspace bar is divided into three parts, we are doing horizontal [**3-slice scaling**](https://stackoverflow.com/questions/21763823/possible-to-build-an-svg-that-has-fluid-horizontal-scaling-similar-to-old-table)[^2].

Our **3-slice scaling** works as follows:
* **Slice 1**  
  Positioned on the left of the view.  
  This element is the only one that can expand to cover the entire width, from the beginning to the end of the view.
* **Slice 2**  
  Positioned above the first slice and on the left side of the view.
  Remains fixed in this position, with fixed dimensions.
* **Slice 3**  
  Positioned above the **first and second slices** at the **end/right** of the view, **with fixed dimensions**.  
  Therefore, **the position of this element changes** depending on the width of the parent container.

That **3-slice workflow** allows the SVG and its elements to **naturally adapt to the size of the parent container without distortion**, with **HTML-like layout behavior**.

[^1]: 9-slice scaling SVG implementation: https://blog.bguiz.com/2015/01/22/svg-9-slice-scaling/, https://w3.eleqtriq.com/2014/03/the-holy-grail-of-image-scaling/  
[^2]: 3-slice scaling SVG implementation: https://stackoverflow.com/questions/21763823/possible-to-build-an-svg-that-has-fluid-horizontal-scaling-similar-to-old-table

### ⚠️ Issue
**It's a real challenge to make this work in GitHub Markdown documents, because we're limited by the security filters of the GFM syntax.**  

Although there are several solutions to achieve this layout, **many of them either don't work on GitHub or simply produce distortions**, because :
- **We can't use the `style` attribute** on Markdown-embedded HTML elements
- **We can't use `script`** elements in our Markdown document and in our SVG
- Only a **very limited subset of HTML attributes** is allowed

A straightforward idea would be to create a **composed SVG** that **embeds three `<image>` components as slices**:
* The **first slice** expands from **`x="0"`** to **`x="100%"`**
* The **second slice** is placed at **`x="0"`**
* The **third slice** is placed at **`x="calc(100% - <third-image-width>)"`**

The composed SVG image would then be referenced in a `<img>` element with `width="100%"` to make it responsive.

**Theoretically, this is the correct workflow.**

However, this approach requires omitting the `viewBox` attribute on the root `<svg>`, because **defining a `viewBox` forces the entire graphic to scale proportionally** in width and height relative to its parent container — but our goal is to **allow the slices to position naturally along the responsive x-axis**.

While some browsers such as Chromium (Blink) and Safari (WebKit) handle this **"no viewBox scenario"** correctly, **Firefox (Gecko) is stricter**. 

Implementing this workflow in **Firefox** causes the intrinsic coordinate system to become  **confused about the actual size of the composed SVG**, since there is no `viewBox`. As a result, **Firefox miscalculates how the composed SVG should be rendered** and **stretches or distorts the entire SVG image instead of applying the 3-slice scaling**.

This makes the approach incompatible with **Firefox (Gecko)**, and therefore **unsuitable for GitHub**, which must render consistently across all major browser engines.

### ✅ Solution
**Although the boundary between full cross-browser compatibility and GitHub is very thin, there is a reliable cross-browser working solution!**
> The GFM syntax allows the **`width`** and **`height`** attributes on **`<img>`** elements.  
> **`<svg>`** elements can contain inner **`<svg>`** element with **dedicated `viewBox` coordinates**.

The solution is to **embed three inner `<svg>` elements inside the root `<svg>`**, each one containing its associated `<image>` component slice.

**All intrinsic sizing attributes on the root `<svg>` must be omitted**:
* `width`
* `height`
* `viewBox`

→ Instead of defining the SVG `height` and `width` attributes directly in the root `<svg>`, **they will be defined externally** by the `<img>` element that references it.  

Each inner `<svg>` must define their intrinsic size (defined by the natural dimensions of its associated `<image>` element) via **its own** `viewBox` attribute. This **isolates the coordinate system of each slice** from the root `<svg>`, ensuring that every `<image>` component scales according to its dedicated inner `<svg>`. By combining each **inner `viewBox`** with the **`preserveAspectRatio`** attribute and the **xMin (left)** and **xMax (right)** values, we obtain the desired **3-slice scaling without distortion**.

This workflow has been **cross-browser tested** on **GitHub Markdown renderer (GFM)**, and works with the three major browser engines:
1. Blink (**Chromium**)
2. WebKit (**Safari**)
3. Gecko (**Firefox**)

### 🚀 Implementation

1. **Create six SVG component images (three per theme)"**  
  Prepare three standalone SVG assets per theme (dark / light):
   * `vscode-preview-tab.svg`  
    The active "preview" tab.  
    This image would be anchored at the left.
   * `vscode-fluid-filler.svg`  
    A 1-px-wide tile pattern used as a stretchable pattern that will extend from the start of the view to the end of the view.
   * `vscode-editor-actions.svg`  
    The editor action buttons container.  
    This image would be anchored to the right.
  You should end up with 3 components per theme (6 in total).

2. **Create two composite SVG images (one per theme)**  
    Each created composite SVG will assemble the three components into a free width-scalable image.

    Create the composite SVG image that defines a root `<svg>` without coordinates attributes (no `width`, `height`, or `viewBox`) so the inner elements can move freely without being constrained by a fixed size.

    Next, create three inner `<svg>` layers, each implemented as a nested `<svg>` with its own independent `viewBox`:

    **Layer 1: Fluid filler (middle, stretchable)**
      > To **avoid overlapping** with other elements, this layer **must be placed first**
      * Wrap the `vscode-fluid-filler.svg` inside the nested `<svg>` using **`width="100%"`** and **`height="100%"`**  
        → **width="100%"** allows the `<image>` element to expand to fit the entire width
      * Reference it with `<image>` using **`preserveAspectRatio="none"`**, along with **`width="100%"`** and **`height="100%"`**  
        → **none** allows the `<image>` element to expand as needed in width

    **Layer 2: Preview tab (left, fixed)**
      * Wrap the component inside a nested `<svg>` with its own **`viewBox="0 0 <image-width> <image-height>"`**
      * Reference it with `<image>` using **`preserveAspectRatio="xMinYMid meet"`**  
        → **xMin meet** locks the component to the **left** while preserving its aspect ratio

    **Layer 3: Editor tab (right, fixed)**
      * Wrap the component inside a nested `<svg>` with its own **`viewBox="0 0 <image-width> <image-height>"`**
      * Reference it with `<image>` using **`preserveAspectRatio="xMaxYMid meet"`** and **`width="100%"`**, **`height="100%"`**  
        → **xMax meet** locks the component to the **right** while preserving its aspect ratio

3. **Embedding in README**  
   Use the `<picture>` element to switch composite images between dark and light color themes:

   ```html
   <picture>
     <source media="(prefers-color-scheme: dark)" srcset="<link-to-composite-dark-themed-image.svg>" />
     <source media="(prefers-color-scheme: light)" srcset="<link-to-composite-light-themed-image.svg>" />
     <img src="<link-to-fallback-image[dark | light | mixed].svg>" alt="Preview README.md" width="100%" height="<height-of-image>" />
   </picture>
   ```

> [!NOTE]
> Since the created SVG images do not define the `width`, `height` and `viewBox` coordinates, **the rendering size of the SVG images are controlled by the `width` and `height` attributes of the `<img>` element**.  
> Because of the usage of **inner `<svg>` elements** with **dedicated `viewBox` coordinates** and the **`preserveAspectRatio` attribute**, you can choose **any `height`** you want.  
> The left/second and right/third slices will **retain their aspect ratio** while **stretching correctly to fit the defined `height`**, while the middle/first slice **will stretch in width along the responsive x-axis**.

### SVG

> [!IMPORTANT]
> **Many CDNs prohibit** (via their **Content Security Policy \[CSP\]**) the **loading of external resources and images** from an SVG for **security reasons**, so we use **base64-encoded images**, which are **inline and local** representations of the designed images.

#### Dark-theme composed SVG

```xml
<!-- VS Code workspace bar : responsive 3-slice scaling (dark theme) -->
<svg xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  version="1.1">

  <!-- To avoid distortions or "stretching", each <image> is placed inside its own <svg> container.
  This allows each <svg> to have a distinct viewport separate from the root <svg> and to clearly
  define intrinsic dimensions of the individual images, which would not be possible with the root
  <svg>. -->

  <!-- Each <image> scales to fill its enclosing <svg> viewport by using width="100%" and
  height="100%". -->

  <!-- Fluid filler (middle, stretchable): first layer / slice -->
  <!-- Expands horizontally to fill available width (100% = full width of the SVG image) -->
  <!-- vscode-fluid-filler.svg -->
  <svg xmlns="http://www.w3.org/2000/svg" id="fluid-filler-dark" class="fluid-filler"
    height="100%" width="100%">
    <image width="100%" height="100%" preserveAspectRatio="none"
      xlink:href="data:image/svg+xml;base64,..." />
  </svg>

  <!-- Preview tab (left, fixed): second layer / slice -->
  <!-- Aligned to the left (x=0) using an inner SVG with a dedicated viewport (separated from the
  root viewport) and xMin[minimum = left]YMid -->
  <!-- vscode-preview-tab.svg -->
  <svg xmlns="http://www.w3.org/2000/svg" id="preview-tab-dark" class="preview-tab"
    viewBox="0 0 164 36" preserveAspectRatio="xMinYMid meet">
    <image width="100%" height="100%"
      xlink:href="data:image/svg+xml;base64,..." />
  </svg>

  <!-- Editor actions (right, fixed): third layer / slice -->
  <!-- Aligned to the right (x=100%) without overflow using an inner SVG with a dedicated viewport
  (separated from the root viewport) and xMax[maximum = right]YMid -->
  <!-- vscode-editor-actions.svg -->
  <svg xmlns="http://www.w3.org/2000/svg" id="editor-actions-dark" class="editor-actions"
    viewBox="0 0 90 36" preserveAspectRatio="xMaxYMid meet">
    <image width="100%" height="100%"
      xlink:href="data:image/svg+xml;base64,..." />
  </svg>
</svg>
```

#### Light-theme composed SVG

```xml
<!-- VS Code workspace bar : responsive 3-slice scaling (dark theme) -->
<svg xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  version="1.1">

  <!-- Same implementation using light-variant, base64-encoded <image> elements -->
</svg>
```

### Markdown (GFM)

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="<link-to-composite-dark-themed-image.svg>" />
  <source media="(prefers-color-scheme: light)" srcset="<link-to-composite-light-themed-image.svg>" />
  <img src="<link-to-fallback-image[dark | light | mixed].svg>" alt="Preview README.md" width="100%" height="<height-of-image>" />
</picture>
```

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/Zemasterkrom/zemasterkrom-assets@rev7-fix-firefox-distorted-header-scaling/header/dark-mode/composed/optimized/vscode-workspace-bar.svg" />
  <source media="(prefers-color-scheme: light)" srcset="https://cdn.jsdelivr.net/gh/Zemasterkrom/zemasterkrom-assets@rev7-fix-firefox-distorted-header-scaling/header/light-mode/composed/optimized/vscode-workspace-bar.svg" />
  <img src="https://cdn.jsdelivr.net/gh/Zemasterkrom/zemasterkrom-assets@rev7-fix-firefox-distorted-header-scaling/header/dark-mode/composed/optimized/vscode-workspace-bar.svg" alt="Preview README.md" width="100%" height="36" />
</picture>