require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        html2markdown: {
            deps: [
                'htmldomparser'
            ]
        },
        trumbowyg: {
            deps: [
                'jquery',

            ]
        },
        trumbowyg_lang: {
            deps: [
                'jquery'
            ]
        }
    },
    paths: {
        jquery: "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min",
        underscore: "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min",
        backbone: "https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.3/backbone-min",
        async: "https://cdnjs.cloudflare.com/ajax/libs/requirejs-async/0.1.1/async",
        text: "https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min",

        htmldomparser: "lib/htmldomparser",
        html2markdown: "lib/html2markdown",
        trumbowyg: "lib/trumbowyg/trumbowyg.min",
        trumbowyg_lang: 'lib/trumbowyg/langs/zh_cn.min'
    }
});
require([
    'jquery',
    'underscore',
    'backbone',
    'html2markdown',
    'text!templates/main.html',
    'text!templates/aboutme.html',
    'trumbowyg'
    ],function($, _, Backbone, HTML2Markdown, MainTemplate, AboutMeTemplate) {

    $("body").html(_.template( MainTemplate ));
    $("body").append(_.template( AboutMeTemplate ));

    var html2Markdown = new HTML2Markdown();

    var timer = null;
    $('#simple-editor').trumbowyg({
        mobile: true,
        tablet: true,
        closable: false,
        fixedBtnPane: true,
        fixedFullWidth: false,
        fullscreenable: false,
        semantic: true,
        btns: ['viewHTML',
          '|', 'formatting',
          '|', 'btnGrp-design',
          '|', 'link',
          '|', 'insertImage',
          '|', 'btnGrp-lists',
          '|', 'horizontalRule']
    }).on('tbwchange',function(){
        clearTimeout(timer);
        timer = setTimeout(function(){
            var htmlvalue = $('#simple-editor').trumbowyg("html");
            if (htmlvalue != "") {
                var markdown = html2Markdown.parse(htmlvalue);
                $("#resultBox").html(markdown);
            } else {
                $("#resultBox").html("");
            }

        },60);
    }).trigger("focus");



    $("#copyBT")[0].addEventListener('click', function(event) {
        var copyTextarea = $('#resultBox')[0];
        copyTextarea.select();
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            showMsg('Copying text command was ' + msg);
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }
    });

    var showMsg = function( text ){
        $("#showMsg").remove();
        showMsgdiv = $("<div id='showMsg'></div>");
        showMsgdiv.html(text);
        showMsgdiv.fadeOut();
        $("body").append(showMsgdiv);
        showMsgdiv.fadeIn(function(){
            setTimeout(function(){
                showMsgdiv.fadeOut();
            },500);
        });
    }

    $("#infoBT").click(function(){
        $(".aboutMe").fadeIn(function(){
            $(window).trigger('resize');
        });
    });
    $(".aboutMe .closeBT").click(function(){
        $(".aboutMe").fadeOut();
    });

    $(window).resize(function(){
         var target = $(".aboutMe .content");
         target.css({"margin-left": target.outerWidth()/2*-1,"margin-top": target.outerHeight()/2*-1 });
    }).trigger('resize');

    $(".aboutMe").hide(function(){
        $(this).css({"opacity":1});
    });
});
