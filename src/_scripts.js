class MusicApp {
    constructor(trackList) {
        let self = this;

        this.trackList = trackList;
        this.initAudio();
        this.initUI();
        this.eventHandler();
        this.loadAudio();
    }

    initUI() {
        let self = this;

        var $track_container_onInit = $('.track_list');
         self.trackList.forEach(function(track) {
            $track_container_onInit.append('<div class="song-title">'+ track.trackNumberString + '. ' + track.title +'</div>');
        });

        this.controls = {
            prev: document.querySelector('#back'),
            next: document.querySelector('#forward'),
            play: document.querySelector('#play'),
            pause: document.querySelector('#pause'),
        };

        this.controls.prev.onclick = () => {
            self.currentSong = self.currentSong > 0 ? self.currentSong - 1 : self.trackList.length - 1;
            //self.loadAudio();
        };
        this.controls.next.onclick = () => {
            self.currentSong = self.currentSong < self.trackList.length - 1 ? self.currentSong + 1 : 0;
            //self.loadAudio();
        };

        this.controls.play.onclick = () => {
                self.audio.play();
                self.playing = true;
        };
        this.controls.pause.onclick = () => {
                console.log('fuck');
                self.audio.pause();
                self.playing = false;
        };


        this.current_title = document.getElementById('info');

    }

    eventHandler() {
        let self = this;

        this.audio.addEventListener('loadedmetadata', function(event) {
            var track = self.trackList[self.currentSong];
            self.current_title.innerHTML = track.trackNumberString + '. ' + track.title;
            self.audio.setAttribute("title", track.title);
        });

        this.audio.addEventListener('playing', function(event) {
            self.playing = true;
            var track = self.trackList[self.currentSong];
            $(self.controls.play).css('display','none');
            $(self.controls.pause).css('display','block');
        });

        this.audio.addEventListener('pause', function(event) {
            $(self.controls.play).css('display','block');
            $(self.controls.pause).css('display','none');
        });

    }

    initAudio() {
        let self = this;
        this.currentSong = 0;

        this.audio = document.getElementById('audioElem');
        this.audio.addEventListener('ended', () => {
            self.audio.currentTime = 0;
            self.audio.pause();
            self.currentSong = self.currentSong < self.trackList.length - 1 ? self.currentSong + 1 : 0;
            self.loadAudio();
        });

    }

    loadAudio() {

        let self = this;

        if (self.playing && self.audioReady) {
            this.audio.pause();
        }

        this.audioReady = false;
        this.playing = true;

        this.clearData();
    }

    clearData() {
        let self = this;
    }

}

window.onload = () => {
    $.ajax({
        url: "https://z.cdn.turner.com/adultswim/big/music/dark0/dark0-tracklist.json",
        dataType: "json",
        success: function (response) {
            let app = new MusicApp(response);
        }
    });
};


function trackCounter(secs) {
    var min = Math.floor((secs % 3600) / 60);
    var sec = Math.floor(secs % 60);
    if (sec < 10) {
        sec = "0" + sec;
    }
    return min + ':' + sec;
}

var container;

var effectBloom;
var camera, scene, renderer;

var video, material, mesh, plane;
var spotLight, lightHelper

var composer, controls;

var shopMaterial;

var object1, object2, object3, object4;

var mouseX = 0;
var mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var light1, light2, light3, light4, light5, light6, light7, light8;
var object_array = [];
var backgrounds = [], background_index = 0;

var isPlaying = true;

//Load Everything
var manager = new THREE.LoadingManager();
var player = document.getElementById('audioElem');
player.addEventListener("timeupdate", function() {
    var currentTime = player.currentTime;
    var duration = player.duration;
    $('#progress').css('width', (currentTime / duration * 100.00)+ '%');
});

manager.onLoad = function(){
    //first two black screens start fading out once all objects are loaded
    $("#text1").addClass("fadeOut");
    $(".fadeOut").bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
        $("#text1").css("display", "none");
        $("#text2").css("display", "block");
        $("#text2").addClass("fadeIn");
        $(".fadeOut").unbind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd");
        $(".fadeIn").bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
            $("#black").addClass("fadeOut");
            $("#text2").addClass("fadeOut");
            $("#text2").bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
                $("#black").css("display", "none");
                $("#text2").css("display", "none");
            });
        });
    });
    init();
    animate();
    //document.getElementById("audioElem").play();
    AudioHandler.init();
    AudioHandler.loadAudioElement;
}

