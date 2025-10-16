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

## Getting Started

Follow these instructions to get the application running on your local machine.

### Prerequisites

- **Python 3.9+**: Make sure you have a recent version of Python installed. You can check with `python3 --version`.
- **Node.js and npm**: Required for the frontend. You can download them from [nodejs.org](https://nodejs.org/).
- **Google API Key**: You'll need a Google API key with the "Generative Language API" enabled. You can get one from the [Google AI Studio](https://aistudio.google.com/app/apikey).

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/marlonka/Pipecat-Prompt-Magic-for-Nano-Banana.git
    cd Pipecat-Prompt-Magic-for-Nano-Banana
    ```

2.  **Set up a virtual environment (recommended):**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up your environment variables:**
    -   Copy the example `.env` file:
        ```bash
        cp .env.example .env
        ```
    -   Open the `.env` file and add your Google API key:
        ```
        GOOGLE_API_KEY="your_google_api_key_here"
        ```

5.  **Run the Python backend server:**
    ```bash
    python3 pipecat_bot.py
    ```
    You should see a message indicating that the server is running on `localhost:8765`.

### Frontend Setup

1.  **Open a new terminal window** and navigate to the project directory.

2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```

3.  **Run the frontend development server:**
    ```bash
    npm run dev
    ```
    This will start the React application, and you can access it at the URL provided in your terminal (usually `http://localhost:5173`).

Now you're all set! Open your browser to the frontend URL, and you can start generating images.

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