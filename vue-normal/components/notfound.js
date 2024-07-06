export default {
    data() {
        return {}
    },
    mounted() {},
    methods: {},
    template: `<center><div class="mt-5 login-inner-wrapper">
        <article>
            <h2>404 - Page Not Found</h2>
            <p>The page <b>{{ $route.params.pathMatch[0] }}</b> you are looking for does not exist.</p>
        </article>
    </div></center>`
}