var loader1 = new THREE.OBJLoader( manager );
THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
                var mtlLoader = new THREE.MTLLoader(manager);
                mtlLoader.setPath( 'media/Roses/' );
                mtlLoader.load( 'rose.mtl', function( materials ) {
                    materials.preload();
                    loader1.setMaterials( materials );
                    loader1.setPath( 'media/Roses/' );
                    loader1.load( 'rose.obj', function ( object ) {
                        object1 = object;
                        mtlLoader.setPath( 'media/Flowers/' );
                        mtlLoader.load( 'Vase.mtl', function( materials ) {
                            materials.preload();
                            loader1.setMaterials( materials );
                            loader1.setPath( 'media/Flowers/' );
                            loader1.load( 'Vase.obj', function ( object ) {
                                object2 = object;
                                mtlLoader.setPath( 'media/Flowers/' );
                                mtlLoader.load( 'Flower vase.mtl', function( materials ) {
                                    materials.preload();
                                    loader1.setMaterials( materials );
                                    loader1.setPath( 'media/Flowers/' );
                                    loader1.load( 'Flower vase.obj', function ( object ) {
                                        object3 = object;
                                    } );
                                });
                            } );
                        });
                    } );
                });
                loader1.setPath( 'media/Flowers/' );
                loader1.load( 'lotus.obj', function ( object ) {
                    object4 = object;
                } );



function init() {

    var myVideo = document.getElementById("videoElem");
    // myVideo.play();
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 500;

    scene = new THREE.Scene();
    var texture1 = new THREE.VideoTexture( myVideo ); //video texture
texture1.minFilter = THREE.LinearFilter;
texture1.magFilter = THREE.LinearFilter;
texture1.format = THREE.RGBFormat;
var texture2 = new THREE.CubeTextureLoader() //cube texture of china
                    .setPath( 'media/cube/' )
                    .load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
                    var texture3 = new THREE.Texture();
                    var texture4 = new Object();
    backgrounds.push(texture1,texture2, texture3, texture4);
    background_index = 0;

    // Lights
    var intensity = 5.5;
    var distance = 3000;
    var decay = 0.1;
    var c1 = 0x2E7D32, c2 = 0x00B0FF, c3 = 0x303F9F, c4 = 0xF4511E, c5 = 0x4DB6AC, c6 = 0x33691E, c7 = 0x7986CB, c8 = 0xFFEA00;
    // var sphere = new THREE.SphereGeometry( 5.25, 16, 8 );
    light1 = new THREE.PointLight( c1, intensity, distance, decay );
    // light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c1 } ) ) );
    scene.add( light1 );
    light2 = new THREE.PointLight( c2, intensity, distance, decay );
    // light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c2 } ) ) );
    scene.add( light2 );
    light3 = new THREE.PointLight( c3, intensity, distance, decay );
    // light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c3 } ) ) );
    scene.add( light3 );
    light4 = new THREE.PointLight( c4, intensity, distance, decay );
    // light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c4 } ) ) );
    scene.add( light4 );
    light5 = new THREE.PointLight( c5, intensity, distance, decay );
    // light5.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c5 } ) ) );
    scene.add( light5 );
    light6 = new THREE.PointLight( c6, intensity, distance, decay );
    // light6.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c6 } ) ) );
    scene.add( light6 );
    light7 = new THREE.PointLight( c7, intensity, distance, decay );
    // light7.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c7 } ) ) );
    scene.add( light7 );
    light8 = new THREE.PointLight( c8, intensity, distance, decay );
    // light8.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c8 } ) ) );
    scene.add( light8 );

    //ambient light
    var ambient = new THREE.AmbientLight( 0xffaaaa, 0.15 );
    scene.add( ambient );

    //renderer
    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    //set orbit controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableZoom = false;

    var tempMesh;

    for (var i = 0; i < 50; i++) {
        tempMesh = object1.clone();
        tempMesh.position.x = Math.random() * 3000 - 1500;
        tempMesh.position.y = Math.random() * 4000 - 2000;
        tempMesh.position.z = Math.random() * 3000 - 1500;
        tempMesh.rotation.x = Math.random() * 2 * Math.PI;
        tempMesh.rotation.y = Math.random() * 2 * Math.PI;
        tempMesh.rotation.z = Math.random() * 2 * Math.PI;
        tempMesh.scale.x = tempMesh.scale.y = tempMesh.scale.z = Math.random() * 4 + 1;
        scene.add(tempMesh);
        object_array.push(tempMesh);
    }
    for (var i = 0; i < 50; i++) {
        tempMesh = object2.clone();
        tempMesh.position.x = Math.random() * 3000 - 1500;
        tempMesh.position.y = Math.random() * 4000 - 2000;
        tempMesh.position.z = Math.random() * 3000 - 1500;
        tempMesh.rotation.x = Math.random() * 2 * Math.PI;
        tempMesh.rotation.y = Math.random() * 2 * Math.PI;
        tempMesh.rotation.z = Math.random() * 2 * Math.PI;
        tempMesh.scale.x = tempMesh.scale.y = tempMesh.scale.z = Math.random();
        scene.add(tempMesh);
        object_array.push(tempMesh);
    }
    for (var i = 0; i < 50; i++) {
        tempMesh = object3.clone();
        tempMesh.position.x = Math.random() * 3000 - 1500;
        tempMesh.position.y = Math.random() * 4000 - 2000;
        tempMesh.position.z = Math.random() * 3000 - 1500;
        tempMesh.rotation.x = Math.random() * 2 * Math.PI;
        tempMesh.rotation.y = Math.random() * 2 * Math.PI;
        tempMesh.rotation.z = Math.random() * 2 * Math.PI;
        tempMesh.scale.x = tempMesh.scale.y = tempMesh.scale.z = Math.random() * 10;
        scene.add(tempMesh);
        object_array.push(tempMesh);
    }
    for (var i = 0; i < 50; i++) {
        tempMesh = object4.clone();
        tempMesh.position.x = Math.random() * 3000 - 1500;
        tempMesh.position.y = Math.random() * 4000 - 2000;
        tempMesh.position.z = Math.random() * 3000 - 1500;
        tempMesh.rotation.x = Math.random() * 2 * Math.PI;
        tempMesh.rotation.y = Math.random() * 2 * Math.PI;
        tempMesh.rotation.z = Math.random() * 2 * Math.PI;
        tempMesh.scale.x = tempMesh.scale.y = tempMesh.scale.z = Math.random() * 10;
        scene.add(tempMesh);
        object_array.push(tempMesh);
    }

    // trails
    renderer.autoClearColor = false;

    // postprocessing effects
    var renderModel = new THREE.RenderPass( scene, camera );
    var effectFilm = new THREE.FilmPass( 1.35, 0.025, 648, false );
    effectBloom = new THREE.BloomPass( 1.0, 10, 1.0, 2048); //needs to be a gloabal value so we can change it in the animate function
    var effectBleach = new THREE.ShaderPass( THREE.BleachBypassShader );
    var effectCopy = new THREE.ShaderPass( THREE.CopyShader );

    effectBleach.uniforms[ "opacity" ].value = 0.7;

    effectCopy.renderToScreen = true;

    composer = new THREE.EffectComposer( renderer );

    composer.addPass( renderModel );
    composer.addPass( effectBleach );
    composer.addPass( effectBloom );
    composer.addPass( effectCopy );

    window.addEventListener( 'resize', onWindowResize, false );

    //attach onBeat event from AudioHandler to change function
    events.on("onBeat",change);
}

