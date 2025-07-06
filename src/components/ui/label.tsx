import * as React from "react"

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>((props, ref) => (
    <label ref={ref} className="label" {...props} />
))
Label.displayName = "Label"

export { Label }
