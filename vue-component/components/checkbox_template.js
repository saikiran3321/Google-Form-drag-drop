export default {
	name : "checkbox_template",
	data() {
		return {
			key: null
		};
	},
	props: ["path", "item", 'index', 'active', 'key_active', 'dragging'],
	mounted() {
		this.key = this.key_active
	},
	methods: {
		class_active: function(event, index) {
			this.$emit("class_active", event, index);
		},
		remove_options: function(key, index, opt_index) {
			this.$emit("remove_options", key, index, opt_index);
		},
		add_option: function(key, index, option) {
			this.$emit("add_option", key, index, option);
		},
		copy_list: function(item, key, index) {
			this.$emit("copy_list", item, key, index);
		},
		delete_list: function(key, index) {
			this.$emit("delete_list", key, index);
		},
		create_list: function(key, index) {
			this.$emit("create_list", key, index);
		},
		create_list_header: function(key, index) {
			this.$emit("create_list_header", key, index);
		},
		create_section: function(key) {
			this.$emit("create_section", key);
		},
		drag_scroll: function(key, index, event) {
			this.$emit("drag_scroll", key, index, event);
		},
		drag_start: function(item, key, index) {
			this.$emit("drag_start", item, key, index);
		},
		drag_enter: function(key, index) {
			this.$emit("drag_enter", key, index);
		},
		drag_ends: function() {
			this.$emit("drag_ends");
		}
	},
	template: `
		<div class="d-flex">
			<li @click="class_active($event, (key * 10) + index)" :class="(active != null && active === (key * 10) + index) ? 'active-class list-group-item drag-over heading w-100' : 'list-group-item heading w-100'" :key="item.id" :class="{ dragging: dragging === item }" draggable="true" @dragstart="drag_start(item, key, index)" @dragover.prevent="drag_scroll(key, index, $event)" @dragenter.prevent="drag_enter(key, index)" @dragend="drag_ends">
				<button class="drag-button">
					<i class="bi bi-arrows-move" title="Drag"></i>
				</button>
				<div class="d-flex header-title justify-content-between">
					<div><input type="text" class="form-control" v-model="item.title" placeholder="Enter here.."></div>
					<div v-if="(active != null && active === (key * 10) + index)">
						<select class="form-select" aria-label="Default select example" v-model="item.type">
							<option value="text">Short answer</option>
							<option value="paragraph">Paragraph</option>
							<option value="radio">Multiple choice</option>
							<option value="checkbox">checkboxes</option>
						</select>
					</div>
				</div>
				<div class="header-desc">
					<div class="d-flex justify-content-between" v-for="(val, ind) in item.options">
						<div :key="ind" class="form-check">
							<input class="form-check-input" type="checkbox" :name="'checkbox' + (key * 10) + index" :id="'checkbox' + (key * 10) + index + '-' + ind">
							<label class="form-check-label" :for="'checkbox' + (key * 10) + index + '-' + ind">
								<input type="text" class="form-control" v-model="item.options[ind]" placeholder="Enter here.." v-if="(active != null && active === (key * 10) + index)">
								<template v-else>{{ val }}</template>
							</label>
						</div>
						<button><i class="bi bi-x" v-if="(active != null && active === (key * 10) + index)" @click="remove_options(key, index, ind)"></i></button>
					</div>
					<div v-if="(active != null && active === (key * 10) + index)">
						<div class="form-check">
							<input class="form-check-input" type="checkbox">
							<label class="other-data form-check-label">
								<button @click="add_option(key, index, item.options.length)">Add Option</button> or <button class="active" @click="add_option(key, index, item.options.length)">add "Other"</button>
							</label>
						</div>
					</div>
				</div>
				<div v-if="(active != null && active === (key * 10) + index)">
					<div class="row">
						<div class="col-7"></div>
						<div class="col-5">
							<div class="d-flex justify-content-between">
								<button>
									<i class="bi bi-clipboard" title="Copy" @click="copy_list(item, key, index)"></i>
								</button>
								<button>
									<i class="bi bi-trash" title="Delete" @click="delete_list(key, index)"></i>
								</button>
								<div class="form-check form-switch">
									<label class="form-check-label" for="flexSwitchCheckChecked">Required</label>
									<input class="form-check-input" v-model="item.mand" type="checkbox" role="switch" id="flexSwitchCheckChecked">
								</div>
							</div>
						</div>
					</div>
				</div>
			</li>
			<div v-if="(active != null && active === (key * 10) + index)" class="list-button">
				<button class="button-padding">
					<i class="bi bi-plus-circle" title="Add Question" @click="create_list(key, index)"></i>
				</button>
				<button class="button-padding">
					<i class="bi bi-fonts" title="Add Title" @click="create_list_header(key, index)"></i>
				</button>
				<button class="button-padding">
					<i class="bi bi-image" title="Add Image"></i>
				</button>
				<button class="button-padding">
					<i class="bi bi-view-stacked" title="Add Section" @click="create_section(key)"></i>
				</button>
			</div>
		</div>`
};
