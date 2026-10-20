# AI Interview Simulator — Login Page Assets

## Contents
- `images/interview-hero.png` — standalone hero illustration for the left panel
- `logo.svg` — microphone logo
- `icons/` — SVG icons for feature bullets and form fields

## React usage
Place this folder inside your React app's `src/assets/` directory.

```jsx
import hero from "./assets/ai-interview-login-assets/images/interview-hero.png";
import logo from "./assets/ai-interview-login-assets/logo.svg";
import MicIcon from "./assets/ai-interview-login-assets/icons/mic.svg";

export function Brand() {
  return (
    <div>
      <img src={logo} alt="AI Interview Simulator" width="48" />
      <img src={hero} alt="Candidate practicing an AI interview" />
      <img src={MicIcon} alt="" width="24" />
    </div>
  );
}
```

If your bundler supports SVG as React components (for example, Vite with SVGR configured), you can import SVGs as components. Otherwise, use them as image sources as shown above.
