import React, { createRef, Component } from 'react'
import SoundCircle from './components/SoundCircle';
import Slider from './components/Slider';
import PlayButton from './components/PlayButton';

import soundFile0 from './sounds/0.mp3';
import soundFile1 from './sounds/1.mp3';
import soundFile2 from './sounds/2.mp3';
import soundFile3 from './sounds/3.mp3';
import soundFile4 from './sounds/4.mp3';
import soundFile5 from './sounds/5.mp3'
import soundFile6 from './sounds/6.mp3';
import soundFile7 from './sounds/7.mp3';
import soundFile8 from './sounds/8.mp3';
import soundFile9 from './sounds/9.mp3';

import createVirtualAudioGraph, {
    bufferSource,
    createNode,
    createWorkletNode,
    delay,
    gain,
    oscillator,
    stereoPanner,
  } from 'virtual-audio-graph'



const soundFilesArray = [
    soundFile0,
    soundFile1,
    soundFile2,
    soundFile3,
    soundFile4,
    soundFile5,
    soundFile6,
    soundFile7,
    soundFile8,
    soundFile9
]

const audioContext = new AudioContext();


const canvasWidth = 1000;
const canvasHeight = 200;
const numCircles = 10;
const circleSize = 50;
const offset = 50;
 

const getRandomColor = () => `#${Math.floor((Math.random() * 16777215)).toString(16)}`;

const circles = Array.from({ length: numCircles }, (el, i) => {


    return ({
        x: i * (circleSize * 2) + circleSize,
        y: canvasHeight/2,
        r: circleSize,
        fill: getRandomColor() 
    })
});
    
    
const squareOsc = createNode(({
    gain: gainValue,
    startTime,
    stopTime,
    ...rest
  }) => {
    const duration = stopTime - startTime
    return {
      0: gain('output', {
        gain: [
          ['setValueAtTime', 0, startTime],
          ['linearRampToValueAtTime', gainValue, startTime + duration * 0.15],
          ['setValueAtTime', gainValue, stopTime - duration * 0.25],
          ['linearRampToValueAtTime', 0, stopTime],
        ],
      }),
      1: oscillator(0, { startTime, stopTime, ...rest }),
    }
  })


  const pingPongDelay = createNode(({  
    decay,
    delayTime,
  }) => ({
    0: stereoPanner('output', { pan: -1 }),
    1: stereoPanner('output', { pan: 1 }),
    2: delay([1, 5], { delayTime, maxDelayTime: delayTime }),
    3: gain(2, { gain: decay }),
    4: delay([0, 3], { delayTime, maxDelayTime: delayTime }),
    5: gain(4, { gain: decay }, 'input'), // connections will be made here
  }))




const center = { x: canvasWidth/2, y: canvasHeight/2}


class App  extends Component {

    constructor(props){
        super(props);
        this.state = {
            masterGainValue: 1.5,
            offset: 0.0,
            freq: 440,
            zItem: numCircles/2,
        }

        this.container = createRef();
        this.audioEl = createRef();

      
        this.audioGraph = createVirtualAudioGraph({
            audioContext,
            output: audioContext.destination,
        });

        this.playing = false;
        this.buffers = [];


    }


    componentDidMount(){
        
        this.initBuffers(soundFilesArray);

    }    
    
    initBuffers = (arr) => {
        arr.forEach( async (url, i) => {
            const response = await fetch(url);
            const ab = await response.arrayBuffer();
            this.buffers[i] = await audioContext.decodeAudioData(ab);
    
        })

    }



    update = (prop, value) => {
        const { masterGainValue, freq } = this.state;
        const { currentTime } = this.audioGraph;
        // console.log(prop, value);
        if(prop === 'masterGainValue'){
            value = Number(value)/100;
            this.setMasterGain(value);
            
        }
        if(prop === 'zItem'){
            this.toFront(Number(value))
        }


        // this.audioGraph.update({
        //     0: gain('output', { gain: 0.5 }),
        //     1: oscillator(0, {     
        //         frequency: freq,
        //         stopTime: currentTime + 2.5,
        //         type: 'sawtooth',
        //     }),
        // })


         this.setState({ [prop]: Number(value) })
    }

