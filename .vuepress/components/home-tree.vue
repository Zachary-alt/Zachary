<template>
  <ul>
      <li v-for="(item,index) in list" :key="index">
          <h2 v-if="item.item">{{item.title}}</h2>
          <a v-else-if="item.path" :href="getHref(item.path)">{{item.title}}</a>
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
    },
    methods:{
        getHref(path){
            let prefix = '/Zachary',after=''
            if(path[path.length-1]==='/'){
                after=path
            }else{
                after=path+'.html'
            }
            return prefix+after
        }
    }
}
</script>

<style scoped>

</style>