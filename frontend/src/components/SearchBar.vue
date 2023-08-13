<template>
    <div class="search-bar">
        <div class="search">
            <input type="text" v-model="search" @keydown="handleKeydown" placeholder="Search for city...">
            <button @click="submitSearch">
                <SearchIcon />
            </button>
        </div>
    </div>
</template>

<script>
import SearchIcon from '../assets/search.svg'

export default {
    name: 'SearchBar',
    components: {
        SearchIcon
    },
    data() {
        return {
            search: ''
        }
    },
    methods: {
        submitSearch() {
            this.$emit('submitSearch', this.search)
        },
        handleKeydown(e) {
            if (e.key === 'Enter') this.submitSearch()
            this.$emit('enterSearch')
        }
    }
}
</script>

<style lang="scss" scoped>
.search-bar {
    position: absolute;
    top: 0;
    left: 0;
    background: #303061;
    border-bottom: 1px solid #34375B;
    width: 100%;
    height: 50px;
    box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);
    display: grid;
    place-items: center;
    .search {
        position: relative;
        input {
            background: rgba(#10103A, 0.5);
            border: 1px solid #34375B;
            border-radius: 50px;
            height: 30px;
            width: 300px;
            color: #fff;
            padding: 0 90px 0 20px;
        }
        button {
            position: absolute;
            top: 1px;
            right: 0;
            background: #10103A;
            border: none;
            border-radius: 50px;
            width: 80px;
            height: 30px;
            cursor: pointer;
            svg {
                width: 20px;
                height: 20px;
            }
        }
    }
}
</style>