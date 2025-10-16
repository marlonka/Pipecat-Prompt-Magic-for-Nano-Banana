import React, { useRef, useState } from 'react';
import ImageIcon from './icons/ImageIcon';
import UploadIcon from './icons/UploadIcon';

interface PromptIdeasScreenProps {
    onPromptClick: (prompt: string) => void;
    onImagePromptSubmit: (prompt: string, file: File) => void;
}

const promptIdeas = [
    {
        title: "Collectible Action Figure",
        type: "Image-to-Image",
        prompt: "Turn this photo into a collectible action figure, complete with hyper-detailed costume, accessories, and realistic plastic toy packaging.",
    },
    {
        title: "Food Explosion",
        type: "Image-to-Image",
        prompt: "Create a stunning commercial 'exploded view' of this dish. Deconstruct it with all ingredients flying in mid-air against a dramatic, clean background. High-speed photography style.",
    },
    {
        title: "LEGO Movie Scene",
        type: "Image-to-Image",
        prompt: "Recreate this scene with LEGO characters and bricks. Make it a cinematic shot with dramatic lighting and a sense of action.",
    },
    {
        title: "Wallace & Gromit Style",
        type: "Image-to-Image",
        prompt: "Convert this photo to look like it’s from Wallace & Gromit. Everything should be made of clay, with a charming, handmade feel and visible thumbprint textures.",
    },
    {
        title: "Sketch to Photorealistic",
        type: "Image-to-Image",
        prompt: "Transform this sketch into a photorealistic masterpiece. Preserve the original character and composition but add lifelike textures, lighting, and details.",
    },
    {
        title: "Muppet Maker",
        type: "Image-to-Image",
        prompt: "Transform the person in this photo into a realistic Muppet-style character. Give them felt skin, yarn hair, and an expressive, friendly face.",
    },
    {
        title: "Chibi Yarn Doll",
        type: "Image-to-Image",
        prompt: "Create an adorable, hand-crocheted amigurumi doll of the subject in this photo. Emphasize the yarn texture and cute chibi proportions.",
    },
    {
        title: "Origami World",
        type: "Text-to-Image",
        prompt: "A majestic lion, but its entire body is made of intricately folded orange and yellow origami paper, standing in a jungle of papercraft trees.",
    },
    {
        title: "Miniature Person",
        type: "Image-to-Image",
        prompt: "Shrink the person in this photo to be ant-sized and place them in a giant, everyday environment, like climbing a book or exploring a houseplant. Macro photography style.",
    },
    {
        title: "16-Bit Video Game Character",
        type: "Image-to-Image",
        prompt: "Convert this photo into a retro 16-bit game sprite. It should look like a character from a classic 90s fighting game, complete with pixel art style.",
    },
    {
        title: "Weather Transformation",
        type: "Image-to-Image",
        prompt: "Transform the weather in this photo. Change a sunny day to a dramatic, rainy night, complete with realistic water puddles, reflections from streetlights, and a moody atmosphere.",
    },
    {
        title: "Internal Structure View",
        type: "Text-to-Image",
        prompt: "Create a technical cutaway view of a high-performance sports car, showing the engine, suspension, and interior details on one side while keeping the sleek exterior on the other.",
    },
    {
        title: "Ghibli Style",
        type: "Image-to-Image",
        prompt: "Redraw this photo in the style of a Studio Ghibli animation. Use soft, painterly backgrounds, expressive characters, and a warm, nostalgic color palette.",
    },
    {
        title: "Funko Pop Figure",
        type: "Image-to-Image",
        prompt: "Create a detailed 3D render of a chibi Funko Pop figure based on the person in the photo. Use studio lighting and photorealistic textures against a pure white background.",
    },
    {
        title: "Character Capsule",
        type: "Image-to-Image",
        prompt: "Create a detailed, transparent gashapon capsule diorama, held between fingers, featuring the character from the photo. The design should look like a miniature collectible.",
    },
    {
        title: "iPhone Selfie",
        type: "Image-to-Image",
        prompt: "Recreate this photo as an extremely ordinary and unremarkable iPhone selfie, with no clear subject or composition — just like a random snapshot taken casually with slight motion blur.",
    },
    {
        title: "Change Background",
        type: "Image-to-Image",
        prompt: "Replace the background of this image with a bustling Tokyo street at night, filled with neon signs. Ensure the subject blends naturally with the new environment.",
    },
    {
        title: "Change Camera Angle",
        type: "Image-to-Image",
        prompt: "Recreate the person from this photo but from a dramatic low-angle perspective to make them look heroic. Keep the subject's identity and clothing consistent.",
    },
    {
        title: "10 Minutes Later",
        type: "Image-to-Image",
        prompt: "Generate an image of the same scene as the photo, but showing how it looks 10 minutes later. Add natural changes over time such as light, weather, or people.",
    },
    {
        title: "Line Art to Reality",
        type: "Image-to-Image",
        prompt: "Convert this line art into a fully colored and detailed photorealistic image. Preserve all original outlines and compositions, but apply realistic lighting, shadows, and textures.",
    },
    {
        title: "AI Interior Design",
        type: "Image-to-Image",
        prompt: "Add a comfortable gray sofa and a wooden coffee table in the center of this room, matching the room’s contemporary style. Make it a photorealistic render.",
    },
    {
        title: "Anatomy Illustration",
        type: "Image-to-Image",
        prompt: "Draw a bilaterally symmetrical frontal anatomical illustration of the subject, styled like an infographic. Show the internal anatomy partially exposed with scientific detail.",
    },
    {
        title: "Cinematic Portrait",
        type: "Image-to-Image",
        prompt: "Transform this photo into a vertical portrait shot characterized by stark cinematic lighting and intense contrast. The background should be a deep, saturated crimson red.",
    },
    {
        title: "B&W Studio Portrait",
        type: "Image-to-Image",
        prompt: "Generate a top-angle and close-up black and white portrait of the face, focused on the head facing forward. Use a 35mm lens look with a deep black shadow background.",
    },
];


