import * as React from "react"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
    return <input className="input" ref={ref} {...props} />
})
Input.displayName = "Input"

export { Input }
