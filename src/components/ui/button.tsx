import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ variant = "default", ...props }, ref) => {
    const className = variant === "outline" ? "btn btn-outline" : "btn btn-primary"
    return <button className={className} ref={ref} {...props} />
})
Button.displayName = "Button"

export { Button }
