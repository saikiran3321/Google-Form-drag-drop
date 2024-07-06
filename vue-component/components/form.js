import radio_template from './radio_template.js';
import checkbox_template from './checkbox_template.js';
import text_template from './text_template.js';
import title_template from './title_template.js';
import paragraph_template from './paragraph_template.js';
export default {
	data() {
		return {
			inputs_data: [
			{ 
				title: "Survey Form 1",
				desc: "Thank you for taking the time to help us improve our product.",
				inputs: [
				{
					title: "Text Template",
					type: "text",
					desc: "",
					mand: true,
					value: "",
					options: []
				},
				{
					title: "Paragraph Template",
					type: "paragraph",
					desc: "",
					mand: true,
					value: "",
					options: []
				},
				{
					title: "Radio Template",
					type: "radio",
					desc: "",
					mand: true,
					value: "",
					options: ['Option 1', 'Option 2', 'Option 3']
				},
				{
					title: "Checkbox Template",
					type: "checkbox",
					desc: "",
					mand: true,
					value: "",
					options: ['Option 1', 'Option 2', 'Option 3']
				},
				]
			},
			],
			dragging_item: null,
			dragging_survey_index: null,
			dragging_question_index: null,
			active_index: null,
			scroll_interval : null
		};
	},
	props: ["path"],
	mounted() {
		document.body.addEventListener('click', this.remove_active_class);
	},
	components: {
		"radio_template" : radio_template,
		"checkbox_template" : checkbox_template,
		"text_template" : text_template,
		"title_template" : title_template,
		"paragraph_template" : paragraph_template
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
				this.start_scrolling(-100);
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
					options: []
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
					options: ['Option 1','Option 2','Option 3']
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
			if(parseInt(option) > 1) {
				option = option
			}else {
				option = 0;
			}
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
              <template v-if="item.type === 'radio'">
              	<radio_template :dragging="dragging_item" :path='path' :item='item' :index='index' :active='active_index' :key_active='key' @class_active="class_active" @remove_options="remove_options" @add_option="add_option" @copy_list="copy_list" @delete_list="delete_list" @create_list="create_list" @create_list_header="create_list_header" @create_section="create_section" @drag_scroll="drag_scroll" @drag_start="drag_start" @drag_enter="drag_enter" @drag_ends="drag_ends"></radio_template>
              </template>
              <template v-else-if="item.type === 'checkbox'">
              	<checkbox_template :dragging="dragging_item" :path='path' :item='item' :index='index' :active='active_index' :key_active='key' @class_active="class_active" @remove_options="remove_options" @add_option="add_option" @copy_list="copy_list" @delete_list="delete_list" @create_list="create_list" @create_list_header="create_list_header" @create_section="create_section" @drag_scroll="drag_scroll" @drag_start="drag_start" @drag_enter="drag_enter" @drag_ends="drag_ends"></checkbox_template>
              </template>
              <template v-else-if="item.type === 'text'">
              	<text_template :dragging="dragging_item" :path='path' :item='item' :index='index' :active='active_index' :key_active='key' @class_active="class_active" @remove_options="remove_options" @add_option="add_option" @copy_list="copy_list" @delete_list="delete_list" @create_list="create_list" @create_list_header="create_list_header" @create_section="create_section" @drag_scroll="drag_scroll" @drag_start="drag_start" @drag_enter="drag_enter" @drag_ends="drag_ends"></text_template>
              </template>
              <template v-else-if="item.type === 'title'">
              	<title_template :dragging="dragging_item" :path='path' :item='item' :index='index' :active='active_index' :key_active='key' @class_active="class_active" @remove_options="remove_options" @add_option="add_option" @copy_list="copy_list" @delete_list="delete_list" @create_list="create_list" @create_list_header="create_list_header" @create_section="create_section" @drag_scroll="drag_scroll" @drag_start="drag_start" @drag_enter="drag_enter" @drag_ends="drag_ends"></title_template>
              </template>
              <template v-else-if="item.type === 'paragraph'">
              	<paragraph_template :dragging="dragging_item" :path='path' :item='item' :index='index' :active='active_index' :key_active='key' @class_active="class_active" @remove_options="remove_options" @add_option="add_option" @copy_list="copy_list" @delete_list="delete_list" @create_list="create_list" @create_list_header="create_list_header" @create_section="create_section" @drag_scroll="drag_scroll" @drag_start="drag_start" @drag_enter="drag_enter" @drag_ends="drag_ends"></paragraph_template>
              </template>
            </template>
          </ul>
        </template>
      </div>
    </div>
  `
};