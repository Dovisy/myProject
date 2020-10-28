<template>
    <div class="login_container">
     <div class="login_box">
        <div class="avatar_box">
          <img src="../assets/qbhnxka.jpg" alt="">
        </div>
        <!-- 登录表单 -->
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
            <!-- 用户名 -->
          <el-form-item prop="username" >
             <el-input  v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password" >
             <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
          </el-form-item>
          <el-form-item class="btns">
             <el-button type="primary" @click="login" >登录</el-button>
             <el-button type="info" @click="resetLoginForm" >重置</el-button>
          </el-form-item>
        </el-form>
          </div>
    </div>
</template>
    


<script>
export default {
    data(){
        return{
            // 登录表单的数据绑定对象
            loginForm:{
                username:"admin",
                password:'123456'
            },
            //表单验证规则
            loginFormRules:{
                //验证用户名
                username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                //验证密码
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 10, message: '长度在 6到 10 个字符', trigger: 'blur' }
                ]
            }
        };
    },
    //重置表单数据
    methods:{
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields();
        },
        login(){
            this.$refs.loginFormRef.validate( async valid=>{
                if(!valid) return;
                const {data : result} = await this.$http.post('login',this.loginForm);
                if(result.meta.status !== 200) return this.$message.error("登录失败！");
                this.$message.success("登录成功");
                window.sessionStorage.setItem("token", result.data.token);
                this.$router.push('/users')
            });
        }
    }
};
</script>

<style lang="less"  scoped >
.login_container{
    background-color: #7cabb1;
    height: 100%;
}

.login_box{
    width: 450px;
    height: 300px;
    background-color:#fff ;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);

    .avatar_box{
        height: 100px;
        width: 100px;
        border: 3px solid #eee;
        border-radius: 50%;
        //padding: 10px;
        box-shadow: 0 0 2px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }
}
.login_form{
    position: absolute;
    bottom: 10px;
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;
}

.btns{
    //弹性布局
    display: flex;
    justify-content: flex-end;
}
</style>