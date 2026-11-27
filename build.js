const fs=require("fs"),path=require("path");
const root=__dirname,dist=path.join(root,"dist");
function readJSON(p){return JSON.parse(fs.readFileSync(path.join(root,p),"utf8"))}
function mkdir(p){fs.mkdirSync(p,{recursive:true})}
function copyDir(src,dst){mkdir(dst);for(const item of fs.readdirSync(src,{withFileTypes:true})){const a=path.join(src,item.name),b=path.join(dst,item.name);item.isDirectory()?copyDir(a,b):fs.copyFileSync(a,b)}}
function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function replaceAll(t,k,v){return t.split(k).join(String(v??""))}
function seoTitle(p){let t=p.seoTitle||`${p.name} | Clink N Co`;return t.length>60?t.slice(0,57).trim()+"...":t}
function meta(p){let t=p.metaDescription||`Explore ${p.name} from Clink N Co. View product details and enquire on WhatsApp.`;return t.length>150?t.slice(0,147).trim()+"...":t}
if(fs.existsSync(dist))fs.rmSync(dist,{recursive:true,force:true});
mkdir(dist);
for(const item of fs.readdirSync(root,{withFileTypes:true})){if(["dist","node_modules",".git"].includes(item.name)||item.name==="build.js")continue;const src=path.join(root,item.name),dst=path.join(dist,item.name);if(item.isDirectory())copyDir(src,dst);else if(item.name!=="package.json")fs.copyFileSync(src,dst)}
const data=readJSON("content/products.json"),site=readJSON("content/site.json"),blogs=readJSON("content/blogs.json");
const template=fs.readFileSync(path.join(root,"templates/product.html"),"utf8");
const published=(data.products||[]).filter(p=>p.published!==false);
for(const p of published){
  const canonical=(site.siteUrl||"https://clinknco.netlify.app").replace(/\/$/,"")+"/products/"+p.slug+"/";
  const schema={"@context":"https://schema.org","@type":"Product","name":p.name,"description":p.description,"image":[(site.siteUrl||"https://clinknco.netlify.app").replace(/\/$/,"")+p.image],"brand":{"@type":"Brand","name":"Clink N Co"},"category":p.category};
  let html=template;
  const vals={"{{SEO_TITLE}}":esc(seoTitle(p)),"{{META_DESCRIPTION}}":esc(meta(p)),"{{CANONICAL}}":esc(canonical),"{{PRODUCT_SCHEMA}}":JSON.stringify(schema).replace(/</g,"\\u003c"),"{{PRODUCT_NAME}}":esc(p.name),"{{CATEGORY}}":esc(p.category),"{{IMAGE}}":esc(p.image),"{{ALT}}":esc(p.alt||p.name),"{{SHORT_DESCRIPTION}}":esc(p.shortDescription),"{{DESCRIPTION}}":esc(p.description),"{{MATERIAL}}":esc(p.material||"Please enquire"),"{{DESIGN}}":esc(p.design||"Please enquire"),"{{GIFT_USE}}":esc(p.giftUse||"Gift or collectible")};
  for(const [k,v] of Object.entries(vals))html=replaceAll(html,k,v);
  const out=path.join(dist,"products",p.slug,"index.html");mkdir(path.dirname(out));fs.writeFileSync(out,html);
}
for(const b of (blogs.blogs||[]).filter(x=>x.published!==false)){
  const slug=b.slug||"article";const title=b.seoTitle||b.title;const description=meta(b);const canonical=(site.siteUrl||"https://clinknco.netlify.app").replace(/\/$/,"")+"/blogs/"+slug+"/";
  const body=(b.body||"").split(/\n{2,}/).map(p=>p.trim()).filter(Boolean).map(p=>p.startsWith("#")?`<h2>${esc(p.replace(/^#+\s*/,""))}</h2>`:`<p>${esc(p).replace(/\n/g," ")}</p>`).join("\n");
  const page=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title.length>60?title.slice(0,57)+"...":title)}</title><meta name="description" content="${esc(description.length>150?description.slice(0,147)+"...":description)}"><link rel="canonical" href="${esc(canonical)}"><link rel="stylesheet" href="/assets/css/styles.css"><script defer src="/assets/js/app.js"></script></head><body><div class="announcement">Clink N Co · Accessories · WhatsApp to enquire</div><header class="site-header"><a class="brand" href="/"><img src="/assets/images/brand-logo.webp" alt="Clink N Co"></a><button class="menu-toggle" aria-label="Open navigation" aria-expanded="false">☰</button><nav class="main-nav"><a href="/">Home</a><a href="/collections/">Collections</a><a href="/blogs/">Blogs</a><a href="/about/">About</a><a href="/contact/">Contact</a></nav><a class="header-cta" data-wa href="#">WhatsApp</a></header><main><article class="content-page"><p class="eyebrow">${esc(b.primaryKeyword||"CLINK N CO BLOG")}</p><h1>${esc(b.title)}</h1><p>${esc(b.excerpt||"")}</p>${b.featuredImage?`<img src="${esc(b.featuredImage)}" alt="${esc(b.imageAlt||b.title)}" loading="lazy">`:""}${body}<p><a class="button button-dark" data-wa href="#">Ask us on WhatsApp ↗</a></p></article></main><footer class="site-footer"><div class="footer-brand"><img src="/assets/images/brand-logo.webp" alt="Clink N Co"><p>Accessories for the things you love.</p></div><div><h3>Explore</h3><a href="/">Home</a><a href="/collections/">Collections</a><a href="/blogs/">Blogs</a><a href="/contact/">Contact</a></div><div><h3>Information</h3><a href="/faq/">FAQ</a><a href="/privacy/">Privacy Policy</a><a href="/terms/">Terms of Use</a></div><div><h3>Connect</h3><a data-wa href="#">WhatsApp enquiries</a><a data-instagram href="#">Instagram</a></div><div class="copyright">© <span data-year></span> Clink N Co.</div></footer></body></html>`;
  const out=path.join(dist,"blogs",slug,"index.html");mkdir(path.dirname(out));fs.writeFileSync(out,page);
}
const base=(site.siteUrl||"https://clinknco.netlify.app").replace(/\/$/,"");
const urls=["/","/collections/","/blogs/","/about/","/contact/","/faq/","/privacy/","/terms/",...published.map(p=>`/products/${p.slug}/`),...(blogs.blogs||[]).filter(b=>b.published!==false).map(b=>`/blogs/${b.slug}/`)];
fs.writeFileSync(path.join(dist,"sitemap.xml"),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u=>`<url><loc>${esc(base+u)}</loc></url>`).join("")}</urlset>`);
fs.writeFileSync(path.join(dist,"robots.txt"),`User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${base}/sitemap.xml\n`);
console.log(`Built Clink N Co site with ${published.length} product pages and ${(blogs.blogs||[]).filter(b=>b.published!==false).length} blog pages.`);
