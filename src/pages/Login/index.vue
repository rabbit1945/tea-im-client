<template>
    <div class="logon login-form">
        <h1>登录</h1>

       <input type="text" v-model = "login" placeholder="账号"/>

       <input type="password" v-model="password" placeholder="密码"/>

        <button @click.prevent="userLogin" >登&nbsp;&nbsp;录</button>
        

    </div>
</template>
 
 <script>
 export default {
   name: "",
   data(){
        return {
            login: "",
            password: "",
        }
   },
   props: {
   
   },
   methods:{
    async userLogin() {
        try {
            //登录成功
            const { login, password } = this;
            login&&password&&(
                await this.$store.dispatch("userLogin", { login, password }).then (res => {
                    // if (res === true) {
                    //     console.log("登录日志",res)
                    //    return this.$store.dispatch("addUserLoginLogs")
                    // } 
                    alert("登录成功")
                }).catch(res=>{
                    alert("登录失败") 
                })
            );
            
            // 登录成功跳转页面
            this.$router.push('/');
        } catch (error) {
            alert(error.message);
            
        }

    }

   }
 }
 </script>
 
 <!-- Add "scoped" attribute to limit CSS to this component only -->
 <style scoped>

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
    margin:-160px 0 0 -200px; 
}


body {
    background-image: url(./images/猫.jpeg);
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
    margin-left: 100px;    
    margin-bottom: 30px;
    padding-left: 67px;

}
 </style>
 