    setMasterGain = (val) => {
        // console.log(masterGainNode.gain);
        // masterGainNode.gain.value = val;
    }

    playSound = (bufNum) => {
        const { currentTime } = this.audioGraph
        console.log(bufNum);

    this.audioGraph.update({
        0: gain('output', { gain: 0.75 }),
        1: bufferSource(0, {
        buffer: this.buffers[bufNum],
        playbackRate: 2.0,

        startTime: currentTime,
        stopTime: currentTime + 10.0,
            }),
    })

}

playPingPongSound = (bufNum) => {
    const { currentTime } = this.audioGraph;
    const { masterGainValue, offset }  = this.state; 
    console.log(bufNum);

this.audioGraph.update({
    0: gain('output', {gain: masterGainValue }),
    1: pingPongDelay(0, { 
        
        decay: 0.9,
        delayTime: 0.25  
    }),
    2: bufferSource(1, {
    buffer: this.buffers[bufNum],
    playbackRate: 2.0,
    detune: -10,
    offset: offset,
    loop: true,
    startTime: currentTime,
    stopTime: currentTime + 0.5,
        }),
})

}



playSquare = (index) => {

    const { currentTime } = this.audioGraph

    this.audioGraph.update({
      0: squareOsc('output', {
        frequency: 110 * index,
        gain: 0.2,
        startTime: currentTime,
        stopTime: currentTime + 1,
        type: 'square',
      }),
    })

}




        // const output = [gain('output', { gain: 0.99 })];
        // const nodes = Array.from({length : 1}, (_, i ) => {
        //     return bufferSource(0, {
        //         buffer: this.buffers[bufNum],
        //         playbackRate: 1.0,
        //         startTime: currentTime,
        //         stopTime: currentTime + 1,
        //     })    
        // })
        // const graph = output.concat(nodes);


//this.audioGraph.update( graph );



    render(){
        const { masterGainValue, offset, zItem } = this.state;
        return ( 

            <div className="container">
                <svg 
                style={{backgroundColor: 'pink'}}
                ref={this.container}
                width='1000'
                height='200'
                viewBox='0 0 1000 200'
                >
                <g>
  
                    {
                    circles.map( (circle, i) => 
                    <SoundCircle 
                    id={i} 
                    x={circle.x}
                    y={circle.y}
                    r={circle.r}
                    fill={circle.fill}
 //                   playSound={this.playSound}
                   // playSound={this.playSquare}
                    playSound={this.playPingPongSound}
                    /> 
                    )
                    }     
               </g>

            </svg>
            <Slider 
                name="masterGainValue" 
                minVal="0" 
                maxVal="1000" 
                value={masterGainValue * 100}  
                updateParent={this.update}
                />
            <Slider 
                name="offset" 
                minVal="0.0" 
                maxVal="10.0" 
                value={offset}  
                updateParent={this.update}
                />
            {/* <PlayButton
                trigParent={() => this.playOsc()}
                text="click to play oscillator"
                // trigParent = { () => this.toFront()}
            />
            <PlayButton
                trigParent={() => this.playSound()}
                text="click to play sound file"
                // trigParent = { () => this.toFront()}
            />

            <Slider 
                name="zItem" 
                minVal="0" 
                maxVal={numCircles} 
                value={zItem}  
                updateParent={this.update}
                /> */}

            {/* <PlayButton
                //trigParent={() => this.playSound()}
                trigParent = { () => this.toFront()}
                text="click to bring selected item to front"
            /> */}

            <audio ref={this.audioEl} src={this.sound} />
            </div>
            
    
         );
    }

}
 
export default App;