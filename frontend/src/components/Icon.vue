<template>
    <component :is="currentIcon"></component>
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default {
    props: {
        name: {
            type: String,
            default: undefined
        }
    },
    computed: {
        currentIcon() {
            return defineAsyncComponent(() => import(`../assets/weather/${this.name}.svg`))
        }
    }
}
</script>

<style>
svg path {
    fill: #fff;
}
</style>