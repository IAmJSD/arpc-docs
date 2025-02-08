type Link = {
    link: string;
    title: string;
};

type Category = {
    category: string;
    items: (Link | Category)[];
};

// @ts-expect-error: We know this will exist, see MainLayout.astro.
export const sidebarData: Promise<(Link | Category)[]> = window.__SIDEBAR_DATA__;
