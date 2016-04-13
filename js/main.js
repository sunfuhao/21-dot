 
/*
BY 孙福浩 main.js
*/

  //点击开始游戏执行发牌
    function StarGame_fn(img_url,ctx,img_urlcopy,host,player){

      img_url = JSON.parse(JSON.stringify(img_urlcopy)) // 重复开始时深度复制原始资源

      host.key = [random(13,0),random(13,0)]; //庄主的始牌
      host.hasA = false;  //庄主明牌是A的标志

      if(host.key[1] ==1){host.hasA = true;} //庄主明牌是A的标志
      host.result = 0; //庄主的总分
      host.firstWid = 440; //庄主的第一张牌x坐标
      host.firstHei = 80; //庄主的第一张牌y坐标
      host.allindex = [img_url[host.key[0]].splice(random(img_url[host.key[0]].length,0)-1,1),img_url[host.key[1]].splice(random(img_url[host.key[0]].length,0)-1,1)] //庄主的牌的集合

      player.key = [random(13,0),random(13,0)]; //玩家的始牌
      player.result = 0;  //玩家的总分 
      player.firstWid = 430;//玩家第一张牌的x坐标
      player.firstHei = 330;//玩家第一张牌的y坐标
      player.safe = false;

      warming.style.display ="none"; //初始化warming
      warming.innerHTML="";


      ctx.clearRect(0,0,1000,500);
      drawImg(ctx,img_url.bg[0],0,0,1000,500); //绘制背景
 
      drawImg(ctx,host.allindex[0],host.firstWid, host.firstHei,80,80);//绘制庄主的第一张牌
      drawImg(ctx,img_url["back"][0],host.firstWid, host.firstHei,80,80);//绘制庄主的遮挡牌
      drawImg(ctx,host.allindex[1],host.firstWid+20, host.firstHei,80,80);     //绘制庄主的第二张牌
    
      
      //绘制玩家的牌
      drawImg(ctx,img_url[player.key[0]].splice(random(img_url[player.key[0]].length,0)-1,1), player.firstWid,player.firstHei,100,100);
      
      drawImg(ctx,img_url[player.key[1]].splice(random(img_url[player.key[0]].length,0)-1,1),player.firstWid+30,player.firstHei,100,100);
      host.result = allresult(host); //记录庄主的点数
      player.result = allresult(player);//记录玩家的点数

      toggle([pit,starGame,stand]); //改变拿牌按钮状态

      host.firstWid = host.firstWid +20; //改变庄主第一张牌坐标，为后续拿牌做准备
      player.firstWid = player.firstWid +30;//改变玩家第一张牌坐标，为后续拿牌做准备
      
      sAfe(host,player);//记录庄主是否明牌有A
    }
    //canvas绘制图片
    function drawImg(ctx,img,x,y,w,h){
      var temp = new Image();
      temp.src =img;
      ctx.drawImage(temp,x,y,w,h)
    }

    //获取两个数之间的随机数
    function random(max,min){
        return (Math.floor(Math.random() * (max - min)) + min+1);
    }

    //用于计算各自的点数
    function allresult(obj){
       obj.result = 0;
       for(i in obj.key){
        if(obj.key[i]>10){obj.key[i] =10}
        if(obj.key[i]==1){
          var temp = 0;

          for(j in obj.key){
           if(obj.key[j]>10){obj.key[j] =10}
            temp += obj.key[j];
          }

         if(temp+10<=21){
            obj.key[i]=11;
            obj.result =temp +10;
             obj.key[i]=1;
            return obj.result;
          }
        }
          obj.result+=obj.key[i];
      }
   
       return obj.result;
    }

    //点击pit 玩家再拿一张牌
    function Starpit(img_url,ctx,obj){
      obj.firstWid +=30;
      obj.key.push(random(13,0));
      obj.result = allresult(obj)
      drawImg(ctx,img_url[obj.key[obj.key.length-1]].splice(0,1),obj.firstWid,obj.firstHei,100,100);

      if(obj.result>21){
        warming.innerHTML = "超过了21点,你输了!-100积分";
        toggle([stand,pit,warming,starGame]);
        obj.scores -=100;
        score.innerHTML = obj.scores;
      }
    }

    //host 再拿一张牌
    function Hostpit(img_url,ctx,host,player){
      if(host.result<=17){
      var tempindex = img_url[host.key[0]].splice(random(img_url[host.key[0]].length,0)-1,1);
      host.firstWid +=20
      host.key.push(random(13,0));
      host.result = 0;
      host.result = allresult(host);
      host.allindex.push(tempindex)
      drawImg(ctx,tempindex,host.firstWid,host.firstHei,80,80);
      if(host.result>21){
        warming.innerHTML = "庄主超过了21点,你赢了! +100积分";
        toggle([stand,pit,warming,starGame]);
        player.scores -=100;
        score.innerHTML = player.scores;
      }
      }

    }

    //庄家明牌有A 庄家做的事情
    function sAfe(host,player){
      if(host.hasA){  //庄家明牌有A
        var safe = document.getElementById('safe'),
            unsafe = document.getElementById('unsafe');
            warming.innerHTML ="庄主有一张A，是否要买保险？";
            toggle([safe,unsafe,warming,pit,stand]) ;
            safe .onclick = function(){
            toggle([safe,unsafe,warming,pit,stand]); 
            player.safe = true; //记录庄家是否买保险
            }
            unsafe.onclick = function(){
            toggle([safe,unsafe,warming,pit,stand])
            }
      }
    }   

    //玩家放弃拿牌，比较大小
    function Starstand(host,playe,ctx,img_url){
      if(player.scores>0){//如果玩家还有积分的话

        if(host.hasA){    // 如果庄家明牌有A的话
          if(player.safe && host.result ==21){ //如果玩家买了保险，而且庄家是21点
            player.scores +=100
            warming.innerHTML = "恭喜你 你赢了！+100积分";
          }else{ //如果玩家买了保险，而且庄家不是21点
            host.scores +=100;
            player.scores -=100
            warming.innerHTML = "很遗憾 你输了！";
            console.log(host.result)
          }
        }else{  //如果庄家明牌有没A的话
        if(host.result>player.result){ //如果庄家点数大于玩家
          host.scores +=100;
          player.scores -=100;
          warming.innerHTML = "很遗憾 你输了！-100积分";
        }else if(host.result<player.result){//如果庄家点数小于玩家
          host.scores -=100;
          player.scores +=100
          warming.innerHTML = "恭喜你 你赢了！+100积分";
        }else{   //如果庄家点数等于玩家
          warming.innerHTML = "哇哦 平局！+0积分";
        }
        }
          score.innerHTML = player.scores;
          toggle([stand,pit,warming,starGame]);

       } else{                              //玩家没有积分了
        alert("您的积分已经输光啦！ 刷新游戏重新获得1000积分")  
       }

       for(var i=0;i<host.allindex.length;i++){
        drawImg(ctx,host.allindex[i],host.firstWid-(host.allindex.length-1)*20,host.firstHei,80,80); //庄家明牌
        host.firstWid = host.firstWid+20;
       }
      //drawImg(ctx,host.firstindex,310, host.firstHei,80,80); //庄家明牌
      //drawImg(ctx,host.secindex,330, host.firstHei,80,80);
    }
    //切换显示隐藏状态，如果显示，则会隐藏
    function toggle(objarr){
    for( i in objarr){
      if(getStyle(objarr[i],"display") =="block"){
        objarr[i].style.display ="none";
      }else{
         objarr[i].style.display ="block"
      }
      }
    }

    //获取某元素的某css属性
    function getStyle(obj,attr){
      if(obj.currentStyle){
      return obj.currentStyle[attr]
      }
      else{
      return getComputedStyle(obj,false)[attr]
      }
   }