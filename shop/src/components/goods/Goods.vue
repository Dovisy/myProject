<template>
    <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    
      <!-- 卡片视图 -->
    <el-card>
        <el-row :gutter="20"> 
            <el-col :span="8">
                <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodList" >
            <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
           </el-input>
            </el-col>
            <el-col :span="4" >
                <el-button type="primary"  @click="goAddPage" >添加商品</el-button>
            </el-col>
        </el-row>
        <!-- 树形表格 -->
         <!-- table表格区域 -->
         <el-table :data="goodList" border stripe>
             <el-table-column type="index">
             </el-table-column>
             <el-table-column label="商品名称" prop="goods_name">
             </el-table-column>
             <el-table-column label="商品价格(元) " prop="goods_price" width="110px">
             </el-table-column>
             <el-table-column label="商品重量" prop="goods_weight" width="90px">
             </el-table-column>
             <el-table-column label="创建时间" prop="add_time" width="170px">
                 <template slot-scope="scope">
                     {{scope.row.add_time | dataFormat}}
                 </template>
             </el-table-column>
              <el-table-column label="操作" width="120px">
                  <template slot-scope="scope">
                        <!-- 修改按钮 -->
                <el-button type="primary"  icon="el-icon-edit" size="mini" 
                @click="showEditDialog(scope.row.id) " circle></el-button>
                <!-- 删除按钮 -->
                <el-button type="danger"  icon="el-icon-delete"  size="mini" 
                @click="removeUserById(scope.row.goods_id)" circle margin-left="10px"></el-button>
                  </template>
             </el-table-column>
         </el-table>
       <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            
            queryInfo:{
                query:'',
               //当前页数
               pagenum: 1,
               //当前每页显示多少数据
               pagesize: 10
           },
           total:0,
        //    商品列表
             goodList:[],
        }
    },
    created(){
        this.getGoodList()
    },
    methods:{
         async getGoodList(){
             const {data:result} = await this.$http.get('goods', {params:this.queryInfo})
             if(result.meta.status !==200){
                  return this.$message.error('获取商品列表失败！')
      }
                 this.goodList = result.data.goods
                 this.total = result.data.total
         },
         // 监听pagesize事件
         handleSizeChange(newSize){
           this.queryInfo.pagesize = newSize
           this.getGoodList()
             },
         handleCurrentChange(newPage){
           this.queryInfo.pagenum = newPage
           this.getGoodList()
            },
        //  点击按钮显示编辑商品对话框
        showEditDialog(id){

        },
        // 点击按钮删除商品
        async removeUserById(id){
             const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const { data: res } = await this.$http.delete('goods/' + id
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败！')
      }
      this.$message.success('删除商品成功！')
      this.getGoodList()
        },
        goAddPage(){
            this.$router.push('/goods/add')
        },

    }
}
</script>

<style lang="less" scoped>
.el-col{
    margin: 15px 0px;
}
</style>