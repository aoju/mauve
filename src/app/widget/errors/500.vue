<template>
    <div class="page-403">
        <ErrorPage
        >
            <img alt="" slot="img" src="../../../assets/img/errors/500.svg">
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
