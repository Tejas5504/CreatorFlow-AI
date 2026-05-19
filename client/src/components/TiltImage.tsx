import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import demoVideo from '../assets/demo_video.mp4';
import { Volume2Icon, VolumeXIcon } from 'lucide-react';

const springValues = {
    damping: 30,
    stiffness: 100,
    mass: 2
};

export default function TiltedImage({ rotateAmplitude = 3, }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useMotionValue(0), springValues);
    const rotateY = useSpring(useMotionValue(0), springValues);
    const rotateFigcaption = useSpring(0, { stiffness: 350, damping: 30, mass: 1 });

    const [lastY, setLastY] = useState(0);
    const [isMuted, setIsMuted] = useState(true);

    function handleMouse(e: any) {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

        rotateX.set(rotationX);
        rotateY.set(rotationY);

        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);

        const velocityY = offsetY - lastY;
        rotateFigcaption.set(-velocityY * 0.6);
        setLastY(offsetY);
    }

    function handleMouseLeave() {
        rotateX.set(0);
        rotateY.set(0);
        rotateFigcaption.set(0);
    }

    return (
        <motion.figure ref={ref} className="relative w-full h-full perspective-midrange mt-16 max-w-4xl mx-auto flex flex-col items-center justify-center" onMouseMove={handleMouse} onMouseLeave={handleMouseLeave}
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
            <motion.div className="relative transform-3d w-full max-w-4xl group" style={{ rotateX, rotateY }} >
                <video src={demoVideo}
                    autoPlay loop muted={isMuted} playsInline
                    className="w-full aspect-video rounded-2xl shadow-[0_0_40px_rgba(219,39,119,0.3)] ring-1 ring-white/10 will-change-transform transform-[translateZ(0)] object-cover bg-black"
                />
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="absolute bottom-6 right-6 p-3 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 backdrop-blur z-10 cursor-pointer"
                    title={isMuted ? "Unmute video" : "Mute video"}
                >
                    {isMuted ? <VolumeXIcon size={24} /> : <Volume2Icon size={24} />}
                </button>
            </motion.div>
        </motion.figure>
    );
}