// @ts-nocheck
import {usePopupPos} from "../main/popup.js"
import "./popup-demo.scss"
import { Patch, PatchHeaders, useInputSync } from '../extra/input-sync';
import ReactDOM from "react-dom"
import React, { useRef, useEffect, createElement, useContext, createContext } from "react"
import { createSyncProviders } from "../main/vdom-hooks";
import arrowdown from './arrowdown.svg'

const { createElement: $, useState, createRef } = React

export function Dropdown({listOfOptions, theState}){
    //usePopupPos set-up
    const [theElement,setElement] = useState<any>(null)
    const [theLRMode,setLRMode] = useState(false)
    const [pos] = usePopupPos(theElement,theLRMode)
    const [focusButtonIndex, setFocusIndex] = useState(0) //changes upon button clicks, 0 sets it to the first entry
    const reference = useRef(null) //creation of the reference
    const [goDownPlease, setGoDownPlease] = useState(false)
    
    //List of Options and sets the current option
    //const[currentOption, setCurrentOption] = useState("")

    //Values in the entryField of the input.
    const [entryField, setEntryField] = useState("")

    //Boolean to show/hide the dropdown. (TRUE = DROPDOWN IS HIDDEN, FALSE = DROPDOWN IS SHOWN)
    // const[dropState, setDropState] = useState(true)
    // const state = {input: currentOption, dropState: dropState, entryField: entryField }
    const {
		currentState, 
		setTempState, 
		setFinalState 
	} = useInputSync({parent: "test"}, 'receiver', theState, false, patchToState, s => s, stateToPatch);

    const { inputValue, currentOption, dropState } = currentState;
    function stateToPatch({ inputValue, currentOption, dropState }: DropdownState): Patch {
        const headers = {
            currentOption: currentOption, 
            dropState: dropState
        };
        return { value: inputValue, headers };
    }
    
    function patchToState(patch: Patch): DropdownState {
        const headers = patch.headers as PatchHeaders;
        return {
            inputValue: patch.value,
            currentOption: headers.currentOption,
            dropState: headers.dropState
        };
    }

    //Handle change for input field, opens dropdown when something is written inside, keeps the dropdown open if the text is deleted
    const handleChange = (event:any) => {
        setEntryField(event.target.value);
        console.log(checkList().length); 
        setTempState({ ...currentState, inputValue: event.target.value })
    }

    //Creates a list of names based on the input in the entryField.
    //When entry is empty, all names of the list are displayed.
    //Otherwise, when entry is not empty, all available names are displayed,
    //that contain the string of the entryField.
    const checkList = () => {
        let array = []; 
        if (currentState.inputValue !== undefined) {
            for (let i = 0; i < listOfOptions.length; i++) {
                if (listOfOptions[i].toLowerCase().includes(entryField.toLowerCase())) {
                    array.push(listOfOptions[i])
                };
            }  
            return array   
        }  
        else {
            return listOfOptions
        }
    }

    // Handles the Blur event. Blur events that occur between clicks/buttonpress inside the div are ignored.
    // If pressed outside the div, the blur event occurs and the dropdown menu is hidden.
    const handleBlur = (event: any) => {
        const currentTarget = event.currentTarget;
        requestAnimationFrame(() => {
            // Check if the new focused element is a child of the original container
            if (!currentTarget.contains(document.activeElement)) {
              setFinalState({...currentState, dropState: true})
              console.log("hiya")
            //   setFinalState({...currentState})
            }
          });
    }

    // Handles different key press scenarios when the focus is either on the input field,
    // the arrow button or the dropdown buttons. Enter selects, Exit hides the dropdown, arrow keys
    // Up and Down navigate the entries in the menu. Can also navigate with Tab.
    const keyPress = (event: any) => {
        const typeKeyPress = event.key
        switch (typeKeyPress) {
            case "Enter": 
                if (event.target.id === "arrowbutton" || event.target.id === "input") {
                    setTempState({...currentState, dropState: !dropState});
                } else {
                if (reference !== null) {
                    setTempState({inputValue: "", currentOption: reference.current.value, dropState: true }) //Sets the chosen button as the value, resets the input, focus and input field.
                }
                setEntryField("");
                setFocusIndex(0);
                setGoDownPlease(false)
                }
                event.preventDefault();
                break;
            case "ArrowUp":
                if (event.target.id == "input" || event.target.id == "arrowbutton") {
                    //scenario if the ArrowUp is pressed in input/arrowbutton.
                } else {
                    if (focusButtonIndex - 1 == -1) { //if ArrowUp is pressed at the first entry, it switches to the bottom
                        setFocusIndex(checkList().length - 1)
                    } else { //Switches the button up by one
                        setFocusIndex(focusButtonIndex - 1); 
                    }
                }
                event.preventDefault()
                break;
            case "ArrowDown":
                if (event.target.id == "input" || event.target.id == "arrowbutton") { //Drops the dropdown when ArrowDown is pressed in the input field
                    if (checkList().length > 0) {
                        setTempState({...currentState, dropState: false})
                        setFocusIndex(0)
                        setGoDownPlease(true)
                    }
                }
                if (focusButtonIndex + 2 > checkList().length) { //handles the case if the end of the list of options is reached
                    setFocusIndex(0)
                } else { //changes the previous focus to white, goes down by one
                    
                    if (reference.current == null && entryField == "" && focusButtonIndex == 0) {
                        setFocusIndex(0)
                    } else if ((document.activeElement.id == "input" || document.activeElement.id == "arrowbutton") && entryField !== "") {
                        setFocusIndex(0)
                    } else {
                        setFocusIndex(focusButtonIndex + 1)
                    }
                }
                event.preventDefault();
                break;
            case "Escape": //escapes the popup window
                setFocusIndex(0);
                setTempState({...currentState, dropState: true})
                event.preventDefault();
                break;  
        }
    }

    useEffect(() => { //if focusButtonIndex is changed, focuses on the button with the ref = {reference}, changes the backgroundColor 
        if (reference.current !== null) {
            if (document.activeElement.id == "input" && goDownPlease) {
                setTimeout(() => {
                    reference.current.focus()})
            } else if (document.activeElement.id == "input") {

            } else if (document.activeElement.id == "arrowbutton") {
                setTimeout(() => {
                    reference.current.focus()})
            } else {
                reference.current.focus()  
            }
        }
    }, [focusButtonIndex, dropState, entryField, goDownPlease])

    useEffect(() => { //if no options in checkList() the popup closes. Likewise, it stays closed if entryField is empty. 
       if ( checkList().length == 0) {
        setTempState({...currentState, dropState: true})
       } else if (entryField !== "") {
        setTempState({...currentState, dropState: false})
       }
    }, [entryField])

    //const randomCode = () => {
        return(
        <div onKeyDown={(event) => keyPress(event)}  onBlur={(event) => {handleBlur(event)}}>
            <h3>{currentState.inputValue}</h3>
            <div key="parent" style={{ border: "3px solid green" }}>
            {/* input field */}
            <input type="text"
            id = "input" 
            placeholder={currentOption} 
            value = {entryField} 
            style = {{width: "70%",
                      height: "100%",
                      fontSize: "14px",
                    outline: "none",
                    border: "none",
                    resize: "none",
                }}
            onChange={(event) => handleChange(event)} 
            />
            
            
            {/* arrow button */}
            <button id="arrowbutton" type = "button" className="buttonEl"
                    style={{
                        transform: dropState ? "rotate(180deg)" : 'rotate(0deg)',
                        width: "20%",
                        height: "30px",
                        backgroundColor: "transparent",
                        outline: "none",
                        border: "none",
                        resize: "none",
                    }}
                    onClick={(event) => {setFocusIndex(0); setTempState({...currentState, dropState: !dropState});}}>
                <img style={{ transform: 'rotate(180deg)', height: "10px", display: "block", textAlign: "center", marginLeft: "-5px" }} src = {arrowdown} alt="arrowdown"/>
            </button> 
            
            </div>

                { dropState 
                    ?
                    null
                    :
                    // dropdown menu with buttons
                    // creates the popup menu which has the position with optimal position
                    <div id="popupDiv" ref = {setElement} style = { pos } >
                        {/* gives the popup the maxHeight within which there is an overflow of elements */}
                        <div style = {{border: "1px solid blue", maxHeight: "200px", width:"250px",}}>
                            {/* creates the overflow menu */}
                            <div style = {{overflow:"auto", maxHeight: "200px",}}>
                            {checkList().map((searched_option: any, key: any) =>
                                // button/entry with the reference based on the input 
                                    <button
                                    key = {key} 
                                    ref = {key === focusButtonIndex ? reference : null}
                                    id = {key}
                                    style = {{width: "100%", borderRadius: "0px", }} 
                                    value = {searched_option}
                                    onClick = {() => { setTempState({...currentState, dropState: true, currentOption: searched_option}); setEntryField("")}} >
                                    {searched_option} </button>
                            )}
                            </div>
                        </div>
                    </div>
                }
        </div>
        
        
        )
    //}

    // const sender = {
    //     enqueue: (identity: any, patch: any) => console.log(patch)
    // };
    // const ack: boolean | null = null;

    // return createSyncProviders({sender, ack, children: randomCode()});
}

export default Dropdown

// const containerElement = document.createElement("div")
// containerElement.setAttribute("id", "root");
// document.body.appendChild(containerElement)
// ReactDOM.render($(App), containerElement)
