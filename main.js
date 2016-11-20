enchant();
//ドロイド君の出現数
maxDroid = 30;　　　



//穴クラスの定義
Pit = Class.create(Sprite,{ //Spriteクラスを継承する
	initialize:function(x,y){
		enchant.Sprite.call(this,48,48); //Spriteクラスのコンストラクタ呼び出し
		this.image = game.assets['mogura.png'];
		this.x = x;
		this.y = y;
		this.addEventListener('enterframe',this.tick); //イベントリスナーを定義
		this.addEventListener('touchstart',this.hit); //叩いた場合のイベントリスナーを定義
		this.mode = 2; //ドロイド君の出現モードを待つ、からに設定
		this.nextMode = 0;
		this.waitFor =  game.frame+Math.floor(Math.random()*100);
	},
	tick:function(){ //ドロイド君が出るアニメーションを繰り返す
		if(game.frame%2!=0)return; //4フレームごとに実行する
		switch(this.mode){
			case 0: //穴からドロイド君がでてくる
				this.frame++;
				if(this.frame>=4){
					this.mode=2; 	//出切ったら、待つモードへ
					this.nextMode=1;//待った後に遷移するモードは1(隠れる)
					this.waitFor = game.frame+Math.floor(Math.random()*30);
				}
				break;
			case 1://ドロイド君が穴に隠れる
				this.frame--;
				if(this.frame<=0){
					this.mode=2;　	//出切ったら、待つモードへ
					this.nextMode=0;//待った後に遷移するモードは0(出現)
					this.waitFor = game.frame+Math.floor(Math.random()*200);

					//ドロイド君の最大数を減らす
					maxDroid--;
					//もしこれ以上ドロイド君は出現しないなら、穴を塞ぐ
					if(maxDroid<=0)this.mode=3;
				}
				break;
			case 2://待つ
				if(game.frame>this.waitFor){
					this.mode = this.nextMode;
				}
				break;
			case 3://なにもしない(この穴からもうドロイド君は出ない)
				break;
		}
	},
	hit:function(){ //ドロイド君を殴る
		if(this.frame==5)return;//既に殴れた状態だったらなにもしない
		if(this.frame>=2){ // ドロイド君が半分以上出ていた場合
			this.frame=5; //殴れたドロイド君
			this.mode=2;  //待ちモードに入る
			this.nextMode=1;
			this.waitFor = game.frame+10; //待つフレーム数は10で一定
			scoreLabel.add(1); //スコアに追加
			var sound1 = game.assets['hakai.mp3'].clone();
			sound1.play();
		}
	}
});
//ScoreLabelクラスの定義
ScoreLabel = Class.create(Label,{ //Labelクラスを継承する
	initialize:function(x,y){
		enchant.Label.call(this,"SCORE:0"); //Labelクラスのコンストラクタ呼び出し
		this.x=x;
		this.y=y;
		this.score = 0;
	},
	add:function(pts){ //スコアを加算
		this.score+=pts;
		this.text="SCORE:"+this.score; //表示を修正
	}
});
	window.onload = function(){//初期化
	game = new Game(320, 320);
	game.preload('mogura.png');//ドロイド君画像を読み込み
	game.pleload(['hakai.mp3']);
	game.onload = function(){


		//スコアラベルを表示
		scoreLabel=new ScoreLabel(5,5);
		game.rootScene.addChild(scoreLabel);

		//穴を4x4に並べる
		for(y=0;y<4;y++){
			for(x=0;x<4;x++){
				var pit = new Pit(x*48+20,y*48+20);
				game.rootScene.addChild(pit);
			}
		}
    }
    game.start();
}
