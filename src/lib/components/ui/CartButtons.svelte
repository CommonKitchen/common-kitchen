<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import QuantitySelector from '$lib/components/ui/QuantitySelector.svelte';

	import { cart } from '$lib/stores/cartStore.svelte';

	const { id, price, minOrder } = $props();

	const currentQuantity = $derived(cart.getItemQuantity(id));

	const minQuantity = minOrder ?? 1;

	function addProduct(event: MouseEvent) {
		event.stopPropagation();
		event.preventDefault();
		cart.updateQuantity(id, price, minQuantity);
	}

	function changeQuantity(quantity: number) {
		const newQuantity = currentQuantity + quantity;

		if (newQuantity < minQuantity && quantity < 0) {
			cart.removeItem(id);
			return;
		}

		if (newQuantity <= 0) {
			cart.removeItem(id);
			return;
		}

		cart.updateQuantity(id, price, newQuantity);
	}
</script>

<div class="controls-wrapper">
	{#if currentQuantity <= 0}
		<Button title="До кошика" stretch={true} onclick={addProduct} />
	{:else}
		<QuantitySelector quantity={currentQuantity} minOrder={minQuantity} {changeQuantity} />
	{/if}
</div>

<style>
	/* 💡 Обертка для сохранения высоты карточки */
	.controls-wrapper {
		/* Высота должна соответствовать высоте кнопки "До кошика" */
		min-height: 40px;
		display: flex;
		align-items: center;
		width: 100%;
	}
</style>
