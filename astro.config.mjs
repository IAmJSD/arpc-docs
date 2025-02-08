// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// https://astro.build/config
export default defineConfig({
    site: "https://arpc.dev",
    vite: {
        plugins: [tailwindcss()],
    },
    markdown: {
        shikiConfig: {
            themes: {
                light: "github-light",
                dark: "github-dark",
            },
            defaultColor: false,
        },
        rehypePlugins: [rehypeHeadingIds, rehypeAutolinkHeadings],
    },
    integrations: [icon(), sitemap()],
    prefetch: {
        prefetchAll: true,
    },
});
