/** Public startup branding for Erudior and independent Engine-based products.
 * Third-party mode must not imply an official partnership or endorsement.
 */
export type SplashBrand = { kind:"official" } | { kind:"third-party"; productName:string };
export function createStartupSplash(brand: SplashBrand): HTMLDivElement {
  const splash=document.createElement("div");
  splash.className="erudior-splash";
  splash.setAttribute("role","status");
  splash.setAttribute("aria-label",brand.kind==="official"?"Loading Erudior":"Loading "+brand.productName);
  const book=document.createElement("div");
  book.className="erudior-splash-book";
  book.setAttribute("aria-hidden","true");
  // One continuous sequence: closed cover, open spread, three turning leaves,
  // then the marked page and its ribbon. All parts are decorative.
  book.innerHTML = `<span class="erudior-book-back"></span>
    <span class="erudior-book-left-page"></span>
    <span class="erudior-book-right-page"></span>
    <span class="erudior-book-leaf erudior-book-leaf-one"></span>
    <span class="erudior-book-leaf erudior-book-leaf-two"></span>
    <span class="erudior-book-leaf erudior-book-leaf-three"></span>
    <span class="erudior-book-ribbon">★</span>
    <span class="erudior-book-cover"></span>`;
  splash.appendChild(book);
  const heading=document.createElement("strong");
  heading.textContent=brand.kind==="official"?"ERUDIOR":brand.productName;
  splash.appendChild(heading);
  const caption=document.createElement("p");
  caption.textContent=brand.kind==="official"?"Learn without limits.":"Powered by Erudior";
  splash.appendChild(caption);
  if(brand.kind==="third-party"){
    const link=document.createElement("a");
    link.href="https://erudior.com";
    link.textContent="Erudior Engine";
    link.rel="noopener noreferrer";
    splash.appendChild(link);
    const independent=document.createElement("small");
    independent.textContent="Independent product; not affiliated with or endorsed by Erudior.";
    splash.appendChild(independent);
  }
  return splash;
}
export function dismissStartupSplash(splash: HTMLElement) {
  splash.classList.add("erudior-splash-exit");
  if(matchMedia("(prefers-reduced-motion: reduce)").matches){splash.remove();return;}
  splash.addEventListener("transitionend",()=>splash.remove(),{once:true});
}
