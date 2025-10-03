<script>
	import ico from '$lib/assets/icon-search-24x24.svg';
</script>

<div class="search">
	<input type="text" placeholder="Пошук продукції" />
	<img src={ico} alt="search" />
</div>

<style>
	.search {
		display: flex;
		align-items: center;
		background-color: #fff8ec;
		border-radius: 10px;
		padding: 5px 15px;
		border: 1px solid #e0d0c0;
	}

	.search img {
		width: 24px;
		height: 24px;
		margin-left: 10px;
		cursor: pointer;
	}

	.search input {
		width: 300px;
		max-width: 300px;
		border: none;
		background-color: transparent;
		padding: 0;
		outline: none;
		color: #373737;
	}

	.search input::placeholder {
		color: #b4a89c;
	}

	.search:hover {
		border-color: #a5a5a5;
		/* background-color: #fcf9f2; */
	}
</style>
