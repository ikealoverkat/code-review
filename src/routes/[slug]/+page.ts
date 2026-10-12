import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getDoc } from '#lib';

export const load: PageLoad = ({ params }) => {
	const doc = getDoc(params.slug);
	if (!doc) throw error(404, `No page named "${params.slug}".`);
	return { slug: doc.slug, title: doc.title, description: doc.description };
};
