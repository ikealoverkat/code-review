import type { Component } from 'svelte';

// frontmatter
export interface DocMeta {
	title?: string;
	description?: string;
	order?: number;
	category?: string;
}

export interface Doc {
    slug: string;
    title: string;
    description?: string;
    order: number;
    component: Component; //the md file compiled to a sv component
}

const modules = import.meta.glob('/src/lib/docs/**/*.md', { eager: true }) as Record<
	string,
	{ default: Component; metadata?: DocMeta }
>; //import .md files as components

function fileToSlug(path: string): string {
    const file = path.split('/').pop() as string;
    return file.replace(/\.md$/, '');
}

function slugToTitle(slug: string): string {
    return slug
        .split('-')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export const docs: Doc[] = Object.entries(modules)
    .filter(([path]) => {
        const file = path.split('/').pop() as string;
        return !file.startsWith('_');
    })
    .map(([path, module]) => {
        const slug = fileToSlug(path);
        const meta = module.metadata ?? {};
        return {
            slug,
            title: meta.title ?? slugToTitle(slug),
            description: meta.description,
            order: typeof meta.order === 'number' ? meta.order : 0,
            component: module.default
        } satisfies Doc;
    })
    .sort((a, b) => a.order - b.order); //find all the docs in the /docs folder, ordered by their order field

export const defaultDoc: Doc | undefined = docs[0];

export function getDoc(slug: string): Doc | undefined {
    return docs.find((doc) => doc.slug === slug);
}