import { SVGProps } from 'react'

interface ITParkLogoProps extends SVGProps<SVGSVGElement> {
    variant?: 'full' | 'icon'
    className?: string
}

export default function ITParkLogo({ variant = 'full', className = '', ...props }: ITParkLogoProps) {
    if (variant === 'icon') {
        return (
            <svg
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={className}
                {...props}
            >
                <path
                    d="M25 5L42.3205 15V35L25 45L7.67949 35V15L25 5Z"
                    className="fill-primary-500"
                />
                <path
                    d="M25 12L36.2628 18.5V31.5L25 38L13.7372 31.5V18.5L25 12Z"
                    className="fill-white"
                />
                <path
                    d="M25 19L29.3301 21.5V26.5L25 29L20.6699 26.5V21.5L25 19Z"
                    className="fill-primary-500"
                />
            </svg>
        )
    }

    return (
        <img
            src="https://outsource.gov.uz/_next/static/media/logo.b3c1dba8.svg"
            alt="IT Park Logo"
            className={className}
            {...props as React.ImgHTMLAttributes<HTMLImageElement>}
        />
    )
}
