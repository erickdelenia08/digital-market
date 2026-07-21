import { useEffect } from "react";
import {
    animate,
    motion,
    useMotionValue,
    // useSpring,
    useTransform,
} from "motion/react";

const AnimatedCounter = ({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) => {
    const count = useMotionValue(0);
    // const spring = useSpring(count);

    const display = useTransform(count, (latest) => {
        return `${prefix}${Math.round(latest).toLocaleString()}${suffix}`;
    });

    useEffect(() => {
        const controls = animate(count, value, {
            duration: 2,
        });

        return () => controls.stop();
    }, [count, value]);

    return <motion.span>{display}</motion.span>;
};

export default AnimatedCounter;