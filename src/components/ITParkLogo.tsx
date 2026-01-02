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
        <svg
            viewBox="0 0 200 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            {/* Hexagon Icon */}
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

            {/* Text: IT PARK */}
            <path
                d="M60 15H66V35H60V15Z"
                className="fill-primary-600"
            />
            <path
                d="M75 15H90V20H81V35H75V15Z"
                className="fill-primary-600"
            />
            <path
                d="M100 15H112C116.418 15 120 18.5817 120 23C120 27.4183 116.418 31 112 31H106V35H100V15ZM106 25H112C113.105 25 114 24.1046 114 23C114 21.8954 113.105 21 112 21H106V25Z"
                className="fill-primary-600"
            />
            <path
                d="M130 35L136 15H142L148 35H142L140.5 30H137.5L136 35H130ZM138 25L139 22L140 25H138Z"
                className="fill-primary-600"
            />
            <path
                d="M155 15H164C167.314 15 170 17.6863 170 21C170 23.2324 168.811 25.1953 167.014 26.2483L171 35H164.5L161.5 27H161V35H155V15ZM161 22H164C164.552 22 165 21.5523 165 21C165 20.4477 164.552 20 164 20H161V22Z"
                className="fill-primary-600"
            />
            <path
                d="M180 15H186V22H188L194 15H200L192 24L200 35H193L186 26V35H180V15Z"
                className="fill-primary-600"
            />
        </svg>
    )
}
