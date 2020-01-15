import React from "react"
import Button from "@material-ui/core/Button"
import { get_filter_query } from "./url.js"

const DownloadExcelButton = (props) => {
    const { filters, filter_params } = props
    return (
        <Button
            variant="outlined"
            onClick={() => {
                window.open("/api/spreadsheet/contents?" + get_filter_query(filters, filter_params), "_blank")
            }}
        >
            Download as xlsx
        </Button>
    )
}

export {
    DownloadExcelButton
}