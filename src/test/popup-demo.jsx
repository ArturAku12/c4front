import {usePopupPos} from "../main/popup.js"
import "./popup-demo.css"
import "./popup-demos.css"
import ReactDOM from "react-dom"
import React from "react"
import arrowdown from './arrowdown.svg'

const { createElement: $, useState, createRef } = React

function App(){
    // return $("div",{
    //     style: { width: "1000px", height: "1000px", border: "10px solid silver"}
    // },)
    //usePopupPos set-up
    const [theElement,setElement] = useState(null)
    const [theLRMode,setLRMode] = useState(false)
    const [pos] = usePopupPos(theElement,theLRMode)
    
    //Refs for the buttons in the dropdown
    const allTheRefs = {}
    
    const [name, addName] = useState(["Mary", "John", "Alex", "Marie", "Jonathan", "Babel", "Hanna", "Joseph", "Ivan", "Gregory", "Ioseph", "Papadopoulos"])

    const[currentName, setCurrentName] = useState("")

    //Values in the entryField of the input.
    const [entryField, setEntryField] = useState("")

    //Boolean to show/hide the dropdown. (TRUE = DROPDOWN IS HIDDEN, FALSE = DROPDOWN IS SHOWN)
    const[dropState, setDropState] = useState(true)

    //Creates a list of names based on the input in the entryField.
    //When entry is empty, all names of the list are displayed.
    //Otherwise, when entry is not empty, all available names are displayed,
    //that contain the string of the entryField.
    const checkList = () => {
        let array = []; 
        for (let i = 0; i < name.length; i++) {
            if (name[i].toLowerCase().includes(entryField.toLowerCase())) {
                array.push(name[i])
            };
        }        
        return array
    }

    // Handles the Blur event. Blur events that occur between clicks/buttonpress inside the div are ignored.
    // If pressed outside the div, the blur event occurs and the dropdown menu is hidden.
    const handleBlur = (event) => {
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
    const keyPress = (event) => {
        const typeKeyPress = event.key
        switch (typeKeyPress) {
            case "Enter": 
                if (event.target.type !== "button") {
                    setCurrentName(event.target.value);
                    //setEntryField("")
                    console.log(event.target.value)
                    //setDropState(true);
                }
                break;
            case "ArrowUp":
                console.log(allTheRefs)
                allTheRefs[parseInt(event.target.id) - 1].focus()
                break;
            case "ArrowDown":
                if (event.target.id && event.target.id !== "input") {
                console.log(allTheRefs)
                allTheRefs[parseInt(event.target.id) + 1].focus()
                } else {
                    allTheRefs["0"].focus()
                }
                break;
            case "Escape":
                //if (event.target.id == "input") {
                setDropState(true);
                //}
                break;
        }

    }

    return(
        <div id="root">
        <div className = "random" onKeyDown={(event) => keyPress(event)}  onBlur={(event) => {handleBlur(event)}}>
            {/* input field */}
            <div key="parent" style={{ border: "3px solid green" }}>
            {/* <div className="input-box"> */}
            <input type="text"
            id = "input" 
            placeholder={currentName} 
            value = {entryField} 
            style = {{width: "70%",
                      height: "100%",
                      fontSize: "14px",
                    outline: "none",
                    border: "none",
                    resize: "none",
                }}
            onChange={(event) => {setEntryField(event.target.value); if (event.target.value !== "") {setDropState(false)} else {setDropState(true)}}} 
            onKeyDown={(event) => keyPress(event)}
            //onFocus={(event) => {setDropState(false)}}
            />
            {/* </div> */}
            
            
            {/* arrow button */}
            <button type = "button" className="buttonEl"
                    style={{
                        transform: dropState ? "rotate(180deg)" : 'rotate(0deg)',
                        width: "20%",
                        height: "30px",
                        backgroundColor: "transparent",
                        outline: "none",
                        border: "none",
                        resize: "none",
                    }}
                    onClick={(event) => setDropState(!dropState)}
                    onKeyDown={(event) =>keyPress(event)}>
                <img style={{ transform: 'rotate(180deg)', height: "10px", display: "block", textAlign: "center", marginLeft: "-5px" }} src = {arrowdown} alt="arrowdown"/>
            </button>
            
            </div>

                { dropState
                    ?
                    null
                    :
                    // dropdown menu with buttons
                    <div id="popupDiv" ref = {setElement} style = { pos } >
                        <div style = {{border: "1px solid blue", height: "224px", width:"250px",}}>
                            
                            <div style = {{overflow:"auto", height: "224px"}}>
                            {checkList().map((searched_name, key) =>
                                <div key = {key}>
                                    <button ref={ref => allTheRefs[key] = ref } 
                                    id = {key}
                                    style = {{width: "100%", borderRadius: "0px", backgroundColor: "white"}} 
                                    value = {searched_name}
                                    onMouseOver = {(event) => {event.target.style.background = "#149688"; event.target.style.borderColor = "none"}}
                                    onMouseOut = {(event) => {event.target.style.background = "white"}}
                                    onFocus = {(event) => {event.target.style.background = "#149688"; event.target.style.borderColor = "none"}}
                                    onBlur = {(event) => {event.target.style.background = "white"}}
                                    onClick = {(event) => {setCurrentName(searched_name); setDropState(true); setEntryField("")}} 
                                    onKeyDown={(event) => keyPress(event)}> {searched_name} </button>
                                </div>
                            )}
                            </div>
                        </div>
                    </div>
                }
        </div>
        </div>
        
    )

}

const containerElement = document.createElement("div")
containerElement.setAttribute("id", "root");
document.body.appendChild(containerElement)
ReactDOM.render($(App), containerElement)
