import ReactDOM from 'react-dom';
import React from 'react';
import { createElement as $ } from "react";
import TabSet from './tabsetter';
import { createSyncProviders } from "../main/vdom-hooks";

const App = () => {

    const identity = {parent:"test"}
    const tabs = ["hellos", "hi", "bye", "so"]
    const state = {active: ""}
    const child1 = $(TabSet, {tabs: tabs, state: state, identity: {parent: "test"}})
    const sender = {
        enqueue: (identity: any, patch: any) => console.log()
    };
    const ack: boolean | null = null;
    return createSyncProviders({sender, ack, children: child1})
    return (
        <div>
            <TabSet tabs = {tabs} state = {state} identity = {{parent:"test"}}/>
            <img src="https://i.pinimg.com/736x/46/d4/58/46d45821deaa745f44226aaf72c1031e--pictures-for-painting-silence-in-the-library.jpg"/>
        </div>
    )
}

const containerElement = document.createElement("div")
containerElement.setAttribute("id", "root");
document.body.appendChild(containerElement)
ReactDOM.render($(App), containerElement)