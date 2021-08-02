<template>
  <ul>
      <li v-for="(item,index) in list" :key="index">
          <h2 v-if="item.item">{{item.title}}</h2>
          <a v-else-if="item.path" :href="'/zachary'+item.path">{{item.title}}</a>
          <template v-else>
              {{item.title}}
          </template>
          <homeTree :list="item.children"></homeTree>
      </li>
  </ul>
</template>

<script>
export default {
    name:'homeTree',
    props:{
        list:{
            type:Array,
            default:()=> {
                return []
            }
        }
    }
}
</script>

<style scoped>

</style>