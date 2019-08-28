<template>
    <div class="page-403">
        <ErrorPage
        >
            <img alt="" slot="img" src="../../../assets/image/error/500.svg">
        </ErrorPage>
    </div>
</template>
<script>
    import ErrorPage from '../../frames/error/errorPage';

    export default {
        'components': {
            ErrorPage
        }
    };
</script>