const PromptIdeasScreen: React.FC<PromptIdeasScreenProps> = ({ onPromptClick, onImagePromptSubmit }) => {
    const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCardClick = (idea: typeof promptIdeas[0]) => {
        if (idea.type === 'Image-to-Image') {
            setSelectedPrompt(idea.prompt);
            fileInputRef.current?.click();
        } else {
            onPromptClick(idea.prompt);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && selectedPrompt) {
            onImagePromptSubmit(selectedPrompt, file);
        }
        if (event.target) {
            event.target.value = ''; // Reset file input
        }
        setSelectedPrompt(null);
    };

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col items-center text-center mb-12">
                <h2 className="text-4xl font-bold tracking-tighter text-text-primary">Trending Prompt Ideas</h2>
                <p className="mt-2 max-w-2xl text-text-secondary">Discover advanced Nano Banana use cases, from stunning text-to-image creations to innovative image editing.</p>
            </div>
            <section>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {promptIdeas.map((idea) => (
                        <div 
                            key={idea.title} 
                            onClick={() => handleCardClick(idea)} 
                            className="group cursor-pointer h-full flow-border prompt-card rounded-lg"
                        >
                            <div className="relative bg-surface p-4 rounded-lg flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-text-primary pr-2">{idea.title}</h3>
                                        {idea.type === 'Image-to-Image' 
                                            ? <UploadIcon className="w-6 h-6 text-text-secondary flex-shrink-0" /> 
                                            : <ImageIcon className="w-6 h-6 text-text-secondary flex-shrink-0" />}
                                    </div>
                                    <p className="text-xs text-text-secondary mb-3">{idea.type}</p>
                                    <p className="text-sm text-text-secondary line-clamp-4">{idea.prompt}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default PromptIdeasScreen;