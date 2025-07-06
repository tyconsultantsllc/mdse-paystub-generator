"use client"

import * as React from "react"

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ label, className, ...props }, ref) => {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
                type="checkbox"
                ref={ref}
                style={{
                    width: "1rem",
                    height: "1rem",
                    cursor: "pointer",
                }}
                {...props}
            />
            {label && (
                <label style={{ fontSize: "0.875rem", cursor: "pointer" }} onClick={() => props.onChange?.({} as any)}>
                    {label}
                </label>
            )}
        </div>
    )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
