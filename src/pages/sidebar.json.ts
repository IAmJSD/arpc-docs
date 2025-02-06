import { readFile, readdir } from "fs/promises";
import { join } from "path";

type Link = {
    link: string;
    title: string;
};

type SidebarCategory = {
    category: string;
    items: (Link | SidebarCategory)[];
};

function parseLink(fileContent: string, path: string): Link {
    const dirtyTitle = fileContent.match(/^title: (.+)$/m)?.[1];
    if (!dirtyTitle) {
        throw new Error(`No title found in ${path}`);
    }
    let title = dirtyTitle;
    try {
        title = JSON.parse(dirtyTitle);
    } catch {}

    return {
        link: path,
        title,
    };
}

function clean(str: string) {
    return str
        .replace(/-/g, " ")
        .replace(/_/g, " ")
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
}

async function renderSidebarCategory(pathPrefix: string, dir: string, category: string): Promise<SidebarCategory> {
    const files = await readdir(dir);
    const items: (Link | SidebarCategory)[] = [];
    const folders: string[] = [];
    for (const fileOrDir of files) {
        const filePath = join(dir, fileOrDir);
        let file: string;
        try {
            // Read the file and then handle parsing the link.
            file = await readFile(filePath, "utf-8");
        } catch {
            // Mark as a folder.
            folders.push(fileOrDir);
            continue;
        }

        // Parse the link.
        const fileInfo = fileOrDir === "index.md" ? "" : `/${fileOrDir.replace(/\.md$/, "")}`;
        items.push(parseLink(file, `/docs${pathPrefix}${fileInfo}`));
    }

    for (const folder of folders) {
        items.push(await renderSidebarCategory(`${pathPrefix}/${folder}`, join(dir, folder), clean(folder)));
    }

    return {
        category,
        items,
    };
}

export async function GET() {
    const category = await renderSidebarCategory("", join("src", "pages", "docs"), "");
    return new Response(JSON.stringify(category.items, null, 4) + "\n", {
        headers: {
            "Content-Type": "application/json",
        },
    });
}
