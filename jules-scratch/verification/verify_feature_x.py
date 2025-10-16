from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:3000")

    # Take a screenshot to see what's on the page
    page.screenshot(path="jules-scratch/verification/debug_screenshot.png")

    # Wait for the text area to be visible
    expect(page.locator("textarea")).to_be_visible()

    # Enter a text prompt
    page.fill("textarea", "a cat wearing a hat")
    page.click("button:text('Generate')")

    # Wait for the generating screen to appear
    expect(page.locator("text=Enhancing your prompt...")).to_be_visible()

    # Wait for the image to be generated
    expect(page.locator("img")).to_be_visible(timeout=60000)

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)