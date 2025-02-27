import {useSync} from "../../main/vdom-hooks";
import {useCallback, useMemo} from "react";
import {identityAt} from "../../main/vdom-util";

interface PatchHeaders {
    [name: string]: string
}

interface Patch {
    headers: PatchHeaders
    value: string
}

interface SyncState<State, StateChange> {
    currentState: State,
    sendTempChange: (change: StateChange) => void,
    sendFinalChange: (change: StateChange) => void,
}

interface SendPatchHeaders extends PatchHeaders {
}

interface SendPatch {
    headers: SendPatchHeaders
    value: string
    skipByPath: boolean
    retry: boolean
    defer: boolean
}

const receiverId = (name: string) => identityAt(name)

function stateToSendPatch(patch: Patch, changing: boolean, deferredSend: boolean): SendPatch {
    const changingHeaders: SendPatchHeaders = changing ? {"x-r-changing": "1"} : {}
    const headers: SendPatchHeaders = {
        ...changingHeaders,
        ...patch.headers,
    }
    return {
        value: patch.value,
        headers: headers,
        skipByPath: true,
        retry: true,
        defer: deferredSend
    }
}

function usePatchSync<ServerState, State, StateChange>(
    identity: Object,
    receiverName: string,
    serverState: ServerState,
    deferredSend: boolean,
    serverToState: (s: ServerState) => State,
    changeToPatch: (ch: StateChange) => Patch,
    patchToChange: (p: Patch) => StateChange,
    applyChange: (prevState: State, ch: StateChange) => State,
): SyncState<State, StateChange> {
    const [patches, enqueuePatch] = <[SendPatch[], (patch: SendPatch) => void]>useSync(receiverId(receiverName)(identity))
    const convertedFromServer: State = useMemo(() => serverToState(serverState), [serverState])
    const patchedState: State = useMemo(
        () => patches.reduce<State>((prev, patch) => applyChange(prev, patchToChange(patch)), convertedFromServer),
        [patches, applyChange, patchToChange, convertedFromServer]
    )
    const onChange = useCallback(
        (state: StateChange) => enqueuePatch(stateToSendPatch(changeToPatch(state), true, deferredSend)),
        [enqueuePatch, changeToPatch, deferredSend]
    )
    const onBlur = useCallback(
        (state: StateChange) => enqueuePatch(stateToSendPatch(changeToPatch(state), false, false)),
        [enqueuePatch, changeToPatch]
    )
    return {currentState: patchedState, sendTempChange: onChange, sendFinalChange: onBlur}
}

export {usePatchSync}
export type {Patch, PatchHeaders}