<template>
    <div>
        <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
        <el-row class="row_1"> 
            <el-col class="col_1">
                <el-button type="primary"  @click="showAddCateVisible()" >添加分类</el-button>
            </el-col>
        </el-row>
        <!-- 树形表格 -->
        <tree-table
      ref="table"
      sum-text="sum"
      index-text="#"
      :data="cateList"
      :columns="columns"
      :selection-type= "false"
      :expand-type = "false"
      :show-row-hover = "true"
      >
           <template slot="isok" slot-scope="scope">
            <i class="el-icon-success"
            style="color: green;"
            v-if="scope.row.cat_deleted === false"></i>
            <i class="el-icon-error"
            v-else style="color: red;"></i>
           </template>
        <!-- 排序 -->
           <template slot="order" slot-scope="scope">
             <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
             <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">标签</el-tag>
             <el-tag type="warning" size="mini" v-else>三级</el-tag>
           </template>

           <template slot="option" slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini"
              @click="showCateRoleDialog(scope.row.cat_id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"
              @click="removeCateRole(scope.row.cat_id)">删除</el-button>
           </template>
      </tree-table>
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
           <!-- 添加用户的对话框 -->
    <el-dialog
  title="添加分类"
  :visible.sync="addCateVisible"
  width="30%" @close ="addCateClosed" >
  <el-form :model="addCateForm" ref="addCateFormRef" label-width="80px" 
  :rules="addCateFormRules">
  <el-form-item label="分类名称" prop="cat_name" >
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级名称" >
      <!-- options用来指定数据源 -->
      <!-- props用来指定配置对象 -->
  <el-cascader
    v-model="selectedKeys"
    :options="parentCateList"
    :props="cascaderProps"
    @change="parentCateChange" clearable change-on-select></el-cascader>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCateVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
        <el-dialog
  title="更改分类"
  :visible.sync="editCatedialogVisible"
  width="30%" @close ="editCateClosed"
  >
   <el-form :model="editCateForm" ref="editCateFormRef" label-width="80px" 
  :rules="editCateFormRules">
  <el-form-item label="分类名称" prop="cat_name" >
    <el-input v-model="editCateForm.cat_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editCatedialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editCateInfo ">确 定</el-button>
  </span>
</el-dialog>

    </div>
</template>

