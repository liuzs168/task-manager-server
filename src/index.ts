import app from "./app"
const port = process.env.PORT

app.listen(port,()=>{
      console.log(`服务已经启动->   http://localhost:${port}`);
})