<template>
    <div class="page-403">
        <ErrorPage
                code="403"
                desc="抱歉，你无权访问该页面"
        >
            <img alt="" slot="img" src="../../../assets/img/errors/403.svg">
        </ErrorPage>
    </div>
</template>
<script>
    import ErrorPage from '../../frames/errors/error.page';

    export default {
        'components': {
            ErrorPage
        }
    };
</script>
