<template>
    <el-container class="home-con" >
        <el-header>
          <div class="logo_box" >
            <img class="shop_logo" src="../assets/shop.png" alt="">
            <span class="font_head" >电子商务后台管理系统</span>
          </div>
          <el-button type="info" @click="loginOut" >退出</el-button>
        </el-header>
     <el-container>
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <!-- 侧边栏菜单区域 -->
      <div class="toggle-button" @click="toggleClose" >
       |||
      </div>
       <el-menu
      background-color="#0092ca"
      text-color="#fff"
      active-text-color="#f56262" :unique-opened="true" :collapse="isCollapse"
      :collapse-transition="false" :router="true" :default-active="activePath" >
      <el-submenu  :index="item.id +'' " v-for="item in menulist" :key="item.id" >
        <!-- 一级菜单的模板区域 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconsObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
           </template>
           <el-menu-item  :index=" '/' + subtem.path " v-for="subtem in item.children" :key="subtem.id"
           @click="saveState('/' + subtem.path) " >
             <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-location"></i>
          <!-- 文本 -->
          <span>{{subtem.authName}}</span>
           </template>
           </el-menu-item>
      </el-submenu>
     </el-menu>
    </el-aside>
   <el-main>
     <router-view></router-view>
   </el-main>
  </el-container>
 </el-container>
</template>

<script>
export default {
  data(){
    return{
       menulist:[],
       iconsObj:{
         '125' : 'iconfont icon-user',
         '103' : 'iconfont icon-tijikongjian',
         '101' : 'iconfont icon-shangpin',
         '102' : 'iconfont icon-danju',
         '145' : 'iconfont icon-baobiao'
       },
       //是否折叠
       isCollapse: false,
       //被激活的连接地址
       activePath:''
    }
  },
  created(){
     this.getMenuList()
     this.activePath = window.sessionStorage.getItem('activePath')
  },
    methods : {
    loginOut(){
        window.sessionStorage.clear();
        this.$router.push('/login');
    },
    //获取所有的菜单
     async getMenuList(){
       const {data : result} = await this.$http.get('menus')
       if(result.meta.status !== 200) return this.$message.error(result.meta.msg)
       this.menulist = result.data
       console.log(result)
     },
     toggleClose(){
         this.isCollapse = !this.isCollapse
     },
     //保存链接激活状态
     saveState(activePath){
         window.sessionStorage.setItem('activePath' ,activePath)
         this.activePath = activePath
     }
  }
}
</script>

<style lang="less" scoped>
.font_head{
  padding-left: 20px;
}
.shop_logo{
  width: 60px;
  height: 60px;
  border-radius: 50%;
  
}
.home-con{
    height: 100%;
}
 .el-header{
     background-color: #3498db;
     display: flex;
     justify-content: space-between;
     padding-left: 5px;
     align-items: center;
     color: #fff;
     font-size: 30px;
     > div{
       display: flex;
       align-items: center;
     }
 }
 .el-aside{
     background-color: #0092ca;
     .el-menu{
       border-right: none;
     }
 }
 .el-main{
     background-color: #eaeaea;
 }
 .iconfont{
   margin-right: 10px;
 }
 .toggle-button{
   background-color: #0092ca;
   font-size: 10px;
   line-height: 25px;
   color: #fff;
   text-align: center;
   letter-spacing: 0.2em;
   cursor: pointer;
 }
</style>