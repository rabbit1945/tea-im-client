<template>
<div class="logon login-form">
    <h1>注册</h1>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" label-position = "left" class="demo-ruleForm ">
      <el-form-item 
         prop="nick_name"
         :rules="[
            { required: true, message: '昵称不能为空'},
            { type: 'string', required: true, min: 3, message: '昵称大于3个字符'}
          ]"
      >
         <el-input type="nick_name" v-model="ruleForm.nick_name" autocomplete="off" placeholder = "昵称"></el-input>

      </el-form-item>

        <el-form-item 
         prop="login"
         :rules="[
            { required: true, message: '账号不能为空'},
            { type: 'string', required: true, min: 3, message: '账号大于3个字符'}
          ]"
         >
         <el-input type="login" v-model="ruleForm.login" autocomplete="off" placeholder = "账号"></el-input>

        </el-form-item>
        <el-form-item 
         prop="password"
         :rules="[
            { required: true, message: '密码不能为空'},
            { type: 'string', required: true, min: 6, message: '密码大于6个字符'}

          ]"
         >
        <el-input type="password" v-model="ruleForm.password" autocomplete="off" placeholder="密码"></el-input>
        </el-form-item>   

        <el-form-item 
         prop="confirm_password"
         :rules="[
            { required: true, message: '密码不能为空'},
            { type: 'string', required: true, min: 6, message: '密码大于6个字符'}

          ]"
         >
        <el-input type="password" v-model="ruleForm.confirm_password" autocomplete="off" placeholder="确认密码"></el-input>
        </el-form-item>  

           
        <el-form-item>
            <el-button class = "but" type="primary" @click="submitForm('ruleForm')">提交</el-button>
        </el-form-item>

  
            
        
    </el-form>

</div>
</template>
 
 <script>
 

 export default {
  name: "Register",
    data() {
    
      return {
        ruleForm: {
          nick_name:'',
          login:'',
          password: '',
          confirm_password:'',
        },
        rules:{

        },


      };
    },
    mounted() {
   
     
    },
    methods: {
    

      
      async submitForm(formName) {
        this.$refs[formName].validate(async(valid) => {
          if (valid) {
            
            try {
              //登录成功
              const { login, password,nick_name,confirm_password } = this.ruleForm;
              
              nick_name&&confirm_password&&login&&password&&(await this.$store.dispatch("userRegister", { login, password,nick_name,confirm_password}).then (res => {
              
                  if (res.code !== 10000) {
                    return this.$alert(res.msg)
                  }
                  // 登录成功跳转页面
                 return this.$router.push('/login');
                  }).catch(res=>{
                    return this.$alert(res) 
                  }) 
              )  
             
            } catch (error) {
              return this.$alert(error.message);
                
            }
          } else {
            return this.$alert("注册失败") 
          }
        });
      },
    }
  }
 </script>
 
 <!-- Add "scoped" attribute to limit CSS to this component only -->
 <style scoped>
.but {
    /* width: 300px !important; */
    margin-left: 47px!important;
}
.login-form{
    /* box-shadow: 0 2px 12px 0  ALICEBLUE;
    border-radius: 8px;  */
    width: 400px;
    height: 300px;
    max-width: 100%;
    padding: 0px 35px 0; 
    margin:auto;
    justify-content: center;
    align-items: center;
    height: 100vh;
    
}

.logon input {
    display: block;
    width: 200px;
    height: 30px;
    margin-top: 10px;
    margin-left: 100px;
    font-size: 15px;
    border: 1px solid aquamarine;
    border-radius: 12px;
    text-align: center;
}
.logon button {
    width: 200px;
    height: 40px;
    margin-top: 10px;
    margin-left: 100px;
    background-color: aquamarine;
    border: 1px solid transparent;
    cursor: pointer;
    border-radius: 12px;
}
    

.logon h1 {
    width: 200px;
    height: 30px;
    margin-top: 21px;
    margin-left: 139px;    
    margin-bottom: 30px;
    padding-left: 67px;

}
.icon {
  width: 1.5em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  font-size: 30px;
  cursor: pointer;
}

.icon-login {
  display: block;
  margin-left: 100px;
}


 </style>
 