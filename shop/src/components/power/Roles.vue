<template>
    <div>
        <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

     <!-- 卡片视图 -->
    <el-card>
        <el-row > 
            <el-col class="col_1">
                <el-button type="primary"  @click="addRoleVisible = true" >添加角色</el-button>
            </el-col>
        </el-row>
        <!-- 角色列表区域 -->
        <el-table :data="roleList" border stripe >
            <!-- 展开列 -->
            <el-table-column type="expand" >
                <template slot-scope="scope">
                    <el-row class="rowBorder vcenter" 
                    v-for="(item1, i1) in scope.row.children"
                    :key="item1.id"  >
                        <!-- 渲染一级权限 -->
                        <el-col :span="5">
                            <el-tag closable @close="removeRightById(scope.row ,item1.id) "> {{item1.authName}} </el-tag>
                            <i class="el-icon-arrow-right"></i>
                            </el-col>
                        <!-- 渲染二级和三级权限 -->
                        <el-col :span="19">
                            <!-- 通过for循环嵌套渲染二级权限 -->
                            <el-row class="rolBorder vcenter"
                            v-for="(item2, i2) in item1.children" 
                             :key="item2.id" >
                                <el-col :span="6">
                                    <el-tag type="success" closable @close="removeRightById(scope.row ,item2.id) " > {{item2.authName}} </el-tag>
                                    <i class="el-icon-arrow-right"></i>
                                </el-col>
                                <el-col :span="18">
                                    <el-tag type="warning" v-for="(item3,i3) in item2.children " 
                                    :key="item3.id"  closable @close="removeRightById(scope.row ,item3.id) " >
                                         {{item3.authName}} 
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" ></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px">
                <template slot-scope ="scope">
                   <el-button type="primary"  icon="el-icon-edit" size="mini" 
                    @click="showEditRoleDialog(scope.row.id) ">编辑</el-button>
                <!-- 删除按钮 -->
                <el-button type="danger"  icon="el-icon-delete"  size="mini" 
                  @click="removeRoleById(scope.row.id) " >删除</el-button>
                <el-button type="warning"  icon="el-icon-setting"  
                    size="mini" @click="showSetRightDialog(scope.row) " >分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card> 

    <!-- 分配权限的对话框 -->
    <el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisible"
  width="50%" >
      <!-- 树形控件 -->
     <el-tree :data="rightList" :props="treeProps" show-checkbox
     node-key="id" default-expand-all 
     :default-checked-keys="defKeys" ref="treeRef" ></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>


     <!-- 添加用户的对话框 -->
    <el-dialog
  title="添加用户"
  :visible.sync="addRoleVisible"
  width="50%" @close ="addRoleClosed" >
  <el-form :model="addRoleForm" ref="addRoleRef" label-width="80px" >
  <el-form-item label="角色名称" >
    <el-input v-model="addRoleForm.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" >
    <el-input v-model="addRoleForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addRoleVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
</el-dialog>
   <!-- 修改角色 的对话框 -->
