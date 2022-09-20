import ReactDOM from 'react-dom';
import React, { ReactNode, useRef } from 'react';
import { createElement as $ } from "react";
import { createSyncProviders } from "../main/vdom-hooks";
import { Patch, PatchHeaders, useInputSync } from '../extra/input-sync';
//import "./popup-demo.scss"



interface TabSetProps {
    tabs: string[],
    identity: Object,
    state: {
        active: string
    },
    rightContent?: ReactNode[]
}

const TabSet = ({tabs, state, identity, rightContent}: TabSetProps) => {
    const {
		currentState, 
		setTempState, 
		setFinalState 
	} = useInputSync(identity, 'receiver', state, false, patchToState, s => s, stateToPatch);

    function stateToPatch({ active }: any): Patch {

        return { value: active };
    }
    
    const { active } = currentState

    function patchToState(patch: Patch): any {
        return {
            active: patch.value,
        };
    }

    return (
        <div id="tabSetter" style = {{display: "flex", justifyContent: "space-between"}}>
            <div style={{display: 'flex',}}>
            {tabs.map((tabName: string, key: number) => 
                //<div className="clickableDiv">
                <button 
                className="tabsetDiv"
                key = {key}
                onClick = {() => {setFinalState({active: tabName})}}
                style = {tabName == currentState.active ? { backgroundColor: "#009688"} : { backgroundColor: "white"}}
                value = {tabName}
                > {tabName} </button>
                //</div>
            )}
            </div>
            <div className = "tabsetDiv" style={{display: "flex", flexDirection: "row-reverse", }}>
                <div>
                    {currentState.active !== "" ? rightContent![tabs.indexOf(active)] : null }
                </div>
            </div>
        </div>

    )
}

export default TabSet; 

