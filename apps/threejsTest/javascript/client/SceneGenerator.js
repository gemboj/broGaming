function SceneGenerator(){
    this.render = null;
}

SceneGenerator.prototype.generate = function(specification, canvas){
    var threeScene = new THREE.Scene(),
        threejsSceneAdapter = new ThreejsSceneAdapter(threeScene);

    var players = {};
    for(var objectId in specification){
        var object = specification[objectId]

        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshPhongMaterial( { color: "rgb(" + object.color.r + "," + object.color.g + "," + object.color.b + ")" } );
        var cube = new THREE.Mesh( geometry, material );
        cube.translateX(object.position.x);
        cube.translateY(object.position.y);
        cube.translateZ(object.position.z);

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

    this.render = renderer.render.bind(renderer, scene, camera);


    return threejsSceneAdapter;
};