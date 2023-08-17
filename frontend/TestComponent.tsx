import React from "react"
import GoldenLayout from 'golden-layout' 

var myLayout = new GoldenLayout({
    content: [{
        type: 'row',
        content:[{
            type:'react-component',
            component: 'test-component',
            props: { label: 'A' }
        },{
            type: 'column',
            content:[{
                type:'react-component',
                component: 'test-component',
                props: { label: 'B' }
            },{
                type:'react-component',
                component: 'test-component',
                props: { label: 'C' }
            }]
        }]
    }]
});

class GoldenGrid extends React.Component{
    render() {
        return (<h1>{this.props.label}</h1>)
    }
};

export default GoldenGrid

/*
myLayout.registerComponent( 'testComponent', TestComponent );

//Once all components are registered, call
myLayout.init();
*/
