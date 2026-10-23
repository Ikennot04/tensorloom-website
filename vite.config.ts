import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Content-Security-Policy is added only to the production build,
// because the dev server injects inline scripts for hot reload.
const csp: Plugin = {
  name: "csp-meta",
  apply: "build",
  transformIndexHtml: (html) =>
    html.replace(
      "<!--CSP-->",
      `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'none'; object-src 'none'" />`,
    ),
};

export default defineConfig({
  plugins: [react(), tailwindcss(), csp],
  build: { assetsInlineLimit: 0 },
});
