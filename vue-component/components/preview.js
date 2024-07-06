export default {
	data() {
		return {
			inputs_data: [],
			dragging_item: null,
			dragging_index: null,
		}
	},
	props: ["path"],
	mounted() {
		const retrievedObject = localStorage.getItem('added-items');
		this. inputs_data = JSON.parse(retrievedObject);
	},
	methods: {
	},
	template: `<div class="container w-75 my-5">
		<div class="container w-75">
			<template v-for="(val, key) in inputs_data">
				<div class="heading">
					<div class="green-bar"></div>
					<div class="header-title">{{ val.title }}</div>
					<div class="header-desc">{{ val.desc }}</div>
					<span class="text-danger">* Indicates required question</span>
				</div>
				<template v-for="(item, index) in val.inputs">
					<div class="heading">
						<div class="header-desc">{{ item.title }}</div>
						<div class="header-desc">
							<template v-if="item.type === 'paragraph'">
								<textarea class="form-control add-border" placeholder="Your answer" v-model="item.value"></textarea>
							</template>
							<template v-else-if="item.type === 'text'">
								<input type="text" class="form-control add-border" placeholder="Your answer" v-model="item.value">
							</template>
							<template v-else-if="item.type === 'radio'">
								<div v-for="(val, ind) in item.options" :key="ind" class="form-check">
									<input class="form-check-input" v-model="item.value" type="radio" :name="'radio' + index" :id="'radio' + index + '-' + ind">
									<label class="form-check-label" :for="'radio' + index + '-' + ind">
										{{ val }}
									</label>
								</div>
							</template>
							<template v-else-if="item.type === 'checkbox'">
								<div v-for="(val, ind) in item.options" :key="ind" class="form-check">
									<input class="form-check-input" v-model="item.value" type="checkbox" :id="'checkbox' + index + '-' + ind">
									<label class="form-check-label" :for="'checkbox' + index + '-' + ind">
										{{ val }}
									</label>
								</div>
							</template>
						</div>
					</div>
				</template>
			</template>
		</div>
		</div>`
}