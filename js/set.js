

$('.btn-janken-start').click(function () {
    $('.janken-aite').addClass("slideshow")
    $('.janken button').attr('disabled', false);
});

$('.btn-janken').click(function () {
    // じゃんけんをする
    Slot.janken($(this).attr("data-val"));
    // ボタンを非有効にする
    $('.janken button').attr('disabled', true);


});



(function (global) {
    "use strict";

    /*
     * スロットのリール回転速度(実行毎秒数)
     */
    var sec = 1000;

    /*
     * スロットのリール情報
     * ・スロットのリールelement
     * ・スロットのリール停止フラグ
     * ・スロットのリール回転数
     */
    var $reels = [],
        stopReelFlag = [],
        reelCounts = [],
        endReelFlag = [],
        reelEndPosion = [];


    /*
     * 位置情報
     */
    var slotFrameHeight = 0,
        slotReelsHeight = 0,
        slotReelItemHeight = 0,
        slotReelStart = 0,
        slotReelStartHeight = 0,
        atariHantei = null,
        atariGazo = null,
        atariGazo_img = ["img/yunicorn-atari.jpg", "img/cat-atari.jpg", "img/rion-atari.jpg", "img/zou-atari.jpg", "img/mukudori-atari.jpg", "img/dragon-atari.jpg", "img/hakucho-atari.jpg"];

    var slot_Atari = [[[0, 6], [1, 1], [2, 2]], [[0, 5], [1, 3], [2, 4]], [[0, 4], [1, 5], [2, 6]], [[0, 3], [1, 2], [2, 0]], [[0, 2], [1, 6], [2, 3]], [[0, 1], [1, 0], [2, 1]], [[0, 0], [1, 4], [2, 5]]]
    // ユニコーン、猫、ライオン、象、ムクドリ、ドラゴン、白鳥



    /**
     * スロット
     */
    var Slot = {
        /**
         * 初期化処理
         */
        init: function init() {
            $reels[0] = $reels[1] = $reels[2] = null;
            stopReelFlag[0] = stopReelFlag[1] = stopReelFlag[2] = false;
            endReelFlag[0] = endReelFlag[1] = endReelFlag[2] = false;
            reelCounts[0] = reelCounts[1] = reelCounts[2] = 0;
            reelEndPosion = [];
        },
        janken: function (index) {
            var kekka = []
            var hantei = null
            var aiko = [[0, 0], [1, 1], [2, 2]]
            var kachi = [[0, 1], [1, 2], [2, 0]]
            var make = [[0, 2], [1, 0], [2, 1]]

            kekka.push(Number(index), (Math.floor(Math.random() * 3)));
            console.log("結果", kekka);
            console.log("結果", kekka[1]);

            setTimeout(function () {
                if (kekka[1] == 0) {
                    $(".content img").attr("src", "img/janken-01.png");
                } else if (kekka[1] == 1) {
                    $(".content img").attr("src", "img/janken-02.png");
                } else if (kekka[1] == 2) {
                    $(".content img").attr("src", "img/janken-03.png");
                }
                $('.janken-aite').removeClass("slideshow");
                setTimeout(function () {
                    for (var i = 0; i < aiko.length; i++) {
                        if (aiko[i].toString() == kekka.toString()) {
                            $('.janken-aite li').remove();
                            $('.janken-aite').append("<h1>あいこ</h1>");
                            sec = 800;
                        } else if (kachi[i].toString() == kekka.toString()) {
                            $('.janken-aite li').remove();
                            $('.janken-aite').append("<h1>かち</h1>");
                            sec = 1000;
                        } else if (make[i].toString() == kekka.toString()) {
                            $('.janken-aite li').remove();
                            $('.janken-aite').append("<h1>まけ</h1>");
                            sec = 10;
                        }
                    }
                    $('.btn-start').attr('disabled', false);
                }, 1000);

            }, 2000);




        },
        /**
         * スタートボタンのクリックイベント
         */
        start: function () {
            for (var index = 0; index < 3; index++) {
                Slot.animation(index);
            }
        },
        /**
         * ストップボタンのクリックイベント
         */
        stop: function (index) {
            stopReelFlag[index] = true;
            if (stopReelFlag[0] && stopReelFlag[1] && stopReelFlag[2]) {


                // 全リール停止したらリセットボタンを押下できるようにする

                $('.btn-result').attr('disabled', false);
            }


        },
        result: function (index) {
            // endReelFlag[index] = true;
            // if (endReelFlag[0] == endReelFlag[1] == endReelFlag[2] == true) {
            for (var i = 0; i < slot_Atari.length; i++) {
                console.log("ストップー01", reelEndPosion);
                console.log("ストップー02", slot_Atari[i]);
                if (slot_Atari[i].toString() == reelEndPosion.toString()) {
                    atariHantei = true
                    atariGazo = atariGazo_img[i]
                } else {

                }
                $('.btn-reset').attr('disabled', false);
            }
            if (atariHantei == true) {
                $('.atari__efect').show();
                $(".result-show img").attr("src", atariGazo);
            } else {

            }


        },
        /**
         * 位置情報の初期化処理
         */
        resetLocationInfo: function () {
            slotFrameHeight = $('.slot-frame').outerHeight();
            slotReelsHeight = $('.reels').eq(0).outerHeight();
            slotReelItemHeight = $('.reel').eq(0).outerHeight();
            slotReelStart = 5 - 2;
            // リールの上下は、半分だけ表示させるための位置調整
            slotReelStartHeight = -slotReelsHeight;
            slotReelStartHeight = slotReelStartHeight + slotFrameHeight + ((slotReelItemHeight * 3 / 2) - (slotFrameHeight / 2));

            $('.reels').css({
                'top': slotReelStartHeight
            });
        },
        /**
         * スロットの回転アニメーション
         */
        animation: function (index) {
            console.log('アニメーション', '開始', index);
            if (reelCounts[index] >= 7) {
                reelCounts[index] = 0;
            }

            console.log('slotReelStartHeight', slotReelStartHeight);
            console.log('reelCounts[index]', reelCounts[index]);
            console.log('slotReelsHeight', slotReelsHeight);
            console.log('top', slotReelStartHeight + (reelCounts[index] * slotReelItemHeight));

            $('.reels').eq(index).animate({
                'top': slotReelStartHeight + (reelCounts[index] * slotReelItemHeight)
            }, {
                duration: sec,
                easing: 'linear',
                complete: function () {
                    console.log('アニメーション', '完了', index, reelCounts[index]);
                    console.log('リールフラグ', stopReelFlag[0], stopReelFlag[1], stopReelFlag[2]);
                    if (stopReelFlag[index]) {
                        console.log('アニメーション', 'ストップ', index, reelCounts[index]);
                        console.log('ストップリール', stopReelFlag[index], reelCounts[index], slotReelStartHeight);
                        //リール位置の取得
                        reelEndPosion.push([index, reelCounts[index]]);
                        console.log("reelEndPosion", reelEndPosion);
                        //                  else if (stopReelFlag[0] && stopReelFlag[1] && stopReelFlag[2]) {
                        //     for (var i = 0; i < slot_Atari.length; i++) {
                        //         console.log("ストップー01", reelEndPosion);
                        //         console.log("ストップー02", slot_Atari[i]);
                        //         if (slot_Atari[i].toString() == reelEndPosion.toString()) {
                        //             console.log("当たり");
                        //         }
                        //     }
                        // }
                        console.log("endReelFlag", endReelFlag[index])
                        return;
                    }
                    // 移動階数をカウント
                    reelCounts[index]++;
                    // スロット回転のアニメーションを実行する
                    Slot.animation(index);
                }
            });
        },
    };

    global.Slot = Slot;

})((this || 0).self || global);

