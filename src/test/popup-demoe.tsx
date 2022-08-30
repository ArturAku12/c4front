import ReactDOM from "react-dom"
import React, { useRef, useEffect, createElement, useContext, createContext } from "react"
import { createSyncProviders } from "../main/vdom-hooks"
import { createElement as $ } from "react";
import Dropdown from "./popup-demo"


const App = () => {
    const listOfOptions: string[] = ["Mary", "John", "Alex", "Marie", "Jonathan", "Babel", "Hanna", "Joseph", "Ivan", "Gregory", "Ioseph", "Papadopoulos"]
    const key = "TEST";
    const identity = {parent:"test"}
    const state = {inputValue: "", currentOption: "", dropState: "1"}
    const child1 = $(Dropdown, {listOfOptions: listOfOptions, theState: state, identity: {parent: "test"},})
    const sender = {
            enqueue: (identity: any, patch: any) => console.log()
    };
    const ack: boolean | null = null;
    return createSyncProviders({sender, ack, children: child1})
}

const containerElement = document.createElement("div")
containerElement.setAttribute("id", "root");
document.body.appendChild(containerElement)
ReactDOM.render($(App), containerElement)