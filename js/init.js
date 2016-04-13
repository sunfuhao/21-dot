/*
BY 孙福浩 初始化js
*/
    window.onload = function(){
      var canwidth =1000, //画布宽
          canheight=500;  //画布高
      var canvas = document.getElementById("canvas"),   //画布
          starGame = document.getElementById("starGame"),//开始游戏按钮
          score = document.getElementById("score"),     // 玩家积分
          warming = document.getElementById("warming"); //信息框
        canvas.width = canwidth;
        canvas.height = canheight;
        var ctx = canvas.getContext("2d");

        var isloaded = {load:false},//是否加载完
            img_url ={},    //存放所有图片
            img_urlcopy ={}, //复制一份
            host={scores:1000};        //庄主有1000积分
            player={scores:1000};        //玩家有1000积分

            loadResources(img_url,img_urlcopy,isloaded) //加载图片资源

   
        var timer_init = setInterval(function(){    //循环检测图片是否加载完了
          if(isloaded.load){
            toggle([starGame]); 
            clearInterval(timer_init);
            initGameData(img_url,ctx);      //初始化函数
            img_urlcopy = JSON.parse(JSON.stringify(img_url));//  将img_url 复制一份到img_urlcopy

            //点击开始按钮
            starGame.onclick = function(){
              var pit = document.getElementById("pit"),
                  stand = document.getElementById("stand");
                  
                  StarGame_fn(img_url,ctx,img_urlcopy,host,player); //开始游戏按钮函数
                  pit.onclick = function(){   //点击拿牌
                   Starpit(img_url,ctx,player); //拿牌函数
                   setTimeout(function(){
                    Hostpit(img_url,ctx,host,player);  //庄家拿牌函数
                   },1000)
                  }//pit

                  stand.onclick = function(){   //点击拿牌函数
                    Starstand(host,player,ctx,img_url); //停止拿牌函数
                  }

            }//starGame


          }//if
        },33,false)//timer_init

    }
      //加载图片资源
    function loadResources(img_url,img_urlcopy,isloaded){
        var all_imgnum, //一共有多少
            loaded_imgnum = 0;//加载了多少
            img_url["1"] = ["./images/A-1.jpg","./images/A-2.jpg","./images/A-3.jpg","./images/A-4.jpg"];
            img_url["2"] = ["./images/B-1.jpg","./images/B-2.jpg","./images/B-3.jpg","./images/B-4.jpg"];
            img_url["3"] = ["./images/C-1.jpg","./images/C-2.jpg","./images/C-3.jpg","./images/C-4.jpg"];
            img_url["4"] = ["./images/D-1.jpg","./images/D-2.jpg","./images/D-3.jpg","./images/D-4.jpg"];
            img_url["5"] = ["./images/E-1.jpg","./images/E-2.jpg","./images/E-3.jpg","./images/E-4.jpg"];
            img_url["6"] = ["./images/F-1.jpg","./images/F-2.jpg","./images/F-3.jpg","./images/F-4.jpg"];
            img_url["7"] = ["./images/G-1.jpg","./images/G-2.jpg","./images/G-3.jpg","./images/G-4.jpg"];
            img_url["8"] = ["./images/H-1.jpg","./images/H-2.jpg","./images/H-3.jpg","./images/H-4.jpg"];
            img_url["9"] = ["./images/I-1.jpg","./images/I-2.jpg","./images/I-3.jpg","./images/I-4.jpg"];
            img_url["10"] = ["./images/J-1.jpg","./images/J-2.jpg","./images/J-3.jpg","./images/J-4.jpg"];
            img_url["11"] = ["./images/L-1.jpg","./images/L-2.jpg","./images/L-3.jpg","./images/L-4.jpg"];
            img_url["12"] = ["./images/L-5.jpg","./images/L-6.jpg","./images/L-7.jpg","./images/L-8.jpg"];
            img_url["13"] = ["./images/L-9.jpg","./images/L-10.jpg","./images/L-11.jpg","./images/L-12.jpg"];
            img_url["bg"] = ["./images/bg.jpg"]; //背景图片
            img_url["back"] = ["./images/back.jpg"]; //反面扑克牌
            img_url["starimg"] = ["./images/starimg.jpg"]; //开始屏保
            img_url["icon"] = ["./images/star.jpg","./images/split.jpg"]; //一些图标
            
            all_imgnum =  img_url["1"].length +  img_url["2"].length +  img_url["3"].length +  img_url["4"].length +  img_url["5"].length +  img_url["6"].length+img_url["7"].length+img_url["8"].length+img_url["9"].length+img_url["10"].length+img_url["11"].length+img_url["12"].length+img_url["13"].length+img_url["bg"].length+img_url["back"].length+img_url["starimg"].length+img_url["icon"].length;

        for(i in img_url){ //循环加载 缓存图片
          for(j in img_url[i]){
            var img = new Image();
              img.src = img_url[i][j];
              img.onload = function() {
                loaded_imgnum++;   //重点在这！！！
              }
          }
        }

        timer_loaded = setInterval(function(){
          if(all_imgnum == loaded_imgnum){
            isloaded.load =true; //加载完成
            //console.log(isloaded)
            clearInterval(timer_loaded)
          }
        },33,false)
    }

    //初始化游戏数据
    function initGameData(img_url,ctx){
      drawImg(ctx,img_url.starimg[0],0,0,1000,500);  //画开始屏幕图片
      var playGame = document.getElementById('playGame'),
          starGame = document.getElementById('starGame'),
          scorebox = document.getElementById('scorebox'),
          mainGame = document.getElementById('mainGame');
          toggle([playGame]);
      playGame.onclick =function(){         //点击开始游戏
        this.style.display = "none";
        scorebox.style.display = "block";
        mainGame.style.display = "block";
       drawImg(ctx,img_url.bg[0],0,0,1000,500); //画游戏背景
       starGame.style.display = "block";
       score.innerHTML = 1000;  //初始化分数
       document.getElementById('mp3').play();

      }
    }