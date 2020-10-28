<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>

<!-- 卡片 -->
<el-card class="box-card">

    <el-row :gutter="30" >
        <el-col :span="7" >
            <el-input placeholder="请输入内容"   v-model="queryInfo.query" clearable
            @clear="getUserList">
            <el-button slot="append" 
            icon="el-icon-search" @click="getUserList">
            </el-button>
             </el-input>
        </el-col>
        <el-col :span="4" >
            <el-button type="primary" @click="addDialogVisible = true" >添加用户</el-button>
        </el-col>
    </el-row>
    <!-- 用户列表区域 -->
    <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state"> 
            <template slot-scope="scope">
               <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)" >
               </el-switch>
           </template></el-table-column>
        <el-table-column label="操作" width="150px" >
            <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button type="primary"  icon="el-icon-edit" size="mini" 
                @click="showEditDialog(scope.row.id) " circle></el-button>
                <!-- 删除按钮 -->
                <el-button type="danger"  icon="el-icon-delete"  size="mini" 
                @click="removeUserById(scope.row.id)" circle></el-button>
                <!-- 分配角色按钮 -->
                <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false" >
                    <el-button type="warning"  icon="el-icon-setting"  
                    size="mini" @click="setRole(scope.row) " circle></el-button>
                </el-tooltip>
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

    <!-- 添加用户的对话框 -->
    <el-dialog
  title="添加用户"
  :visible.sync="addDialogVisible"
  width="50%" @close ="addDialogClosed" >
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px" >
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机号码" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改用户的对话框 -->
<el-dialog
  title="修改用户"
  :visible.sync="editDialogVisible"
  width="30%"
  :before-close="editDialogClosed">
  <el-form :model="editForm" :rules="addFormRules" 
  ref="editFormRef" label-width="80px" >
  <el-form-item label="用户名" >
    <el-input v-model="editForm.name" disabled ></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email" >
    <el-input v-model="editForm.email" ></el-input>
  </el-form-item>
  <el-form-item label="手机号" prop="mobile">
    <el-input v-model="editForm.mobile" ></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog>
     <!-- 分配角色的对话框 -->
     <el-dialog
  title="分配角色"
  :visible.sync="setRoleDialogVisible"
  width="50%"
  @close="setRoleDialogClose"
  >
  <div>
      <p>当前的用户：{{userInfo.username}} </p>
      <p>当前的角色：{{userInfo.role_name}} </p>
      <p>分配新角色：
           <el-select v-model="selectedRoleId" placeholder="请选择">
    <el-option
      v-for="item in roleList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
      </p>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>


