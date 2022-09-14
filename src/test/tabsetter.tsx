import ReactDOM from 'react-dom';
import React from 'react';
import { createElement as $ } from "react";
import { createSyncProviders } from "../main/vdom-hooks";
import { Patch, PatchHeaders, useInputSync } from '../extra/input-sync';
import "./popup-demo.scss"



interface TabSetProps {
    tabs: string[],
    identity: Object,
    state: {
        active: string
    },
}

const TabSet = ({tabs, state, identity}: TabSetProps) => {
    
    const {
		currentState, 
		setTempState, 
		setFinalState 
	} = useInputSync(identity, 'receiver', state, false, patchToState, s => s, stateToPatch);
    
    console.log(currentState)

    function stateToPatch({ active }: any): Patch {
        return { value: active };
    }
    
    function patchToState(patch: Patch): any {
        return {
            active: patch.value,
        };
    }

    return (
        <div style = {{display: 'flex'}}>
            {/* <div> */}
            {tabs.map((tabName: string, key: number) => 
                //<div className="clickableDiv">
                <button 
                className="clickableDiv"
                key = {key}
                //style = {{backgroundColor: "blue"}}
                onClick = {() => setTempState({active: tabName})}
                style = {tabName == currentState.active ? { backgroundColor: "green"} : { backgroundColor: "white"}}
                value = {tabName}
                > {tabName} </button>
                //</div>
            )}
            {/* </div> */}
        </div>
    )
}

export default TabSet; 

