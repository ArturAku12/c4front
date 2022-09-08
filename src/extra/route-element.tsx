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
                return (
                        <div key={`${ind}`}
                            className={clsx(
                                            done && 'routePartDone',
                                            !done && "notDone",
                                            (routeParts[ind + 1]?.done == done) && "continue",
                                            (routeParts[ind + 1]?.done != done) && "stop",
                                            (ind == 0) && "first",
                                            )}
                            style={onClick ? {cursor: 'pointer'} : undefined}
                            title={hint}
                            onClick={onClick} >
                            {text}
                        </div>
                );
            })}
        </div>
    );
 }

 export { RouteElement };
