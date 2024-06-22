import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess({})],
	compilerOptions: {
		hmr: true
	}
};

export default config;
