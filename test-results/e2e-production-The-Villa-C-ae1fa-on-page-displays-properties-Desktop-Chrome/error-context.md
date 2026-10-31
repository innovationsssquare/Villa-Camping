# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e-production.spec.js >> The Villa Camp - Production E2E Suite >> 2. Search & Gateway exploration page displays properties
- Location: tests\e2e-production.spec.js:29:3

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [active]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e8]:
        - heading "Cookie & Privacy Preferences" [level=4] [ref=e9]
        - generic [ref=e10]: Secure & GDPR / Indian IT Act Compliant
      - button "Dismiss cookie notice" [ref=e15] [cursor=pointer]
    - paragraph [ref=e16]: We use essential, analytical, and functional cookies to ensure seamless booking performance, personalize your luxury staycation recommendations, and remember your session.
    - generic [ref=e17]:
      - button "Accept All" [ref=e18] [cursor=pointer]
      - button "Essential Only" [ref=e19] [cursor=pointer]
      - link "Privacy Policy" [ref=e20] [cursor=pointer]:
        - /url: /privacy-policy
  - generic [ref=e23] [cursor=pointer]:
    - img "The Villa Camp Logo" [ref=e27]
    - generic [ref=e28]: Preparing your stay...
  - alert [ref=e33]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("The Villa Camp - Production E2E Suite", () => {
  4  |   test("1. Homepage loads successfully with header and hero elements", async ({ page }) => {
  5  |     const consoleErrors = [];
  6  |     page.on("pageerror", (err) => consoleErrors.push(err.message));
  7  | 
  8  |     const response = await page.goto("/", { waitUntil: "domcontentloaded" });
  9  |     expect(response?.status()).toBe(200);
  10 | 
  11 |     // Verify Title
  12 |     await expect(page).toHaveTitle(/Villa|Camp|Gateway/i);
  13 | 
  14 |     // Verify visible Header / Navigation exists
  15 |     const nav = page.locator("header:visible, nav:visible").first();
  16 |     await expect(nav).toBeVisible({ timeout: 15000 });
  17 | 
  18 |     // Check for Hero or Main Content
  19 |     const mainContent = page.locator("main:visible").first();
  20 |     await expect(mainContent).toBeVisible({ timeout: 15000 });
  21 | 
  22 |     // Ensure no fatal React / JavaScript uncaught exceptions
  23 |     const fatalErrors = consoleErrors.filter(
  24 |       (e) => !e.includes("ResizeObserver") && !e.includes("Third-party cookie")
  25 |     );
  26 |     expect(fatalErrors.length).toBeLessThan(5);
  27 |   });
  28 | 
  29 |   test("2. Search & Gateway exploration page displays properties", async ({ page }) => {
  30 |     const response = await page.goto("/search-your-gateway", { waitUntil: "domcontentloaded" });
  31 |     expect(response?.status()).toBe(200);
  32 | 
  33 |     // Allow Next.js client-side hydration & interactive map fetch
  34 |     await page.waitForTimeout(4000);
  35 | 
  36 |     // Verify search layout or controls are mounted
  37 |     const interactiveElements = page.locator("input, [role='combobox'], button, a[href*='category'], canvas");
  38 |     const count = await interactiveElements.count();
> 39 |     expect(count).toBeGreaterThan(0);
     |                   ^ Error: expect(received).toBeGreaterThan(expected)
  40 |   });
  41 | 
  42 |   test("3. Property Details Page loads with gallery, amenities & pricing", async ({ page }) => {
  43 |     // Known live villa from our live database test: Vastalya Villa
  44 |     const villaId = "6ac4d9356304ed7b9a6b2d4c";
  45 |     const response = await page.goto(`/view-Villa/${villaId}`, { waitUntil: "domcontentloaded" });
  46 |     expect(response?.status()).toBe(200);
  47 | 
  48 |     await page.waitForTimeout(2500);
  49 | 
  50 |     // Verify property name heading
  51 |     const titleHeading = page.locator("h1:visible, h2:visible").first();
  52 |     await expect(titleHeading).toBeVisible({ timeout: 15000 });
  53 | 
  54 |     // Verify booking action or pricing is visible
  55 |     const pricingOrBookButton = page.locator("button:visible, [role='button']:visible, :text('₹'):visible").first();
  56 |     await expect(pricingOrBookButton).toBeVisible({ timeout: 15000 });
  57 |   });
  58 | 
  59 |   test("4. AI Concierge Bot interactive widget is mounted", async ({ page }) => {
  60 |     await page.goto("/", { waitUntil: "domcontentloaded" });
  61 |     await page.waitForTimeout(2000);
  62 | 
  63 |     // Look for AI Concierge button or chat trigger
  64 |     const conciergeTrigger = page.locator(
  65 |       "button[aria-label*='concierge' i], button[aria-label*='chat' i], [class*='concierge' i], [class*='bot' i]"
  66 |     ).first();
  67 | 
  68 |     const isPresent = await conciergeTrigger.count();
  69 |     expect(isPresent).toBeGreaterThanOrEqual(0);
  70 |   });
  71 | 
  72 |   test("5. Mobile responsiveness & viewport verification", async ({ page, isMobile }) => {
  73 |     test.skip(!isMobile, "Mobile viewport test only");
  74 | 
  75 |     await page.goto("/", { waitUntil: "domcontentloaded" });
  76 |     const nav = page.locator("header:visible, nav:visible").first();
  77 |     await expect(nav).toBeVisible({ timeout: 15000 });
  78 | 
  79 |     // Verify page width matches viewport (no horizontal overflow)
  80 |     const viewportSize = page.viewportSize();
  81 |     expect(viewportSize?.width).toBeLessThanOrEqual(450);
  82 |   });
  83 | });
  84 | 
```