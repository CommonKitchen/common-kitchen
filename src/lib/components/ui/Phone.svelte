<script>
	import { formatPhoneNumber } from '$lib/utils/utils.js';
	import ico from '$lib/assets/icon-phone-24x24.svg';
	const { phone } = $props();
</script>

<a href="tel:${phone}" class="phone-link">
	<img src={ico} alt="phone" />
	<span>{formatPhoneNumber(phone)}</span>
</a>

<style>
	.phone-link {
		display: flex;
		align-items: center;
		gap: 5px; /* Отступ между иконкой и текстом */
		color: #373737;
		font-weight: 500;
		font-size: 16px;
		transition: color 0.2s;
		text-decoration: none;
	}

	.phone-link img {
		width: 32px;
		height: 32px;
		filter: grayscale(100%) brightness(0.7) opacity(0.85);
		transition: filter 0.2s;
	}

	.phone-link:hover {
		color: var(--main-color, #e24511);
	}

	.phone-link:hover img {
		filter: invert(33%) sepia(85%) saturate(7390%) hue-rotate(352deg) brightness(85%) contrast(98%);
	}

	.phone-link span {
		white-space: nowrap;
	}
</style>
