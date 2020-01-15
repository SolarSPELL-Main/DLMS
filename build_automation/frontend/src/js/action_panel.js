import React from "react"
import { Edit, Delete, CheckCircleOutline, HighlightOff } from "@material-ui/icons"

const ActionPanel = (props) => {
    const { row, editFn, deleteFn, setActive } = props
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
                row.active == 1 ? (
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
        </>
    )
}

export {
    ActionPanel

}