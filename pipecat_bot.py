import os
import asyncio
import base64
import json
from dotenv import load_dotenv
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.runner import PipelineRunner
from pipecat.pipeline.task import PipelineTask
from pipecat.processors.aggregators.llm_context import LLMContext
from pipecat.services.google.llm import GoogleLLMService
from pipecat.transports.websocket.server import WebsocketServerParams, WebsocketServerTransport
from pipecat.processors.frameworks.websocket import WebsocketFrame, WebsocketProcessor
from loguru import logger

load_dotenv(override=True)

class PipecatBot(WebsocketProcessor):
    def __init__(self):
        super().__init__()
        self.llm = GoogleLLMService(
            api_key=os.getenv("GOOGLE_API_KEY"),
            model="gemini-1.5-flash",
        )
        logger.info("PipecatBot initialized")

    async def process_frame(self, frame: WebsocketFrame, direction):
        await super().process_frame(frame, direction)

        if frame.type == "websocket.receive":
            try:
                data = json.loads(frame.data)
                action = data.get("action")
                logger.info(f"Received action: {action}")

                if action == "enhance_prompt":
                    await self.handle_enhance_prompt(data)
                elif action == "generate_image":
                    await self.handle_generate_image(data)
                elif action == "edit_image":
                    await self.handle_edit_image(data)
                elif action == "transcribe":
                    await self.handle_transcribe(data)

            except json.JSONDecodeError:
                logger.error("Failed to decode JSON from websocket message")
            except Exception as e:
                logger.error(f"An error occurred: {e}")

    async def handle_enhance_prompt(self, data):
        original_prompt = data.get("originalPrompt")
        meta_prompt = f"""You are a world-class prompt engineer and creative director specializing in the Gemini 1.5 Flash Image model. Your task is to take a user's simple, raw prompt and transform it into a rich, descriptive "magic prompt" and determine the optimal aspect ratio for the scene.

- Analyze the user's raw prompt: "{original_prompt}"
- Create a "magicPrompt" and determine the best "aspectRatio".
- The "aspectRatio" MUST be one of: "1:1", "3:4", "4:3", "9:16", "16:9".
- Your response MUST be a single, valid JSON object with NO markdown formatting, comments, or other text outside the JSON structure.

The JSON object must have this exact structure:
{{
  "magicPrompt": "<The full, detailed, enhanced prompt as a string>",
  "aspectRatio": "<A string representing the best aspect ratio>"
}}"""

        context = LLMContext([{"role": "user", "content": meta_prompt}])
        response_text = await self.llm.generate_text(context)

        try:
            response_json = json.loads(response_text)
            await self.push_frame(WebsocketFrame(json.dumps({
                "type": "prompt_enhanced",
                "magicPrompt": response_json.get("magicPrompt"),
                "aspectRatio": response_json.get("aspectRatio"),
            })))
        except json.JSONDecodeError:
            logger.error(f"Failed to decode JSON from LLM response: {response_text}")
            await self.push_frame(WebsocketFrame(json.dumps({
                "type": "prompt_enhanced",
                "magicPrompt": response_text,
                "aspectRatio": "1:1",
            })))

    async def handle_generate_image(self, data):
        prompt = data.get("prompt")
        aspect_ratio = data.get("aspectRatio", "1:1")
        full_prompt = f"{prompt} The desired aspect ratio is {aspect_ratio}."
        image_data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

        await self.push_frame(WebsocketFrame(json.dumps({
            "type": "image_generated",
            "imageData": f"data:image/png;base64,{image_data}",
        })))

    async def handle_edit_image(self, data):
        prompt = data.get("prompt")
        image_data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

        await self.push_frame(WebsocketFrame(json.dumps({
            "type": "image_edited",
            "imageData": f"data:image/png;base64,{image_data}",
        })))

    async def handle_transcribe(self, data):
        audio_data = data.get("audioData")
        transcribed_text = "This is a simulated transcription."

        await self.push_frame(WebsocketFrame(json.dumps({
            "type": "transcription_complete",
            "transcribedText": transcribed_text,
        })))

async def main():
    logger.info("Starting Pipecat bot server...")
    transport = WebsocketServerTransport(
        params=WebsocketServerParams(host="localhost", port=8765)
    )

    bot = PipecatBot()

    pipeline = Pipeline([transport.input(), bot, transport.output()])

    task = PipelineTask(pipeline)

    @transport.event_handler("on_client_connected")
    async def on_client_connected(transport, client):
        logger.info(f"Client connected: {client}")

    @transport.event_handler("on_client_disconnected")
    async def on_client_disconnected(transport, client):
        logger.info(f"Client disconnected: {client}")
        await task.cancel()

    runner = PipelineRunner()
    await runner.run(task)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Shutting down server.")