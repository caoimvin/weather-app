<template>
    <div class="trend">
        <p>Temperature</p>
        <div class="items">
            <div v-for="item in list" :key="item.time" class="item">
                <div class="bar-wrapper">
                    <div class="bar" :style="{ height: getBarHeight(item.temp, maxTemp) }" :class="item.temp <= 0 ? 'freeze' : ''">
                        <div class="value">{{ item.temp }}</div>
                    </div>
                </div>
                <div class="bar-label">
                    <img :src="`icons/weather/${item.weather}.svg`" />
                    <div class="time">{{ getTime(item.time) }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Trend',
    computed: {
        maxTemp() {
            return Math.max(...this.list.map(item => Math.abs(item.temp)))
        }
    },
    props: {
        list: {
            type: Array,
            default: []
        }
    },
    methods: {
        getBarHeight(itemHeight, maxHeight) {
            let height = (Math.abs(itemHeight) / maxHeight) * 100
            height = Number(height.toFixed(2))
            return `${height}%`
        },
        getTime(time) {
            return time.slice(0,5)
        }
    }
}
</script>

<style lang="scss" scoped>
.trend {
    margin-top: 40px;
    p {
        text-align: center;
    }
    .items {
        display: flex;
        justify-content: center;
        .item {
            margin-right: 20px;
            .bar-wrapper {
                height: 200px;
                display: flex;
                align-items: flex-end;
                position: relative;
                padding-top: 20px;
                .bar {
                    background: #303061;
                    border-radius: 50px;
                    width: 40px;
                    margin-left: auto;
                    margin-right: auto;
                    margin-top: auto;
                    position: relative;
                    transition: height 0.3s ease-in-out;
                    min-height: 20%;
                    max-height: 100%;
                    .value {
                        position: absolute;
                        top: 10px;
                        left: 0;
                        right: 0;
                        margin: auto;
                        text-align: center;
                    }
                    &.freeze {
                        background: rgba(#303061, 0.3);
                        border: 2px solid #303061;
                    }
                }
                &:before {
                    position: absolute;
                    content: "";
                    left: 0;
                    right: 0;
                    width: 2px;
                    height: 100%;
                    margin: auto;
                    background-image: linear-gradient(#303061 33%, #10103A 0%);
                    background-position: right;
                    background-size: 2px 15px;
                    background-repeat: repeat-y;
                    z-index: -1;
                }
            }
            .bar-label {
                text-align: center;
                img {
                    margin-top: 10px;
                    margin-bottom: 10px;
                    height: 20px;
                    width: 20px;
                }
            }
        }
    }
}
</style>