<!DOCTYPE html>
<html lang="ar">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DeepSeek AI</title>

<style>
body{
    margin:0;
    background:#0f172a;
    font-family:Arial;
    color:white;
    display:flex;
    flex-direction:column;
    height:100vh;
}

.header{
    padding:15px;
    text-align:center;
    background:#111827;
    font-size:20px;
}

.messages{
    flex:1;
    overflow-y:auto;
    padding:15px;
}

.msg{
    padding:10px;
    margin:10px 0;
    border-radius:10px;
    max-width:75%;
    word-wrap:break-word;
}

.user{
    background:#2563eb;
    margin-left:auto;
}

.ai{
    background:#1f2937;
}

.input-area{
    display:flex;
    padding:10px;
    background:#111827;
}

input{
    flex:1;
    padding:12px;
    border:none;
    border-radius:8px;
    outline:none;
}

button{
    padding:12px;
    margin-left:5px;
    border:none;
    border-radius:8px;
    background:#22c55e;
    color:white;
    cursor:pointer;
}

button:hover{
    opacity:0.8;
}
</style>
</head>

<body>

<div class="header">🤖 DeepSeek AI Chat</div>

<div class="messages" id="messages"></div>

<div class="input-area">
    <input type="text" id="message" placeholder="اكتب رسالتك..." onkeydown="if(event.key==='Enter') sendMessage()">
    <button onclick="sendMessage()">إرسال</button>
</div>

<script>

function addMessage(text,type){
    let div=document.createElement("div");
    div.className="msg "+type;
    div.innerText=text;
    document.getElementById("messages").appendChild(div);
    document.getElementById("messages").scrollTop=999999;
}

async function sendMessage(){
    let input=document.getElementById("message");
    let text=input.value.trim();
    if(text==="") return;

    addMessage(text,"user");
    input.value="";

    let loading=document.createElement("div");
    loading.className="msg ai";
    loading.innerText="⏳ جاري التفكير...";
    document.getElementById("messages").appendChild(loading);

    try{
        let response=await fetch("api.php",{
            method:"POST",
            headers:{
                "Content-Type":"application/x-www-form-urlencoded"
            },
            body:"message="+encodeURIComponent(text)
        });

        let result=await response.text();

        loading.remove();
        addMessage(result,"ai");

    }catch(e){
        loading.remove();
        addMessage("❌ خطأ بالاتصال بالسيرفر","ai");
    }
}

</script>

</body>
</html>