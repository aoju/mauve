<template>
    <a-modal
            :closable="false"
            :footer="null"
            @cancel="detailClose"
            class="task-detail-modal"
            title=""
            visible
            width="min-content"
    >
        <task-detail :taskCode="code" @close="detailClose"></task-detail>

    </a-modal>
</template>

<script>
    import taskDetail from '../../../exports/props/task.detail';

    export default {
        'name': 'task-detail-modal',
        'components': {
            taskDetail
        },
        data() {
            return {
                'loading': false,
                'code': this.$route.params.taskCode,
                'projectCode': this.$route.params.code
            };
        },
        created() {
            this.init();
        },
        'methods': {
            init() {
                this.loading = true;
            },
            detailClose() {
                const stageIndex = this.$route.query.from;
                let url = '';
                if (stageIndex) {
                    url = `?from=${stageIndex}`;
                }
                this.$router.push(`/project/space/task/${this.projectCode}${url}`);
            }
        }
    };
</script>


<style lang="less">
    .task-detail-modal {
        /*display: flex;*/
        /*justify-content: center;*/
        /*flex: 1;*/
        /*min-height: 1px;*/
        /*min-width: 1px;*/
        width: 1200px;

        &.ant-modal {
            padding-bottom: 0;
        }

        .ant-modal-content {
            /*width: 1200px;*/
            /*overflow: hidden;*/

            .ant-modal-body {
                padding: 0;
            }

        }
    }
</style>
