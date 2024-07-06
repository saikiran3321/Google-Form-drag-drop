export default {
	props: ["path"],
	data() {
		return {
			newpath : null
		}
	},
	watch: {
        path(newPath) {
        	this.newpath = newPath;
        }
    },
	mounted() {},
	template: `
		<section id="navbar">
			<div class="row">
				<div class="col-4 log">
					<a href="./">Vue Drag and Drop</a>
				</div>
				<div class="col-8">
					<template v-if="newpath == '/'">
						<ul class="nav_links">
							<li><a href="./#/preview">Preview</a></li>
						</ul>
					</template>
					<template v-else>
						<ul class="nav_links">
							<li><a href="./#/">Form</a></li>
						</ul>
					</template>
				</div>
			</div>
		</section>
		`
}