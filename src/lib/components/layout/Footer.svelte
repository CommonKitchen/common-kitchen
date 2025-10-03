<script>
	import Phone from '$lib/components/ui/Phone.svelte';
	const phones = ['+380738387677', '+380938730992'];
	const links = [
		{ href: '/', title: 'Договір публічної оферти' },
		{ href: '/', title: 'Доставка та оплата' },
		{ href: '/', title: 'Політика конфіденційності' },
		{ href: '/', title: 'Повернення грошових коштів' }
	];
</script>

<div class="footer">
	<div class="container">
		<div class="footer-column">
			<h4>Контактна інформація:</h4>
			<ul>
				<li><a href="mailto:seeyoubakery@gmail.com">seeyoubakery@gmail.com</a></li>
				{#each phones as phone}
					<li><Phone {phone} /></li>
				{/each}
			</ul>
		</div>
		<div class="footer-column">
			<h4>Режим роботи:</h4>
			<ul>
				<li>Пн-Пт з 09:00 до 18:00,</li>
				<li>Сб з 10:00 до 15:30,</li>
				<li>Нд-вихідний</li>
			</ul>
		</div>
		<div class="footer-column">
			<h4>Інформація:</h4>
			<ul>
				{#each links as link}
					<li><a href={link.href}>{link.title}</a></li>
				{/each}
			</ul>
		</div>
	</div>
</div>

<style>
	.footer {
		width: 100%;
		background-color: var(--footer-background, #d8c9b9);
		padding: 20px 20px;
		color: #373737;
	}

	.container {
		display: flex;
		justify-content: center;
		margin: 0 auto;
		gap: 72px;
	}

	.footer-column {
		line-height: 1.6;
	}

	.footer-column ul {
		list-style: none;
	}

	.footer-column h4 {
		color: #373737;
		font-size: 18px;
		font-weight: bold;
		margin: 0px 0px 15px 0px;
	}

	.footer-column ul {
		margin: 8px 0px;
		padding: 0px;
		list-style: none;
	}

	.footer-column li {
		margin-bottom: 5px;
	}

	.footer-column a {
		text-decoration: none;
		color: #373737;
		transition: color 0.2s;
	}

	.footer-column a:hover {
		text-decoration: underline;
		color: #000000;
	}
</style>
