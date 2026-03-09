import React, { Suspense, useMemo } from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls } from '@react-three/drei';

const ModelViewer = ({ modelUrl }) => {
  const { scene } = useGLTF(modelUrl);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <Canvas
      gl={{ preserveDrawingBuffer: true, alpha: true }}
      shadows={false}
      camera={{ position: [0, 0, 4], fov: 50 }}
    >
      <Suspense fallback={null}>
        <Stage environment="city" intensity={0.5} adjustCamera={true}>
          <primitive object={clonedScene} />
        </Stage>
        <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={true} makeDefault />
      </Suspense>
    </Canvas>
  );
};

const HoverModelViewer = React.forwardRef(({ children, modelUrl }, ref) => {
  const [open, setOpen] = React.useState(false);

  return (
    <HoverCard.Root open={open} onOpenChange={setOpen} openDelay={300} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <div ref={ref} className="inline-block cursor-pointer">
          {children}
        </div>
      </HoverCard.Trigger>

      <AnimatePresence>
        {open && modelUrl && (
          <HoverCard.Portal forceMount>
            <HoverCard.Content
              side="right"
              align="start"
              sideOffset={16}
              className="z-50 w-64 h-64 outline-none"
              asChild
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-lg border border-white/20 dark:border-gray-600 shadow-2xl overflow-hidden w-full h-full relative"
              >
                <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing">
                  <ModelViewer modelUrl={modelUrl} />
                </div>
              </motion.div>
            </HoverCard.Content>
          </HoverCard.Portal>
        )}
      </AnimatePresence>
    </HoverCard.Root>
  );
});

HoverModelViewer.displayName = 'HoverModelViewer';
export default HoverModelViewer;
