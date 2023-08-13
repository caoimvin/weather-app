<template>
    <div class="forecast">
        <template v-for="(day, index) in days" :key="day.date">
            <div class="day" @click="setActiveDay(index)" :class="index === activeDay ? 'active' : ''">
                <div class="date">{{ getDate(day.date) }}</div>
                <div class="icon">
                    <Icon :name="day.weather" />
                </div>
                <div class="temp">
                    {{ day.temp_min }} / {{ day.temp_max }}
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import Icon from './Icon.vue'

export default {
    name: 'Forecast',
    components: {
        Icon
    },
    props: {
        days: {
            type: Array,
            default: []
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
        },
        setActiveDay(index) {
            this.$emit('setActiveDay', index)
        }
    }
}
</script>

<style lang="scss">
.forecast {
    display: flex;
    justify-content: center;
    .day {
        background: #303061;
        border: 2px solid #34375B;
        border-radius: 50px;
        padding: 10px;
        text-align: center;
        margin-right: 10px;
        cursor: pointer;
        transition: transform 0.3s ease-in-out;
        .date {
            margin-top: 10px;
            font-size: 15px;
        }
        .icon {
            background: #1A1A42;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: grid;
            place-items: center;
            margin-top: 10px;
            margin-bottom: 10px;
            svg {
                width: 25px;
                height: 25px;
            }
        }
        .temp {
            font-size: 18px;
            margin-bottom: 10px;
        }
        &.active {
            background: #fff;
            color: #303061;
            transform: translateY(-20px);
            .icon {
                background: #DEEAF7;
                svg path {
                    fill: #4896E9;
                }
            }
        }
    }
}
</style>