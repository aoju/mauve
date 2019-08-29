<template>
    <div class="page-403">
        <ErrorPage
                code="404"
                desc="抱歉，你访问的页面不存在"
        >
            <img alt="" slot="img" src="../../../assets/img/errors/404.svg">
        </ErrorPage>
    </div>
</template>
<script>
    import ErrorPage from '../../frames/errors/errorPage';

    export default {
        'components': {
            ErrorPage
        }
    };
</script>