<el-dialog
  title="修改角色"
  :visible.sync="editRoleVisible"
  width="30%"
  @close="editRoleClosed">
  <el-form :model="editRoleForm" 
  ref="editFormRef" label-width="80px" >
  <el-form-item label="角色名称" >
    <el-input v-model="editRoleForm.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" >
    <el-input v-model="editRoleForm.roleDesc" ></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editRoleVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRoleInfo">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        //所有角色列表数据
        return{
        //所有角色列表数据
        roleList:[],
        // 所有权限的数据
        rightList:[],
        editRoleVisible: false,
        addRoleVisible : false,
        // 控制分配权限对话框的显示与隐藏
        setRightDialogVisible :false,
        // 添加用户的表单数据
        addRoleForm: {
            roleName:'',
            roleDesc:''
           },
           editRoleForm:{

           },
           treeProps:{
               label: 'authName',
               children:'children'
           },
        //    默认选中的的节点id值数组
        defKeys:[],
        // 当前即将分配权限的id
        roleId: ''
        }
    },
        

    created(){
        this.getRolesList()
    },
    methods:{
        //获取所有角色列表
        async getRolesList(){
             const {data: result} = await this.$http.get('roles')
            console.log(result)
            if (result.meta.status !== 200){
                return this.$message.error('获取角色列表失败')
            }

            this.roleList = result.data
        },
        // 关闭添加角色视图
        addRoleClosed(){
            this.$refs.addRoleRef.resetFields()
             this.addRoleVisible = false
        },
        editRoleClosed(){
             this.addRoleVisible = false
        },
    async addRole(){
            const {data:result } = await this.$http.post('roles', this.addRoleForm )
                 console.log(result)
                if(result.meta.status === 400 ){
                     this.$message.error('添加角色为空')
                    }
                   else if (result.meta.status !== 201 ) {
                        this.$message.error('添加角色失败！')
                    }
                  else{
                    this.$message.success('添加用户成功！')
                    // 隐藏添加用户的对话框
                    this.addRoleVisible = false
                    // 重新获取用户列表
                    this.getRolesList()
                  }
    },
            // 展示编辑角色的对话框
            async showEditRoleDialog(id){
                const {data: result} = await this.$http.get('roles/' + id)
            if(result.meta.status !== 200){
                return this.$message.error('查询角色信息失败！')
            }
            console.log(result)
            this.editRoleForm = result.data
            this.editRoleVisible = true
            },
           //点击按钮修改角色
          async editRoleInfo(){
               const {data:result}  = await this.$http.put('roles/' + this.editRoleForm.roleId,{
                roleName:this.editRoleForm.roleName, 
                roleDesc:this.editRoleForm.roleDesc} )
                console.log(result)
                if(result.meta.status !== 200 ){
                     this.$message.error('修改用户信息失败！')
                    }
                   
                    // 隐藏添加用户的对话框
                    this.editRoleVisible  = false
                     // 重新获取用户列表
                    this.getRolesList()
                    this.$message.success('修改用户信息成功！')
           },
           // 根据用户id删除数据
        async removeRoleById(id){
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
         console.log(confirmResult)
        // 如果用户取消了删除，则返回值为字符串cancel
        if (confirmResult !== 'confirm'){
            return this.$message.info('已取消删除')
        }
        const {data:result} = await this.$http.delete('roles/' +id)
        if (result.meta.status !==200){
            return this.$message.error("删除失败！")
        }
        this.$message.success('删除成功！')
        this.getRolesList()
        },
        // 根据id删除对应权限
        async removeRightById(role,id){
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
         //console.log(confirmResult)
        // 如果用户取消了删除，则返回值为字符串cancel
        if (confirmResult !== 'confirm'){
            return this.$message.info('已取消删除')
        }
        const {data:result} = await this.$http.delete(`roles/${role.id}/rights/${id} `)
        console.log(result)
        if (result.meta.status !==200){
            return this.$message.error("删除失败！")
        }
        this.$message.success('删除成功！')
        role.children = result.data
        },
        // 展示分配权限的对话框
        async showSetRightDialog(role){
            this.roleId = role.id
            const {data:result } = await this.$http.get('rights/tree')
                //  console.log(result)
                if(result.meta.status !== 200 ){
                    return this.$message.error('获取权限信息失败！')
                }
                // 吧获取到的权限数据保存
                this.rightList = result.data
                console.log(this.rightList)
                // 清空权限数组
                this.defKeys = []
                // 递归获取三级节点的id
                this.getLeafKeys(role,this.defKeys)
            this.setRightDialogVisible= true
        },
        // 通过递归的形式，获取角色下所有三级权限的id，并保存到defkeys数组中
        getLeafKeys(node,arr){
        //    如果当前node节点不包括children属性，则是三级节点
              if (!node.children){
                  return arr.push(node.id)
              }
              
              node.children.forEach(item=>
              this.getLeafKeys(item, arr))
          },
        //   向后台提交所分配的权限
        async allotRights(){
              const keys = [
                  ...this.$refs.treeRef.getCheckedKeys(),
                  ...this.$refs.treeRef.getHalfCheckedKeys()
              ]

              const idStr = keys.join(',')
              const {data: result} = await
              this.$http.post(`roles/${this.roleId}/rights` ,{ rids: idStr } )

              if(result.meta.status !==200){
                  return this.$message.error('分配权限失败！')
              }

              this.$message.success('分配权限成功！')
              this.getRolesList()
              this.setRightDialogVisible = false
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

.rowBorder:nth-child(1){
          border-top: 1px solid #eee;
}

.rowBorder{
    border-bottom: 1px solid #eee;
}
.rolBorder:nth-child(1){
          border-top:none;
}
.rolBorder{
          border-top: 1px solid #eee;
}
.el-tag{
    margin: 10px;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>