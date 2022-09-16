import ReactDOM from 'react-dom';
import React, { ReactNode } from 'react';
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

    console.log(tabs.indexOf(active))

    function patchToState(patch: Patch): any {
        return {
            active: patch.value,
        };
    }

    return (
        <div>
            <div>
            {tabs.map((tabName: string, key: number) => 
                //<div className="clickableDiv">
                <button 
                className="tabsetDiv"
                key = {key}
                onClick = {() => setFinalState({active: tabName})}
                style = {tabName == currentState.active ? { backgroundColor: "#009688"} : { backgroundColor: "white"}}
                value = {tabName}
                > {tabName} </button>
                //</div>
            )}
            </div>
            <div style={{display: "flex"}}>
                <div>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Fartygsmodell-AMPHION._1902-04_-_Sj%C3%B6historiska_museet_-_O_00031.tif/lossy-page1-300px-Fartygsmodell-AMPHION._1902-04_-_Sj%C3%B6historiska_museet_-_O_00031.tif.jpg"></img>
                </div>
                <div>
                    {currentState.active !== "" ? rightContent![tabs.indexOf(active)] : null }
                </div>
            </div>
        </div>

    )
}

export default TabSet; 

