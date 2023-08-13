<template>
    <div class="search-result" @click="chooseCity">
        <div class="name">
            {{ `${name}, ${state}, ${country}` }}
        </div>
        <div class="coordinates">
            {{ `lat: ${lat}; lon: ${lon}` }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'SearchResult',
    props: {
        name: {
            type: String,
            default: ''
        },
        lat: {
            type: String || Number,
            default: ''
        },
        lon: {
            type: String || Number,
            default: ''
        },
        country: {
            type: String,
            default: ''
        },
        state: {
            type: String,
            default: ''
        }
    },
    methods: {
        chooseCity() {
            this.$emit('chooseCity', { lat: this.lat, lon: this.lon })
        }
    },
}
</script>

<style lang="scss" scoped>
.search-result {
    background: #303061;
    border: 2px solid #34375B;
    display: flex;
    max-width: 800px;
    justify-content: center;
    border-radius: 50px;
    margin: auto;
    margin-bottom: 20px;
    cursor: pointer;
    .coordinates {
        margin-left: 20px;
        opacity: 0.8;
    }
}
</style>