export default {
	data() {
		return {
			inputs_data: []
			dragging_item: null,
			dragging_survey_index: null,
			dragging_question_index: null,
			active_index: null,
			scroll_interval : null
		};
	},
	props: ["path","inputs_data"],
	mounted() {
		document.body.addEventListener('click', this.remove_active_class);
	},
	beforeDestroy() {
		document.body.removeEventListener('click', this.remove_active_class);
	},
	methods: {
		start_scrolling:function(speed) {
			if (this.scroll_interval) return;
			this.scroll_interval = setInterval(() => {
				window.scrollBy(0, speed);
			}, 10);
		},
		stop_scrolling:function() {
			clearInterval(this.scroll_interval);
			this.scroll_interval = null;
		},
		drag_start:function(item, key, index) {
			this.dragging_item = item;
			this.dragging_survey_index = key;
			this.dragging_question_index = index;
		},
		drag_enter:function(key, index) {
			if (this.dragging_survey_index !== null && this.dragging_question_index !== null) {
				if (this.dragging_survey_index === key) {
					const dragged_item = this.inputs_data[key].inputs.splice(this.dragging_question_index, 1)[0];
					this.inputs_data[key].inputs.splice(index, 0, dragged_item);
					this.dragging_question_index = index;
				} else {
					const dragged_item = this.inputs_data[this.dragging_survey_index].inputs.splice(this.dragging_question_index, 1)[0];
					this.inputs_data[key].inputs.splice(index, 0, dragged_item);
					this.dragging_survey_index = key;
					this.dragging_question_index = index;
				}
			}
		},
		drag_scroll:function(key,index,event) {
			event.preventDefault();
			const { clientY } = event;
			const scroll_thread = 150;
			const { innerHeight } = window;

			if (clientY - scroll_thread  < scroll_thread) {
				this.startS_srolling(-100);
			} else if (clientY + scroll_thread > innerHeight - scroll_thread) {
				this.start_scrolling(100);
			} else {
				this.stop_scrolling();
			}
		},
		drag_ends:function() {
			this.dragging_item = null;
			this.dragging_survey_index = null;
			this.dragging_question_index = null;
			this.active_index = null;
			this.stop_scrolling();
		},
		class_active:function(event, index) {
			event.stopPropagation();
			this.active_index = index;
		},
		remove_active_class:function(event) {
			if (!event.target.closest('.list-group-item')) {
				this.active_index = null;
			}
		},
		copy_list: function(item,key,index) {
			const copy_list = JSON.parse(JSON.stringify(item));
			this.inputs_data[key].inputs.splice(index+1, 0, copy_list);
			setTimeout(() => {
				this.active_index = null;
			},50)
		},
		delete_list: function(key,index) {
			this.inputs_data[key].inputs.splice(index, 1);
			setTimeout(() => {
				this.active_index = null;
			},50)
		},
		create_list: function(key,index) {
			const new_list = {
					title: "",
					type: "radio",
					desc: "",
					mand: true,
					value: "",
					options: ['Option 1']
				};

			this.inputs_data[key].inputs.splice(index+1, 0, new_list);
			setTimeout(() => {
				this.active_index = null;
			},50)
		},
		create_list_header: function(key,index) {
			const new_list = {
					title: "",
					type: "title",
					desc: "",
					mand: true,
					value: "",
					options: ""
				};

			this.inputs_data[key].inputs.splice(index+1, 0, new_list);
			setTimeout(() => {
				this.active_index = null;
			},50)
		},
		create_section: function(key) {
			const new_section = { 
				title: "",
				desc: "",
				inputs: [
				{
					title: "",
					type: "radio",
					desc: "",
					mand: true,
					value: "",
					options: ['Option 1']
				},
				]
			};

			this.inputs_data.splice(key+1, 0, new_section);
			setTimeout(() => {
				this.active_index = null;
			},50)
		},
		remove_options: function(key,index,opt_index) {
			this.inputs_data[key].inputs[index].options.splice(opt_index, 1);
		},
		add_option: function(key,index,option) {
			const option_value = "Option "+(parseInt(option)+1);
			this.inputs_data[key].inputs[index].options.push(option_value);
		},
		save_data: function() {
			if(confirm("Are you sure to save data ?")) {
				const string = this.inputs_data;
				localStorage.setItem('added-items', JSON.stringify(string));
			}else {
				return false;
			}
		}
	},
	template: `
		<div class="container my-3 d-flex justify-content-end">
			<button class="btn btn-sm btn-dark" v-on:click="save_data()">Save</button>
		</div>
    <div class="container w-75">
      <div class="container w-75">
        <template v-for="(val, key) in inputs_data">
        	<div class="display-button" v-if="inputs_data.length > 1">
          	<button class="btn btn-sm btn-dark">Section {{ key+1 }} of {{ inputs_data.length }}</button>
          </div>
          <div class="heading">
            <div :class="inputs_data.length > 1 ? 'green-button' : 'green-bar'"></div>
            <div class="header-title"><input type="text" placeholder="Enter here.." class="form-control h1 add-border" v-model="val.title"></div>
            <div class="header-desc"><input type="text" placeholder="Enter here.." class="form-control" v-model="val.desc"></div>
          </div>
          <ul class="list-group" ref="list_group">
            <template v-for="(item, index) in val.inputs">
              <div class="d-flex">
                <li v-on:click="class_active($event, (key * 10) + index)" :class="(active_index != null && active_index === (key * 10) + index) ? 'active-class list-group-item drag-over heading w-100' : 'list-group-item heading w-100'" :key="item.id" :class="{ dragging: dragging_item === item }" draggable="true" @dragstart="drag_start(item, key, index)" @dragover.prevent="drag_scroll(key,index,$event)" @dragenter.prevent="drag_enter(key, index)" @dragend="drag_ends">
                	<div class="green-bar" v-if="item.type === 'title'"></div>
                  <button class="drag-button">
                    <i class="bi bi-arrows-move" title="Drag"></i>
                  </button>
                  <div class="d-flex header-title justify-content-between">
                    <div><input type="text" class="form-control" v-model="item.title" placeholder="Enter here.."></div>
                    <div v-if="(active_index != null && active_index === (key * 10) + index) && item.type != 'title'">
                    	<select class="form-select" aria-label="Default select example" v-model="item.type">
												<option value="text">Short answer</option>
												<option value="paragraph">Paragraph</option>
												<option value="radio">Multiple choice</option>
												<option value="checkbox">checkboxes</option>
											</select>
                    </div>
                  </div>
                  <div class="header-desc">
                  	<!-- <div class="mb-3">
                  	<input type="text" class="form-control add-border" v-model="item.desc" placeholder="Enter description here..">
                  	</div> -->
                    <template v-if="item.type === 'paragraph'">
                      <textarea class="form-control add-border" v-model="item.value" placeholder="Enter here.."></textarea>
                    </template>
                    <template v-else-if="item.type === 'text'">
                      <input type="text" class="form-control add-border" v-model="item.value" placeholder="Enter here..">
                    </template>
                    <template v-else-if="item.type === 'title'">
                      <input type="text" class="form-control add-border" v-model="item.value" placeholder="Enter Title here..">
                    </template>
                    <template v-else-if="item.type === 'radio'">
                    	<div class="d-flex justify-content-between" v-for="(val, ind) in item.options" >
	                      <div :key="ind" class="form-check">
	                        <input class="form-check-input" type="radio" :name="'radio' + (key * 10) + index" :id="'radio' + (key * 10) + index + '-' + ind">
	                        <label class="form-check-label" :for="'radio' + (key * 10) + index + '-' + ind">
	                        	<input type="text" class="form-control" v-model="item.options[ind]" placeholder="Enter here.." v-if="(active_index != null && active_index === (key * 10) + index)">
	                          <template v-else>{{ val }}</template>
	                        </label>
	                      </div>
	                      <button><i class="bi bi-x" v-if="(active_index != null && active_index === (key * 10) + index)" v-on:click="remove_options(key,index,ind)"></i></button>
                      </div>
                      <div v-if="(active_index != null && active_index === (key * 10) + index)">
                      	<div class="form-check">
	                        <input class="form-check-input" type="radio" >
	                        <label class="other-data form-check-label">
	                          <button v-on:click="add_option(key,index,item.options.length)">Add Option</button> or <button class="active" v-on:click="add_option(key,index,item.options.length)">add "Other"</button>
	                        </label>
	                      </div>
                      </div>
                    </template>
                    <template v-else-if="item.type === 'checkbox'">
                    	<div class="d-flex justify-content-between" v-for="(val, ind) in item.options">
	                      <div :key="ind" class="form-check">
	                        <input class="form-check-input" type="checkbox" :id="'checkbox' + (key * 10) + index + '-' + ind">
	                        <label class="form-check-label" :for="'checkbox' + (key * 10) + index + '-' + ind">
	                          <input type="text" class="form-control" v-model="item.options[ind]" placeholder="Enter here.." v-if="(active_index != null && active_index === (key * 10) + index)">
	                          <template v-else>{{ val }}</template>
	                        </label>
	                      </div>
	                      <button><i class="bi bi-x" v-if="(active_index != null && active_index === (key * 10) + index)" v-on:click="remove_options(key,index,ind)"></i></button>
	                    </div>
	                    <div v-if="(active_index != null && active_index === (key * 10) + index)">
                      	<div class="form-check">
	                        <input class="form-check-input" type="checkbox" >
	                        <label class="other-data form-check-label">
	                          <button v-on:click="add_option(key,index,item.options.length)">Add Option</button> or <button class="active" v-on:click="add_option(key,index,item.options.length)">add "Other"</button>
	                        </label>
	                      </div>
                      </div>
                    </template>
                  </div>
                  <div v-if="(active_index != null && active_index === (key * 10) + index)">
                    <div class="row">
                      <div class="col-7"></div>
                      <div class="col-5">
                        <div class="d-flex justify-content-between">
                          <button>
                            <i class="bi bi-clipboard" title="Copy" v-on:click="copy_list(item,key,index)"></i>
                          </button>
                          <button>
                            <i class="bi bi-trash" title="Delete" v-on:click="delete_list(key,index)"></i>
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
                <div v-if="(active_index != null && active_index === (key * 10) + index)" class="list-button">
									<button class="button-padding">
										<i class="bi bi-plus-circle" title="Add Question" v-on:click="create_list(key,index)"></i>
									</button>
									<!-- <button class="button-padding">
										<i class="bi bi-file-earmark-arrow-down" title="Import Question"></i>
									</button> -->
									<button class="button-padding">
										<i class="bi bi-fonts" title="Add Title" v-on:click="create_list_header(key,index)"></i>
									</button>
									<button class="button-padding">
										<i class="bi bi-image" title="Add Image"></i>
									</button>
									<button class="button-padding">
										<i class="bi bi-view-stacked" title="Add Section" v-on:click="create_section(key)"></i>
									</button>
                </div>
              </div>
            </template>
          </ul>
        </template>
      </div>
    </div>
    `
};