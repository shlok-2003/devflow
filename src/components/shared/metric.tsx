import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MetricProps extends React.HTMLAttributes<HTMLElement> {
    imgUrl: string;
    alt: string;
    value: string | number;
    title: string;
    href?: string;
    textStyle?: string;
    isAuthor?: boolean;
}

const Metric: React.FC<MetricProps> = ({
    imgUrl,
    alt,
    value,
    title,
    href,
    textStyle,
    isAuthor,
}) => {
    const metricContent = (
        <>
            <Image
                src={imgUrl}
                alt={alt}
                width={16}
                height={16}
                className={cn("object-contain", href && "rounded-full")}
            />

            <p className={cn("flex items-center gap-1", textStyle)}>
                <span>{value}</span>

                <span
                    className={`small-regular line-clamp-1 ${
                        isAuthor && "max-sm:hidden"
                    }`}
                >
                    {title}
                </span>
            </p>
        </>
    );

    /**
     * Author is clickable
     */
    if (href) {
        return (
            <Link href={href} className="flex-center gap-1">
                {metricContent}
            </Link>
        );
    }

    return <div className="flex-center flex-wrap gap-1">{metricContent}</div>;
};

export default Metric;
