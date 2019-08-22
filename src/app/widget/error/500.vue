<template>
    <div class="page-403">
        <ErrorPage
        >
            <img slot="img" src="../../../assets/image/error/500.svg" alt="">
        </ErrorPage>
    </div>
</template>
<script>
import ErrorPage from '../../exports/error/errorPage';
export default {
    'components': {
        ErrorPage
    }
};
</script>
