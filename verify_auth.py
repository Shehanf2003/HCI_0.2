from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        print("Navigating to home...")
        page.goto("http://localhost:5173/")

        # Clear token to ensure we are logged out
        page.evaluate("localStorage.clear()")
        page.reload()

        print("Waiting for page load...")
        page.wait_for_selector('text=Enter Design Studio', timeout=10000)

        print("Clicking Enter Design Studio to trigger AuthPanel...")
        page.click('text=Enter Design Studio')

        print("Waiting for AuthPanel to slide in...")
        page.wait_for_selector('text=Welcome Back', timeout=5000)

        print("Taking screenshot of login state...")
        page.screenshot(path="authpanel_login.png")
        print("Screenshot saved to authpanel_login.png")

        print("Switching to Sign Up...")
        page.click('text=Sign up now')

        page.wait_for_selector('text=Create Account', timeout=5000)
        print("Taking screenshot of signup state...")
        page.screenshot(path="authpanel_signup.png")
        print("Screenshot saved to authpanel_signup.png")

        browser.close()

if __name__ == "__main__":
    run()
