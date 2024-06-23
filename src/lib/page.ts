import { getContext } from 'svelte';

export interface Page {
	url: URL;
	state: Record<string, any>;
}

function getPage() {
	const page = getContext<() => Page>('PAGE_CONTEXT');
	if (!page) {
		throw new Error('the page context is only available in components');
	}

	return page();
}

export const page: Page = {
	get url() {
		return getPage().url;
	},
	get state() {
		return getPage().state;
	}
};
