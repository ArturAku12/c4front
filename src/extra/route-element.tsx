import React, { MouseEventHandler } from 'react';
import clsx from 'clsx';


interface RouteElementProps {
    key: string,
    routeParts: RoutePartData[]
 }
 
 interface RoutePartData {
    text: string,
    done: boolean,
    hint?: string,
    onClick?: MouseEventHandler<HTMLDivElement>
 }

 function RouteElement({routeParts}: RouteElementProps) {
    const lastDone = routeParts.findIndex(part => !part.done) - 1;
    return (
        <div className='routeElement'>
            {routeParts.map((part, ind) => {
                const { text, hint, done, onClick } = part;
                const isLastDone = ind === lastDone;
                console.log(routeParts)
                return (
                    <div title = {ind.toString()} className = {clsx(
                                                           (routeParts[ind + 1]?.done == true) && "continue",
                                                           (routeParts[ind + 1]?.done == false || ind == (routeParts.length - 1)) && "stop",
                                                           ind == 0 && "start",
                                                           ind == (routeParts.length - 1) && "end"
                                                        //    (ind == 0 && done && routeParts[1].done == true) && "firstDoneContinue", 
                                                        //    (ind == 0 && done &&routeParts[1].done == false) && "firstDoneStop",
                                                        //    (ind == (routeParts.length - 1) && done) && "doneLast",
                                                        //    (ind !== 0 && ind !== (routeParts.length - 1) && done && routeParts[ind + 1].done == true) && "doneContinue",
                                                        //    (ind !== 0 && ind !== (routeParts.length - 1) && done && routeParts[ind + 1].done == false) && "doneStop",
                                                        //    (ind !== 0 && !done &&ind !== (routeParts.length - 1)) && "notDoneContinue",
                                                        //    (ind == (routeParts.length - 1) && !done) && "notDoneStop",
                                                           
                                                           )}
                                            key = {ind}>
                        <div key={`${ind}`}
                            className={clsx(
                                            done && 'routePartDone',
                                            !done && "notDone", 
                                            (ind == 0) && "first",
                                            (ind == (routeParts.length - 1)) && "last"
                                            )}
                            style={onClick ? {cursor: 'pointer'} : undefined}
                            title={hint}
                            onClick={onClick} >
                            {text}
                        </div>
                    </div>
                );
            })}
        </div>
    );
 }

 export { RouteElement };