/**
 * 読み込み後
 */
$(document).ready(function () {

    /*
     * スロットの初期化処理を実行
     */
    Slot.init();
    Slot.resetLocationInfo();

    /**
     * スタートボタンのクリックイベント
     */
    $('.btn-start').click(function () {
        // スタートボタンを押せないようにする
        $(this).attr('disabled', true);
        // スロットの回転を開始
        Slot.start();
        // ストップボタンを押せるようにする
        $('.btn-0').attr('disabled', false);
    });

    $('.btn-0').click(function () {

        // ストップボタンを押せるようにする
        $('.btn-1').attr('disabled', false);
    });

    $('.btn-1').click(function () {

        // ストップボタンを押せるようにする
        $('.btn-2').attr('disabled', false);
        $('.Slobt-btn-consle').show();
    });
    /**
     * リセットボタンのクリックイベント
     */
    $('.btn-reset').click(function () {
        // リセットボタンを押せないようにする
        $(this).attr('disabled', true);
        // スタートボタンを押せるようにする
        $('.btn-start').attr('disabled', false);
        // ストップボタンを押せないようにする
        $('.btn-stop').attr('disabled', true);
        // スロットのリール情報を初期化
        Slot.init();
    });

    /**
     * ストップボタンのクリックイベント
     */
    $('.btn-stop').click(function () {
        // ストップボタンを押せないようにする
        $(this).attr('disabled', true);
        // レールの回転を停止
        Slot.stop($(this).attr('data-val'));
        // 結果の評価
        Slot.reslut($(this).attr('data-val'));
    });
    /**
 * リザルトのクリックイベント
 */
    $('.btn-result').click(function () {
        // ストップボタンを押せないようにする
        // $(this).attr('disabled', true);
        // レールの回転を停止
        // Slot.stop($(this).attr('data-val'));
        // 結果の評価
        Slot.result($(this).attr('data-val'));
        $(this).attr('disabled', true);
        $('.result-hide').hide();
        $('.result-show').show();
    });

});

