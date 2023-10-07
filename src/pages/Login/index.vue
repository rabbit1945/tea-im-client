<template>
<div class="logon login-form">
    <h1>登录</h1>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" label-position = "left" class="demo-ruleForm ">
        <el-form-item 
         prop="login"
         :rules="[
      { required: true, message: '账号不能为空'},
      { type: 'email', message: '账号必须是邮箱格式'}
    ]"
         >
         <el-input type="login" v-model="ruleForm.login" autocomplete="off" placeholder = "账号"></el-input>

        </el-form-item>
        <el-form-item 
         prop="password"
         :rules="[
            { required: true, message: '密码不能为空'},
            { type: 'string', required: true, min: 6, message: '密码大于5个字符'}

          ]"
         >
        <el-input type="password" v-model="ruleForm.password" autocomplete="off" placeholder="密码"></el-input>
        </el-form-item>      
        <el-form-item>
            <el-button class = "but" type="primary" @click="submitForm('ruleForm')">提交</el-button>
        </el-form-item>

          <span class="icon-login">
            <svg class="icon" aria-hidden="true" @click="otherLogin('gitee')">
              <use xlink:href="#icon-gitee"></use>
            </svg>

            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-github-fill"></use>
            </svg>
          </span>
        
    </el-form>

</div>
</template>
 
 <script>
 import { setToken, getToken,removeToken} from "@/utils/token";

 export default {
    data() {
    
      return {
        ruleForm: {
          login:'',
          password: '',
        },
        rules:{

        }
        
      };
    },
    created() {
      const CheckId = this.$cookies.get("PHPSESSID")
      console.log('PHPSESSID',CheckId);
    },
    methods: {
      async otherLogin(gitee){
        await this.$store.dispatch("giteeLogin",{
          'type':gitee
        }).then(res => {
          if (res !== false) {
            window.location.href = res.url
          }
        });

      },
      async submitForm(formName) {
        this.$refs[formName].validate(async(valid) => {
          if (valid) {
            
            try {
              //登录成功
              const { login, password } = this.ruleForm;
              console.log(login, password)
            
              login&&password&&(await this.$store.dispatch("userLogin", { login, password }).then (res => {
                  // if (res === true) {
                  //     console.log("登录日志",res)
                  //    return this.$store.dispatch("addUserLoginLogs")
                  // } 
                  
                  if (res.code === 20001) {
                    this.$alert("登录失败")
                    return;
                    
                  }
                  let toPath = this.$route.query.redirect||"/";
                  this.$router.push(toPath);
                  this.$alert("登录成功")
              }).catch(res=>{
                this.$alert("登录失败") 
              }) )  
              // 登录成功跳转页面
              this.$router.push('/');
            } catch (error) {
              this.$alert(error.message);
                
            }
          } else {
           
            this.$alert("登录失败") 
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
    position:absolute; 
    top:50%;
    left:80%;
    margin:-150px 0 0 -260px; 
}


/* body {
    background-image: url(./images/猫.jpeg);
} */



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
 