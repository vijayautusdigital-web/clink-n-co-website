# Clink N Co — Netlify website

A classic white-and-black product catalogue for Clink N Co. Orders are enquiry-based and open WhatsApp directly. This is not a checkout store.

## Included
- Homepage, Collections, Blogs, About, Contact and FAQ
- Individual generated product pages with SEO metadata and Product schema
- Product search and category filter
- WhatsApp enquiry links
- Instagram profile links and supplied product videos
- Decap CMS content editing for products, blogs, product videos/reels and site settings
- Netlify build configuration, sitemap and robots file
- WebP product images and responsive/lazy-loaded images

## Quick preview
Open `index.html` in a browser for a static preview. For local preview with all fetch-based content working, run a local static server (for example `npx serve .`) or use Netlify Dev.

## Deploy to Netlify
**Recommended (GitHub-connected publishing and CMS):**
1. Create a new GitHub repository for Clink N Co.
2. Upload the contents of this project ZIP to the repository root (not the ZIP itself).
3. In Netlify, choose **Add new site → Import an existing project** and connect the repository.
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy the site.
7. In Netlify Site Configuration, enable Identity (if available for your account) and configure the Git Gateway backend for Decap CMS. Invite your CMS editor account.
8. Replace `YOUR_GITHUB_USERNAME/clink-n-co` in `admin/config.yml` with your actual GitHub repository owner/name.\n9. Create a GitHub OAuth App with callback URL `https://api.netlify.com/auth/done`, then install its Client ID and Client Secret in Netlify under your site's OAuth authentication providers.\n10. Open `/admin/` on your deployed site and sign in.

**Manual deploy:** Run `npm run build`, then drag the generated `dist` folder to Netlify's manual deploy area. Manual deploy does not provide the Git-backed CMS publishing workflow; connect GitHub for CMS publishing.

## Add or edit products
Open `/admin/` → Product Catalogue → Products. Add a product with:
- Product name and unique URL slug
- Category
- One primary keyword and related secondary keywords
- SEO title (under 60 characters)
- Meta description (under 150 characters)
- Description, material, design and gift use
- Product photo and descriptive alt text
- Featured and published switches

CMS changes to the content files commit to your GitHub repository and trigger a Netlify build. The build generates a distinct indexable URL for each published product at `/products/product-slug/`.

## Add blogs
Open `/admin/` → Blogs. Open `/admin/` → Product Videos & Reels to add or replace videos. Enter one topic-specific primary keyword and related secondary keywords, title, slug, SEO title, meta description, excerpt, featured image, alt text and article body. Publish to create an individual blog page.

## Analytics
In CMS → Website Settings, add your Google Tag Manager ID and/or Google Analytics 4 measurement ID. The build script injects the corresponding tracking code when an ID is present. If GA4 is already configured through GTM, leave the direct GA4 field blank to avoid duplicate page-view tracking. Update the Privacy Policy after enabling analytics.

## Brand details already added
- WhatsApp: +91 98918 26482
- Instagram: https://www.instagram.com/clink.n.co/
- Delivery note: expected 2–3 days; confirm details on WhatsApp

## Important
- The site URL is currently set to `https://clinknco.netlify.app`. Replace it in `content/site.json`, `admin/config.yml` and the canonical links in the static page files after choosing your final domain/site URL.\n- Netlify's Git Gateway is deprecated for new configurations, so this starter uses Decap's GitHub backend with Netlify's GitHub OAuth provider. The repo name and OAuth credentials must be configured by you.
- Please verify product names, material, availability and delivery wording before publishing.\n- I have not included the miniature katana or hammer-shaped keychain listings in the public catalogue.
- Some supplied product photos show recognizable entertainment characters/brand marks. Confirm you have the rights or authorization needed for commercial display and sale before publishing those listings.
- Product prices are blank and not displayed by default.
- No cart, checkout, customer account or order tracking system is included, as orders are handled on WhatsApp.
