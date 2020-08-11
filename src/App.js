import React from 'react';
import threeEntryPoint from './Components/threeEntryPoint';
import Config from './Config';
export default class App extends React.Component{
    constructor(props){
        super(props);
        const {config} = this.props;
        new Config(config);
        this.state = {
            search:JSON.stringify({
                etage: -1,
                pieces: '',
                surface: '',
                ref : ''
            }),
            shadow: 1,
            threeEntryPoint: true,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeShadow = this.changeShadow.bind(this);
    }
    componentDidMount() {
        const three = threeEntryPoint(this.threeRootElement);
        this.setState({three: three});
        config3D.search = (data) => {
            three.search(data);
        }
        config3D.play = () => {
            three.play();
        }
        config3D.toggleShadow = () => {
            three.toggleShadow( );
        }
        config3D.toggleSound = () => {
            three.toggleSound( );
        }

        config3D.toggleCompass = () => {
            three.toggleCompass();
        }
        config3D.changePositionOfLight = (date) => {
            three.changePositionOfLight(date);
        }
    }
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {three, search} = this.state;
        three.search(JSON.parse(search));
        return false;
    }
    changeShadow = (event)=>{
        const {three} = this.state;
        this.setState({[event.target.name]: event.target.checked });
        three.toggleShadow(event.target.checked );
    }
    resetCamera = () => {
        const {three} = this.state;
        three.resetCamera();
    }
    render (){
        return <div style={{width: '100%', height: '100%'}}>
                <span id={'loader-cnt'}>0%</span>
                <div ref={element => this.threeRootElement = element} style={{width: '100%', height: '100%'}} search={this.state}></div>
            </div>
    }
}