<script>
export default {
    data(){
          return{
              queryInfo:{
               type: 3,
               //当前页数
               pagenum: 1,
               //当前每页显示多少数据
               pagesize: 10
           },
           total:0,
        //    商品分类的数据列表，默认为空
              cateList:[],
            //   为table指定列的定义
              columns:[
                  {
                      label:'商品分类',
                      prop:'cat_name'
                  },{
                      label:'是否有效',
                    //   表示将当前列定义为模板列
                    type: 'template',
                    // 表示当前这一列使用模板名称
                    template: 'isok'
                  },
                  {
                      label:'排序',
                    //   表示将当前列定义为模板列
                    type: 'template',
                    // 表示当前这一列使用模板名称
                    template: 'order'
                  },{
                      label:'操作',
                    //   表示将当前列定义为模板列
                    type: 'template',
                    // 表示当前这一列使用模板名称
                    template: 'option'
                  }
              ],
            //   控制添加对话框的显示与隐藏
            addCateVisible:false,
            // 添加分类的表单数据对象
            addCateForm:{
                // 将要添加分类的名称
                cat_name:'',
                // 父级分类id
                cat_pid:0,
                // 分类等级
                cat_level:0

            },
            // 添加分类表单的验证规则对象
            addCateFormRules:{
                cat_name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            },
             editCateFormRules:{
                cat_name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            },
            // 父级数据列表
            parentCateList:[

            ],
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
                expandTrigger: 'hover'
            },
            // 选中的父级分类的id数组
            selectedKeys:[],
            // 控制编辑分类按钮的显示
            editCatedialogVisible : false,
            // 编辑框的数据
            editCateForm:{

            },
          }
    },
    created(){
      this.getCateList()
    },
    methods:{
     async getCateList(){
        const{data:result}= await this.$http.get('categories' ,{params: this.queryInfo})
        if(result.meta.status !==200){
                  return this.$message.error('获取商品列表失败！')
      }
    //    把数据列表赋值给 cateList
        this.cateList = result.data.result
        this.total = result.data.total
    },
    // 监听pagesize事件
    handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getCateList()
    },
    handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getCateList()
    },
    // 获取父级分类列表
    async getParentCateList(){
        const{data:result}= await this.$http.get('categories' ,{params:{ type : 2}})
        if(result.meta.status !==200){
                  return this.$message.error('获取父级数据失败！')
                  
    }
                  this.parentCateList = result.data
  },
    showAddCateVisible(){
        this.getParentCateList()
        this.addCateVisible = true
    },
    addCateClosed(){
        this.addCateVisible = false
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys=[]
        this.addCateForm.cat_level=0
        this.addCateForm.cat_pid=0
    },
    // 选择项发生变化时触发这个函数
    parentCateChange(){
              // 如何selectKeys 数组的长度>0 说明选中父级分类
      if (this.selectedKeys.length > 0) {
        console.log(this.selectedKeys)
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 当前分类的等级
        this.addCateForm.cat_level = this.selectedKeys.length
        return 0
      } else {
        // 父级分类的Id
        this.addCateForm.cat_pid = 0
        // 当前分类的等级
        this.addCateForm.cat_level = 0
      }
    },
    addCate(){
        this.$refs.addCateFormRef.validate(async valid =>{
                if (!valid) return
                // 可以发起添加用户的网络请求
                const {data:result } = await this.$http.post('categories', this.addCateForm )

                if(result.meta.status !== 201 ){
                     this.$message.error('添加分类失败！')
                    }
                    this.$message.success('添加分类成功！')
                    this.getCateList()
                    this.addCateVisible = false
        })
    },
    // 编辑分类按钮的点击事件
    async showCateRoleDialog(id){
        const {data: result} = await this.$http.get('categories/' + id)
            if(result.meta.status !== 200){
                return this.$message.error('查询分类信息失败！')
            }
            
            console.log(result)
            this.editCateForm = result.data
            this.editCatedialogVisible = true
           
    },
     // 点击按钮修改分类名称
        async editCateInfo(){

                 this.$refs.editCateFormRef.validate(async valid =>{
                console.log(this.editCateForm)
                const {data:result}  = await this.$http.put('categories/' + this.editCateForm.cat_id,{
                cat_name:this.editCateForm.cat_name} )
                console.log(result)
                if(result.meta.status !== 200 ){
                     this.$message.error('修改分类信息失败！')
                    }
                   
                    // 隐藏添加用户的对话框
                    this.editCatedialogVisible = false
                     // 重新获取用户列表
                    this.getCateList()
                    this.$message.success('修改分类信息成功！')
                 })
            
     },
     async removeCateRole(id){
       // 弹框询问用户是否确认删除
         const confirmResult = await
         this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => {
            return error
        })
        // 如果用户确认删除，则返回值为字符串confirm
        // 如果用户取消了删除，则返回值为字符串cancel
        if (confirmResult !== 'confirm'){
            return this.$message.info('已取消删除')
        }
        const {data:result} = await this.$http.delete('categories/' + id)
        if (result.meta.status !==200){
            return this.$message.error("删除失败！")
        }
        this.$message.success('删除成功！')
        this.getCateList()
     },
     editCateClosed(){
        this.editCatedialogVisible = false
     }
   } 
}
</script>


<style lang="less" scoped>
.col_1{
    display: flex;
    justify-content: flex-end;
    padding-right: 30px;
}
.row_1{
    margin-bottom: 20px;
}
.el-cascader{
    width: 100%;
}
</style>