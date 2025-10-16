

import React, { useState, useCallback, useEffect } from 'react';
import { AppState, GeneratedImageData } from './types';
import { pipecatService } from './services/pipecatService';
import VoiceInputScreen from './components/VoiceInputScreen';
import ImageDisplayScreen from './components/ImageDisplayScreen';
import PromptIdeasScreen from './components/PromptIdeasScreen';
import Loader from './components/Loader';
import Header from './components/Header';


const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({ screen: 'HOME', uploadedImages: [] });
  const [currentThought, setCurrentThought] = useState<string>('');
  const [operationState, setOperationState] = useState<any>({});

  useEffect(() => {
    pipecatService.connect(() => {
      console.log("Connected to Pipecat");
    });

    pipecatService.onMessage((message) => {
      switch (message.type) {
        case 'prompt_enhanced':
          setAppState({ screen: 'GENERATING', phase: 'image' });
          pipecatService.sendMessage({
            action: 'generate_image',
            prompt: message.magicPrompt,
            aspectRatio: message.aspectRatio,
          });
          setOperationState({
            ...operationState,
            magicPrompt: message.magicPrompt,
          });
          break;
        case 'image_generated':
          setAppState({
            screen: 'DISPLAY',
            data: {
              originalPrompt: operationState.originalPrompt,
              magicPrompt: operationState.magicPrompt,
              imageUrl: message.imageData,
              baseImageUrl: null,
            },
          });
          break;
        case 'image_edited':
          setAppState({
            screen: 'DISPLAY',
            data: {
              originalPrompt: operationState.originalPrompt,
              magicPrompt: operationState.magicPrompt,
              imageUrl: message.imageData,
              baseImageUrl: operationState.baseImageUrl,
            },
          });
          break;
        case 'transcription_complete':
            pipecatService.sendMessage({
                action: 'enhance_prompt',
                originalPrompt: message.transcribedText,
            });
            setOperationState({
                ...operationState,
                originalPrompt: message.transcribedText,
            });
            break;
      }
    });

    return () => {
      pipecatService.disconnect();
    };
  }, [operationState]);

  const handleError = (error: any, message: string) => {
      console.error(error);
      setAppState({ screen: 'ERROR', message });
  }

  const handleThoughtUpdate = (thought: string) => {
    setCurrentThought(prev => prev + thought);
  };

  const handleVoiceSubmit = useCallback(async (audioBlob: Blob) => {
    setAppState({ screen: 'GENERATING', phase: 'enhance' });
    setCurrentThought('');
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64data = (reader.result as string).split(',')[1];
        pipecatService.sendMessage({ action: 'transcribe', audioData: base64data });
    };
    reader.readAsDataURL(audioBlob);
  }, []);

  const handleTextSubmit = useCallback(async (text: string) => {
    setAppState({ screen: 'GENERATING', phase: 'enhance' });
    setCurrentThought('');
    setOperationState({ originalPrompt: text });
    pipecatService.sendMessage({ action: 'enhance_prompt', originalPrompt: text });
  }, []);
  
  const handleImagePromptSubmit = useCallback(async (prompt: string, files: File[]) => {
    if (files.length === 0) return;
    setAppState({ screen: 'GENERATING', phase: 'enhance' });
    setCurrentThought('');

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = (reader.result as string).split(',')[1];
      pipecatService.sendMessage({
        action: 'edit_image',
        prompt: prompt,
        baseImage: base64data,
      });
    };
    reader.readAsDataURL(files[0]);
    setOperationState({
      originalPrompt: prompt,
      baseImageUrl: URL.createObjectURL(files[0]),
    });
  }, []);
  
  const handleSingleImagePromptSubmit = useCallback((prompt: string, file: File) => {
    handleImagePromptSubmit(prompt, [file]);
  }, [handleImagePromptSubmit]);

  const handleVoiceWithImageSubmit = useCallback(async (audioBlob: Blob, files: File[]) => {
    if (files.length === 0) return;
    setAppState({ screen: 'GENERATING', phase: 'enhance' });
    setCurrentThought('');

    const audioReader = new FileReader();
    audioReader.onloadend = () => {
      const audioBase64 = (audioReader.result as string).split(',')[1];
      const imageReader = new FileReader();
      imageReader.onloadend = () => {
        const imageBase64 = (imageReader.result as string).split(',')[1];
        pipecatService.sendMessage({
          action: 'edit_image',
          audioData: audioBase64,
          baseImage: imageBase64,
        });
      };
      imageReader.readAsDataURL(files[0]);
    };
    audioReader.readAsDataURL(audioBlob);
    setOperationState({
      baseImageUrl: URL.createObjectURL(files[0]),
    });
  }, []);

  const handleEditSubmit = useCallback(async (audioBlob: Blob | null, text: string | null, editData: GeneratedImageData, editImages: File[] | null) => {
    setAppState({ screen: 'GENERATING', phase: 'enhance' });
    setCurrentThought('');

    const baseImageBlob = await fetch(editData.imageUrl).then(r => r.blob());
    const baseImageReader = new FileReader();
    baseImageReader.onloadend = () => {
      const baseImageBase64 = (baseImageReader.result as string).split(',')[1];
      let promptData: any = {
        action: 'edit_image',
        baseImage: baseImageBase64,
      };

      if (audioBlob) {
        const audioReader = new FileReader();
        audioReader.onloadend = () => {
          promptData.audioData = (audioReader.result as string).split(',')[1];
          pipecatService.sendMessage(promptData);
        };
        audioReader.readAsDataURL(audioBlob);
      } else if (text) {
        promptData.prompt = text;
        pipecatService.sendMessage(promptData);
      } else if (editImages && editImages.length > 0) {
        // Handle additional images if necessary
        pipecatService.sendMessage(promptData);
      } else {
        throw new Error("No input provided for editing.");
      }
    };
    baseImageReader.readAsDataURL(baseImageBlob);
    setOperationState({
      baseImageUrl: editData.imageUrl,
    });
  }, []);

  const handleImageUpload = (files: File[]) => {
    setAppState(prevState => {
      if (prevState.screen === 'HOME') {
        const currentImages = prevState.uploadedImages || [];
        const newImages = [...currentImages, ...files].slice(0, 7); // Max 7 images
        return { ...prevState, uploadedImages: newImages };
      }
      return prevState;
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setAppState(prevState => {
      if (prevState.screen === 'HOME' && prevState.uploadedImages) {
        return {
          ...prevState,
          uploadedImages: prevState.uploadedImages.filter((_, index) => index !== indexToRemove),
        };
      }
      return prevState;
    });
  };
  
  const handleReset = () => {
    setAppState({ screen: 'HOME', uploadedImages: [] });
  };


  const renderContent = () => {
    switch (appState.screen) {
      case 'HOME':
        return <VoiceInputScreen 
            onVoiceSubmit={handleVoiceSubmit} 
            onTextSubmit={handleTextSubmit} 
            onImageUpload={handleImageUpload}
            uploadedImages={appState.uploadedImages}
            onRemoveImage={handleRemoveImage}
            onImageEditSubmit={handleImagePromptSubmit}
            onVoiceWithImageSubmit={handleVoiceWithImageSubmit}
        />;
      case 'PROMPT_IDEAS':
        // FIX: Pass the single-file handler to PromptIdeasScreen to resolve type mismatch.
        return <PromptIdeasScreen onPromptClick={handleTextSubmit} onImagePromptSubmit={handleSingleImagePromptSubmit} />;
      case 'GENERATING':
        return <Loader phase={appState.phase} thought={currentThought} />;
      case 'DISPLAY':
        return <ImageDisplayScreen data={appState.data} onEditSubmit={handleEditSubmit} onReset={handleReset} />;
      case 'ERROR':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <h2 className="text-2xl font-bold text-red-500 mb-4">An Error Occurred</h2>
            <p className="text-text-secondary mb-6">{appState.message}</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-primary text-background font-semibold rounded-full shadow-md hover:opacity-90 transition-colors"
            >
              Try Again
            </button>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-screen bg-background text-text-primary font-display selection:bg-primary/30 flex flex-col overflow-hidden">
        <Header appState={appState} setAppState={setAppState} />
        <main className="flex-1 h-full overflow-y-auto custom-scrollbar">
          {renderContent()}
        </main>
    </div>
  );
};

export default App;