# Pipecat-Prompt-Magic-for-Nano-Banana

## What is this?

This is a web application that uses voice and text prompts to generate and edit images with AI, leveraging the `gemini-2.5-flash` model for prompt magic and `gemini-2.5-flash-image` (also known as Nano Banana) for image generation.

## Demo Video

[Your Demo Video Here]

## How you used Gemini (Nano Banana) + Pipecat

This project leverages Pipecat and Gemini models to create a seamless, voice-driven image generation experience.

- **Pipecat**: Manages the real-time, bidirectional communication between the browser and the Python backend. It orchestrates the entire workflow, from receiving raw audio data or text from the user to streaming back transcribed text, enhanced prompts, and the final generated images. The pipeline is designed to handle various actions like transcription, prompt enhancement, and image generation/editing in a structured manner.

- **Gemini Models**: The core of the AI's creativity.
  - **Prompt Magic (`gemini-2.5-flash`)**: We use this model to transform simple, user-provided prompts (e.g., "a cat in a hat") into rich, descriptive "magic prompts" that are optimized for high-quality image generation. It also intelligently determines the best aspect ratio (e.g., 16:9, 1:1) for the requested scene.
  - **Image Generation (`gemini-2.5-flash-image` - Nano Banana)**: The application uses this powerful model to generate new images from the enhanced prompts or modify existing ones based on user instructions.

## Other tools or integrations

- **Frontend**:
  - **React**: For building the user interface.
  - **Vite**: As the frontend tooling and development server.
  - **Tailwind CSS**: For styling the application.
- **Backend**:
  - **Python**: The language for the Pipecat server.
  - **Websockets**: For real-time communication between the frontend and backend.

## What you built during the hackathon vs. prior work

This entire project was conceived and built during the hackathon. All the code, from the frontend UI to the backend Pipecat pipeline and the integration with the Gemini API, was written from scratch.

## Feedback on the tools you used

[Your feedback here]

## Live Demo Link

[Your Live Demo Link Here]