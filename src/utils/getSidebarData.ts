type Link = {
    link: string;
    title: string;
};

type Category = {
    category: string;
    items: (Link | Category)[];
};

export async function getSidebarData(): Promise<(Link | Category)[]> {
    // @ts-expect-error: check the main layout
    return window.__SIDEBAR_DATA__;
}
