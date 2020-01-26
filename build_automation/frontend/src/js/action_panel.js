import React from "react"
import { Edit, Delete, CheckCircleOutline, HighlightOff, Visibility } from "@material-ui/icons"

const ActionPanel = (props) => {
    const { row, editFn, deleteFn, setActive, viewFn } = props
    const pointerStyle = {
        cursor: 'pointer'
    }
    return (
        <>
            <Edit
                style={pointerStyle}
                onClick={editFn}
            />
            <Delete
                style={pointerStyle}
                onClick={deleteFn}
            />
            {setActive !== undefined ? (
                row.active == 0 ? (
                    <CheckCircleOutline
                        style={pointerStyle}
                        onClick={() => setActive(false)}
                    />
                ) : (
                    <HighlightOff
                        style={pointerStyle}
                        onClick={() => setActive(true)}
                    />
                )
            ) : (
               <></> 
            )}
            {viewFn !== undefined ? (
                <Visibility
                    style={pointerStyle}
                    onClick={() => viewFn()}
                />
            ) : (
                <></>
            )}
        </>
    )
}

export {
    ActionPanel
}