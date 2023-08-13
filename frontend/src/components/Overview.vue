<template>
    <div class="overview">
        <div class="primary">
            <div class="icon">
                <img :src="`icons/weather/${icon}.svg`" />
            </div>
            <div class="day">
                <h1>{{ dayLabel }}</h1>
                <div class="date">{{ getDate(date) }}</div>
            </div>
        </div>
        <div class="location">
            {{ location }}
        </div>
        <div class="stats">
            <div class="temp">
                <div class="main">
                    {{ temp }}
                </div>
                <div class="trend">
                    {{ temp_min }} / {{ temp_max }}
                </div>
            </div>
            <div class="secondary">
                <div class="wind">
                    <WindIcon />
                    <p>{{ wind }} km/h</p>
                </div>
                <div class="rain">
                    <RainIcon />
                    <p>{{ rain }} mm</p>
                </div>
                <div class="humidity">
                    <HumidityIcon />
                    <p>{{ humidity }} %</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import HumidityIcon from '../assets/stats/humidity.svg'
import RainIcon from '../assets/stats/rain.svg'
import WindIcon from '../assets/stats/wind.svg'

const dayLabels = ['Today', 'Tomorrow', 'In 2 days', 'In 3 days', 'In 4 days', 'In 5 days']

export default {
    name: 'Overview',
    components: {
        HumidityIcon,
        RainIcon,
        WindIcon
    },
    props: {
        icon: {
            type: String,
            default: undefined
        },
        date: {
            type: String,
            default: undefined
        },
        location: {
            type: String,
            default: undefined
        },
        temp: {
            type: Number,
            default: undefined
        },
        temp_min: {
            type: Number,
            default: undefined
        },
        temp_max: {
            type: Number,
            default: undefined
        },
        wind: {
            type: Number,
            default: undefined
        },
        rain: {
            type: Number,
            default: undefined
        },
        humidity: {
            type: Number,
            default: undefined
        },
        activeDay: {
            type: Number,
            default: 0
        }
    },
    methods: {
        getDate(date) {
            const dateStrings = date.split('-')
            return `${dateStrings[2]}.${dateStrings[1]}`
        }
    },
    computed: {
        dayLabel() {
            return dayLabels[this.activeDay]
        }
    }
}
</script>

<style lang="scss" scoped>
.overview {
    .primary {
        display: flex;
        width: 250px;
        margin: auto;
        .icon {
            width: 50%;
            display: grid;
            place-content: center;
            img {
                width: 60px;
                height: 60px;
            }
        }
        .day {
            width: 50%;
            h1 {
                margin: 0;
                white-space: nowrap;
            }
            .date {
                opacity: 0.8;
            }
        }
    }
    .location {
        margin-top: 20px;
        margin-bottom: 20px;
        text-align: center;
    }
    .stats {
        display: flex;
        justify-content: center;
        margin-bottom: 40px;
        .temp {
            text-align: center;
            .main {
                font-size: 100px;
                line-height: 1;
            }
            .trend {
                opacity: 0.8;
            }
        }
        .secondary {
            margin-top: 10px;
            margin-left: 40px;
            & > div {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                svg {
                    width: 20px;
                    height: 20px;
                    margin-right: 10px;
                }
                p {
                    margin: 5px 0;
                }
            }
        }
    }
}
</style>