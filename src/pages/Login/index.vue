<template>
<div class="logon login-form">
    <h1>登录</h1>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" label-position = "left" class="demo-ruleForm ">
        <el-form-item 
         label="账号"
         prop="login"
         :rules="[
      { required: true, message: '账号不能为空'},
      { type: 'email', message: '账号必须是邮箱格式'}
    ]"
         >
         <el-input type="login" v-model="ruleForm.login" autocomplete="off"></el-input>

        </el-form-item>
        <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>      
        <el-form-item>
            <el-button class = "but" type="primary" @click="submitForm('ruleForm')">提交</el-button>
        </el-form-item>
    </el-form>

</div>
</template>
 
 <script>
 export default {
    data() {
      
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };

      
     
      return {
        ruleForm: {
          login:'',
          pass: '',
        },
        rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      
    }
  }
 </script>
 
 <!-- Add "scoped" attribute to limit CSS to this component only -->
 <style scoped>
.but {
    width: 300px !important;
    margin-left: 0px!important;
}
.login-form{
    box-shadow: 0 2px 12px 0  ALICEBLUE;
    border-radius: 8px; 
    width: 400px;
    height: 300px;
    max-width: 100%;
    padding: 0px 35px 0; 
    margin:auto;
    position:absolute; 
    top:50%;
    left:50%;
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
 </style>
 