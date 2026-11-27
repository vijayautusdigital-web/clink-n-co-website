const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
let waDigits="919891826482";
function waUrl(message="Hi Clink N Co! I'd like to enquire about your keychains."){return "https://wa.me/"+waDigits+"?text="+encodeURIComponent(message)}
async function getJSON(url){try{const r=await fetch(url);if(!r.ok)throw 0;return await r.json()}catch(e){return null}}
function productCard(p){return `<article class="product-card"><a href="/products/${p.slug}/" aria-label="View ${esc(p.name)}"><div class="product-image"><img src="${esc(p.image)}" alt="${esc(p.alt||p.name)}" loading="lazy" width="600" height="750"></div><h3>${esc(p.name)}</h3></a><p>${esc(p.shortDescription||p.category||"Keychain")}</p><a class="card-link" href="/products/${p.slug}/">View product ↗</a></article>`}
function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
async function init(){
  const site=await getJSON("/content/site.json");
  const data=await getJSON("/content/products.json");
  const blogs=await getJSON("/content/blogs.json");
  const videoData=await getJSON("/content/videos.json");
  if(site?.whatsappNumber){waDigits=String(site.whatsappNumber).replace(/\\D/g,"");}
  const products=(data?.products||[]).filter(p=>p.published!==false);
  $$("[data-wa]").forEach(a=>{a.href=waUrl();a.target="_blank";a.rel="noopener"});
  $$("[data-instagram]").forEach(a=>{a.href=site?.instagramUrl||"https://www.instagram.com/clink.n.co/";a.target="_blank";a.rel="noopener"});
  $$("[data-year]").forEach(el=>el.textContent=new Date().getFullYear());
  const featured=$("#featured-products");if(featured){featured.innerHTML=products.filter(p=>p.featured).slice(0,4).map(productCard).join("")||"<p>New keychain designs will be added soon.</p>"}
  const blogHost=$("#latest-blogs");if(blogHost){const list=(blogs?.blogs||[]).filter(b=>b.published!==false).slice(0,3);blogHost.innerHTML=list.length?list.map(b=>`<article class="blog-card"><p class="eyebrow">${esc(b.date||"CLINK N CO BLOG")}</p><h3><a href="/blogs/${esc(b.slug)}/">${esc(b.title)}</a></h3><p>${esc(b.excerpt||b.metaDescription||"Read the latest from Clink N Co.")}</p><a class="text-link" href="/blogs/${esc(b.slug)}/">Read article ↗</a></article>`).join(""):"<p>Blog posts added through the CMS will appear here.</p>"}
  const catalog=$("#catalog-products");if(catalog){const search=$("#product-search"),cat=$("#product-category");function render(){const term=(search?.value||"").toLowerCase();const category=cat?.value||"";const filtered=products.filter(p=>(!category||p.category===category)&&(`${p.name} ${p.category} ${p.secondaryKeywords||""}`.toLowerCase().includes(term)));catalog.innerHTML=filtered.map(productCard).join("")||"<p>No products found. Try another search.</p>"};const cats=[...new Set(products.map(p=>p.category).filter(Boolean))];if(cat)cat.innerHTML='<option value="">All categories</option>'+cats.map(c=>`<option>${esc(c)}</option>`).join("");search?.addEventListener("input",render);cat?.addEventListener("change",render);render()}
  const toggle=$(".menu-toggle"),nav=$(".main-nav");toggle?.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open))});
  const videos=(videoData?.videos||[]).filter(v=>v.published!==false);
  const featuredVideo=videos.find(v=>v.featured)||videos[0];
  const featureEl=$("#feature-video");
  if(featureEl&&featuredVideo){featureEl.poster=featuredVideo.poster||"";featureEl.innerHTML=`<source src="${esc(featuredVideo.videoFile)}" type="video/mp4">Your browser does not support video.`}
  const reelHost=$("#reels-grid");
  if(reelHost){const reels=videos.filter(v=>v!==featuredVideo);reelHost.innerHTML=reels.map(v=>`<video controls playsinline preload="metadata" poster="${esc(v.poster||"")}" aria-label="${esc(v.alt||v.title)}"><source src="${esc(v.videoFile)}" type="video/mp4">Your browser does not support video.</video>`).join("")||"<p>New product videos will appear here.</p>"}
  // Product detail pages get their WhatsApp message from the page's data attributes.
  const productRoot=$("[data-product-detail]");if(productRoot){const name=productRoot.dataset.productName||"keychain";const link=$("[data-product-wa]",productRoot);if(link){link.href=waUrl(`Hi Clink N Co! I'm interested in the ${name}. Please share availability and delivery details.`);link.target="_blank";link.rel="noopener"}}
}
document.addEventListener("DOMContentLoaded",init);
