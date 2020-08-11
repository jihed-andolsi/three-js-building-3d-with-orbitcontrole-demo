export default  config => {
    const defaulConfig = {
        containerId: 'root',
        object3D: null,
        objectMtl3D: null,
        objectDir3D: null,
        properties : [],
        loaderShow(loading){
            if(Number.isInteger(loading)){
                document.getElementById('loader-cnt').innerHTML = loading + '% loaded';
                if(loading > 99){
                    document.getElementById('loader-cnt').style.display = 'none';
                }
                console.log( loading + '% loaded' );
            } else {
                document.getElementById('loader-cnt').style.display = 'none';
            } 
        },
        getPropertyByReference(ref){
            return null;
        },
        toggleCompass(){

        },
        loaded(){
            
        }
    }
    const newConf = Object.assign(defaulConfig, config);
    window.config3D = newConf;
    return {
        config: newConf
    };
}