//function for changing the background
function change(){
    if (background_index > 3){
        background_index = 0;
    }
    scene.background = backgrounds[background_index];
    background_index++;
}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    composer.reset();

}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {

    var time = Date.now() * 0.00005;

    events.emit("update");

    //Mouse Position Controls
    // camera.position.x += ( mouseX - camera.position.x );
    // camera.position.y += ( - mouseY - camera.position.y );
    // camera.lookAt( scene.position );
    // for ( i = 0; i < cube_count; i ++ ) {
    //  material = materials[ i ];
    //  h = ( 360 * ( material.hue + time ) % 360 ) / 360;
    //  material.color.setHSL( h, material.saturation, 0.5 );
    // }

    var volume = AudioHandler.getSmoothedVolume();
    var time = Date.now() * 0.00025;
    var d = 550;
    //change position of the lights based on volume and randomness
    light1.position.x = Math.sin( time * 1.7 ) * d * volume * 25;
    light1.position.z = Math.cos( time * 0.3 ) * d * volume * 45;
    light2.position.x = Math.cos( time * 0.3 ) * d * volume * 65;
    light2.position.z = Math.sin( time * 0.7 ) * d * volume * 35;
    light3.position.x = Math.sin( time * 0.7 ) * d * volume * 65;
    light3.position.z = Math.sin( time * 1.5 ) * d * volume * 25;
    light4.position.x = Math.sin( time * 0.3 ) * d * volume * 65;
    light4.position.z = Math.sin( time * 0.5 ) * d * volume * 65;
    light5.position.x = Math.cos( time * 0.3 ) * d * volume * 35;
    light5.position.z = Math.sin( time * 0.5 ) * d * volume * 75;
    light6.position.x = Math.cos( time * 0.7 ) * d * volume * 95;
    light6.position.z = Math.cos( time * 0.5 ) * d * volume * 65;
    light7.position.x = Math.cos( time * 0.7 ) * d * volume * 95;
    light7.position.z = Math.cos( time * 0.5 ) * d * volume * 25;
    light8.position.x = Math.cos( time * 0.7 ) * d * volume * 45;
    light8.position.z = Math.cos( time * 0.5 ) * d * volume * 15;
    camera.position.z = camera.position.z + (Math.cos( time / 4 * 0.7 ) ); //move camera slightly
    for (var i = 0; i < 200; i += 5){
        object_array[i].rotation.x += Math.PI * volume / 100; //rotate objects based on volume
    }
    effectBloom.copyUniforms[ "opacity" ].value = volume*9 + 1; //bloom effect based on volume
    controls.update();
    renderer.clear();
    composer.render();

}