function loadShader(gl, id, type){
    var scriptElement = document.getElementById(id);
    if(!scriptElement) alert("Can't find shader source!");
    
    const source = scriptElement.text;
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        alert(gl.getShaderInfoLog(shader));
    }
    return shader;
}

(function(){
    'use strict';

    // 変数
    var gl, canvas;

    window.addEventListener('load', function(){
        ////////////////////////////
        // 初期化
        ////////////////////////////
        
        // canvas の初期化
        canvas = document.getElementById('canvas');
        canvas.width = 512;
        canvas.height = 512;

        // WeebGLの初期化(WebGL 2.0)
        gl = canvas.getContext('webgl2');

        // シェーダプログラムの初期化
        // シェーダ「プログラム」の初期化
        var program = gl.createProgram();
        var vs = loadShader(gl, "vs", gl.VERTEX_SHADER);
        
        gl.attachShader(program, vs);
        gl.attachShader(program, loadShader(gl, "fs", gl.FRAGMENT_SHADER));
        gl.linkProgram(program);
        if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
            alert(gl.getProgramInfoLog(program));
            return;
        }
        gl.useProgram(gl, program);

        // モデルの構築
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        var vertices = [
           0.0, +0.3,
           0.5, -0.5,
          -0.5, -0.5
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        var posAttr = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(posAttr);
        gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);
       
        ////////////////////////////
        // 描画
        ////////////////////////////

        // 画面クリア
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // ポリゴンの描画
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
        
        // GPUに画面更新を促す
        gl.flush();

    }, false);

})();
