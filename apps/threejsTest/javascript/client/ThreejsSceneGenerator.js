function ThreejsSceneGenerator(canvas){
    this.render = null;
    this.canvas = canvas;
}

ThreejsSceneGenerator.prototype.generate = function(specification){
    var threeScene = new THREE.Scene(),
        threejsSceneAdapter = new ThreejsSceneAdapter(threeScene),
        scene = new Scene(threejsSceneAdapter),
        sceneObjects = specification.sceneData,
        canvas = this.canvas;

    var players = {};
    for(var playerId in sceneObjects.players){
        var object = sceneObjects.players[playerId];

        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshPhongMaterial( { color: "rgb(" + object.color.r + "," + object.color.g + "," + object.color.b + ")" } );
        var cube = new THREE.Mesh( geometry, material );
        cube.translateX(object.position.x);
        cube.translateY(object.position.y);
        cube.translateZ(object.position.z);

        cube.name = playerId;
        threeScene.add( cube );
    }

    for(var objectId in sceneObjects.objects){
        var object = sceneObjects.objects[objectId];

        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshPhongMaterial( { color: "rgb(200, 100, 80)" } );
        var cube = new THREE.Mesh( geometry, material );
        cube.translateX(object.position.x);
        cube.translateY(object.position.y);
        cube.translateZ(object.position.z);

        cube.name = objectId;
        threeScene.add( cube );
    }

    var camera = new THREE.PerspectiveCamera( 75, 200/200, 0.1, 1000 );


    var renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize( 200, 200);

    camera.position.z = 5;

    var pointLight = new THREE.PointLight( 0xFFFFFF, 5, 10 );
    pointLight.position.set( 5, 5, 5 );
    threeScene.add(pointLight);

    var light = new THREE.AmbientLight( 0x404040 );
    threeScene.add( light );

    this.render = renderer.render.bind(renderer, threeScene, camera);
    this.render();

    return scene;
};

ThreejsSceneGenerator.prototype.getRenderFunction = function(){
    return this.render;
}