<script>
export default {
    data(){
        // 验证邮箱的规则
        var checkEmail = (rule, value , cb) => {
            //验证邮箱的正则表达式
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ 

            if (regEmail.test(value)){
                return cb()
            }
            cb(new Error('请输入合法的邮箱！'))
        }
        var checkMobile = (rule, value , cb) => {
            //验证邮箱的正则表达式
            const regPhone = /^(13[0-9]|17[0-1,6-8]|15[^4,\\D]|18[0-9])[0-9]{8}$/

            if (regPhone.test(value)){
                return cb()
            }
            cb(new Error('请输入合法的手机号码！'))
        }
       return{
           queryInfo:{
               query: '',
               //当前页数
               pagenum: 1,
               //当前每页显示多少数据
               pagesize: 3
           },
           userList:[],
        //    需要被分配角色的用户信息
           userInfo:{},
           roleList:[],
        //    已选中的角色id值
        selectedRoleId:'',
           total:0,
           //控制添加用户对话框的显示或隐藏
           addDialogVisible: false,
        //    控制修改用户对话框的显示或隐藏
        editDialogVisible:false,
        // 控制分配角色对话框的显示或隐藏
        setRoleDialogVisible:false ,
        // 添加用户的表单数据
        addForm: {
            username: '' ,
            password: '' ,
            email: '',
            mobile: ''
        },
        // 查询的用户数据
        editForm:{

        },
        // 添加表单的验证规则
        addFormRules: {
            username:[
            {required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '用户名的长度在 3 到 10 个字符之间', trigger: 'blur' }
             ],
            password: [
                 {required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 10, message: '密码的长度在 6 到 10 个字符之间', trigger: 'blur' }

            ],
            email: [
                 {required: true, message: '请输入邮箱', trigger: 'blur' },
                 { validator: checkEmail , trigger: 'blur' }
            ],
            mobile: [
                 {required: true, message: '请输入手机号码', trigger: 'blur' },
                 { validator: checkMobile , trigger: 'blur' }
            ]
        }
       }
    },
    created(){
         this.getUserList()
    },
    methods: {
        async getUserList(){
           const {data: result} = await this.$http.get('users', { params:this.queryInfo })
           if(result.meta.status !==200) {
           return this.$message.error('获取用户列表失败！')
           }
           this.userList = result.data.users 
           this.total = result.data.total
           console.log(result)
         },
         //监听pagesize改变的事件
         handleSizeChange(newSize){
              this.queryInfo.pagesize = newSize
              this.getUserList()
         },
         //监听  页码值 改变的事件
         handleCurrentChange(newPage){
              //console.log(newPage)
              this.queryInfo.pagenum = newPage
              this.getUserList()
         },
         //监听switch开关的改变
         async userStateChange(userinfo){

                const {data : result} = await this.$http.put(
                 `users/${userinfo.id}/state/${userinfo.mg_state}`)
                 if (result.meta.status !== 200){
             userinfo.mg_state = !userinfo.mg_state
             return this.$message.error('更新用户状态失败！')
         }
          return this.$message.success('更新用户状态成功！')
        },
        addDialogClosed(){
            this.$refs.addFormRef.resetFields()
        },
        // 点击按钮添加新用户
        addUser(){
            this.$refs.addFormRef.validate(async valid =>{
                if (!valid) return
                // 可以发起添加用户的网络请求
                const {data:result } = await this.$http.post('users', this.addForm )

                if(result.meta.status !== 201 ){
                     this.$message.error('添加用户失败！')
                    }
                    this.$message.success('添加用户成功！')
                    // 隐藏添加用户的对话框
                    this.addDialogVisible = false
                    // 重新获取用户列表
                    this.getUserList()
               
            })
        },
        //    展示编辑用户的对话框
        async showEditDialog(id){
            
            const {data: result} = await this.$http.get('users/' + id)
            if(result.meta.status !== 200){
                return this.$message.error('查询用户信息失败！')
            }
            console.log(result)
            this.editForm = result.data
            this.editDialogVisible = true
        },
        // 监听修改用户对话框的关闭事件
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
             this.editDialogVisible = false
        },
        // 点击按钮修改用户
        editUserInfo(){

            this.$refs.editFormRef.validate(async valid =>{
                if (!valid) return
                // 可以发起添加用户的网络请求
                const {data:result}  = await this.$http.put('users/' + this.editForm.id,{
                email:this.editForm.email, 
                mobile:this.editForm.mobile} )
                console.log(result)
                if(result.meta.status !== 200 ){
                     this.$message.error('修改用户信息失败！')
                    }
                   
                    // 隐藏添加用户的对话框
                    this.editDialogVisible = false
                     // 重新获取用户列表
                    this.getUserList()
                    this.$message.success('修改用户信息成功！')
            })
        },
        // 根据用户id删除数据
        async removeUserById(id){
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
        const {data:result} = await this.$http.delete('users/' + id)
        if (result.meta.status !==200){
            return this.$message.error("删除失败！")
        }
        this.$message.success('删除成功！')
        this.getUserList()
        },
        async setRole(userInfo){
            this.userInfo =userInfo
            // 在展示对话框之前，获取所有角色的列表
             const {data: result} = await this.$http.get('roles')
            if (result.meta.status !== 200){
                return this.$message.error('获取角色列表失败')
            }

            this.roleList = result.data
            this.setRoleDialogVisible = true
            
        },
         async saveRoleInfo(){
           if(!this.selectedRoleId){
               return this.$message.error('请选择要分配的角色！')
           }

           const {data:result} =await  this.$http.put(`users/${this.userInfo.id}/role`,
           {
               rid: this.selectedRoleId
           } )
           console.log(result)
           if(result.meta.status !== 200){
               return this.$message.error('更新角色失败！')
           }
           console.log(result)
           this.$message.success('更新角色成功！')
           this.getUserList()
           this.setRoleDialogVisible = false
        },
        // 监听分配角色对话框的关闭事件
        setRoleDialogClose(){
            this.selectedRoleId= ''
            this.userInfo = {}
        }
    }
};
</script>

<style lang="less" scoped>

</style>