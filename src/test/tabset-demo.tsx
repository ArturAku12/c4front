import ReactDOM from 'react-dom';
import React from 'react';
import { createElement as $ } from "react";
import TabSet from './tabsetter';
import { createSyncProviders } from "../main/vdom-hooks";

const App = () => {
    const ComponentDemo = (name:string) => {
        return <div> Hello {name} </div>
    }
    const rightContent = [ComponentDemo("James"), ComponentDemo("Anny"), ComponentDemo("Robert"), ComponentDemo("Praetor")]
    const tabs = ["hellos", "hi", "bye", "so"]
    const state = {active: ""}
    const child1 = $(TabSet, {tabs: tabs, state: state, rightContent: rightContent, identity: {parent: "test"}})
    const child2 = $("img", {src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Fartygsmodell-AMPHION._1902-04_-_Sj%C3%B6historiska_museet_-_O_00031.tif/lossy-page1-300px-Fartygsmodell-AMPHION._1902-04_-_Sj%C3%B6historiska_museet_-_O_00031.tif.jpg", style: {marginTop: "0px, "}})
    const sender = {
        enqueue: (identity: any, patch: any) => console.log()
    };
    const ack: boolean | null = null;
    return createSyncProviders({sender, ack, children: [child1, child2]})
}

const containerElement = document.createElement("div")
containerElement.setAttribute("id", "root");
document.body.appendChild(containerElement)
ReactDOM.render($(App), containerElement)