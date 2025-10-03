<script>
	import '$lib/styles/global.css';
	import Header from '$lib/components/layout/header/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="favicon.svg" />
	<link rel="shortcut icon" href="favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-title" content="Common.Kitchen" />
	<link rel="manifest" href="site.webmanifest" />
	<title>Common.Kitchen</title>
</svelte:head>

<Header />
<div class="content-wrap">
	{@render children?.()}
</div>
<Footer />
