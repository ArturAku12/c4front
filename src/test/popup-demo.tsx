// @ts-nocheck
import {usePopupPos} from "../main/popup.js"
import "./popup-demo.scss"

import ReactDOM from "react-dom"
import React, { useRef, useEffect } from "react"
import arrowdown from './arrowdown.svg'

const { createElement: $, useState, createRef } = React

function App(){
    
    //usePopupPos set-up
    const [theElement,setElement] = useState<any>(null)
    const [theLRMode,setLRMode] = useState(false)
    const [pos] = usePopupPos(theElement,theLRMode)
    const [focusButtonIndex, setFocusIndex] = useState(0) //changes upon button clicks, 0 sets it to the first entry
    const reference = useRef(null) //creation of the reference
    const [keyPressed, setKeyPressed] = useState()
    
    //List of Options and sets the current option
    const [listOfOptions, setOptions] = useState(["Mary", "John", "Alex", "Marie", "Jonathan", "Babel", "Hanna", "Joseph", "Ivan", "Gregory", "Ioseph", "Papadopoulos"])
    const[currentOption, setCurrentOption] = useState("")

    //Values in the entryField of the input.
    const [entryField, setEntryField] = useState("")

    //Boolean to show/hide the dropdown. (TRUE = DROPDOWN IS HIDDEN, FALSE = DROPDOWN IS SHOWN)
    const[dropState, setDropState] = useState(true)

    //Handle change for input field, opens dropdown when something is written inside, keeps the dropdown open if the text is deleted
    const handleChange = (event:any) => {
        setEntryField(event.target.value);
    }

    //Creates a list of names based on the input in the entryField.
    //When entry is empty, all names of the list are displayed.
    //Otherwise, when entry is not empty, all available names are displayed,
    //that contain the string of the entryField.
    const checkList = () => {
        let array = []; 
        for (let i = 0; i < listOfOptions.length; i++) {
            if (listOfOptions[i].toLowerCase().includes(entryField.toLowerCase())) {
                array.push(listOfOptions[i])
            };
        }     
        return array
    }

    // Handles the Blur event. Blur events that occur between clicks/buttonpress inside the div are ignored.
    // If pressed outside the div, the blur event occurs and the dropdown menu is hidden.
    const handleBlur = (event: any) => {
        const currentTarget = event.currentTarget;
        requestAnimationFrame(() => {
            // Check if the new focused element is a child of the original container
            if (!currentTarget.contains(document.activeElement)) {
              setDropState(true);
            }
          });
    }

    // Handles different key press scenarios when the focus is either on the input field,
    // the arrow button or the dropdown buttons. Enter selects, Exit hides the dropdown, arrow keys
    // Up and Down navigate the entries in the menu. Can also navigate with Tab.
    const keyPress = (event: any) => {
        const typeKeyPress = event.key
        setKeyPressed(typeKeyPress)
        switch (typeKeyPress) {
            case "Enter": 
                if (event.target.id === "arrowbutton" || event.target.id === "input") {
                    setDropState(!dropState);
                } else {
                if (reference !== null) {
                setCurrentOption(reference.current.value) //Sets the chosen button as the value, resets the input, focus and input field.
                }
                setDropState(true)
                setEntryField("");
                setFocusIndex(0);
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
                    setDropState(false)
                    setFocusIndex(0)
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
                setDropState(true);
                event.preventDefault();
                break;  
        }
    }

    useEffect(() => { //if focusButtonIndex is changed, focuses on the button with the ref = {reference}, changes the backgroundColor 
        if (reference.current !== null) {
            if (document.activeElement.id == "input" && keyPressed == "ArrowDown") {
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
    }, [focusButtonIndex, dropState, keyPressed])

    useEffect(() => { //if no options in checkList() the popup closes. Likewise, it stays closed if entryField is empty. 
       if ( checkList().length == 0) {
        setDropState(true)
       } else if (entryField !== "") {
        setDropState(false)
       }
    }, [entryField])

    return(
        
        <div onKeyDown={(event) => keyPress(event)}  onBlur={(event) => {handleBlur(event)}}>

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
                    onClick={(event) => {setFocusIndex(0); setDropState(!dropState);}}>
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
                                    onClick = {() => {setCurrentOption(searched_option); setDropState(true); setEntryField("")}} >
                                    {searched_option} </button>
                            )}
                            </div>
                        </div>
                    </div>
                }
        </div>
        
        
    )

}

const containerElement = document.createElement("div")
containerElement.setAttribute("id", "root");
document.body.appendChild(containerElement)
ReactDOM.render($(App), containerElement)
