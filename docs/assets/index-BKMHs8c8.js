import{s}from"./api.clients-xZY3H6Gu.js";let c;y();async function y(){console.log("main");const{data:o,error:e}=await s.auth.getSession();if(e){console.error("Error getting session: ",e),alert("Błąd podczas pobierania sesji. Sprawdź konsolę");return}c=o.session,g(),c?f():m(),await u()}async function u(o){const{data:e,error:t}=await s.from("article").select();if(t){console.error("Error fetching articles",t),alert("Błąd podczas pobierania artykułów. Sprawdź konsolę.");return}console.log("Fetched articles:",e);const a=e.map((n,r)=>`
      ${r>0?"<hr />":""}
      <article class="article" data-id="${n.id}">
        <h2 class="font-bold text-2xl">${n.title}</h2>
        <h3 class="font-medium text">${n.subtitle}</h3>
        <div class="flex gap-2 text-sm text-grey-500">
          <address rel="author">${n.author}</address>
          <time datetime="${n.created_at}">${new Date(n.created_at).toLocaleDateString()}</time>
        </div>
        <p class="mt-2">${n.content}</p>
      </article>
    `).join("");document.querySelector(".articles").innerHTML=a,c&&(h(),w())}function f(){const o=document.querySelector("nav"),e=document.createElement("button");e.textContent="Wyloguj",e.type="button",e.className="bg-sky-400 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded cursor-pointer",e.addEventListener("click",async()=>{const{error:t}=await s.auth.signOut();if(c=null,t){console.error("Error signing out:",t),alert("Błąd podczas wylogowywania. Sprawdź konsolę.");return}e.remove(),m(),await u()}),o.appendChild(e)}function m(){const o=document.querySelector("nav"),e=document.createElement("a");e.textContent="Zaloguj",e.href="/login/",e.className="bg-sky-400 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded cursor-pointer",o.appendChild(e)}function g(){const o=document.querySelector("nav"),e=document.createElement("button");e.textContent="Dodaj artykuł",e.className="bg-sky-400 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded cursor-pointer",e.type="button",e.addEventListener("click",()=>{const t=document.createElement("dialog");t.className="bg-transparent w-full h-full",t.innerHTML=`
      <section class="bg-white p-4 md:px-8 rounded shadow-lg max-w-md mx-auto mt-20">
        <h2 class="text-2xl font-bold mb-4">Dodaj artykuł</h2>
        <form id="add-article-form" class="flex flex-col gap-4">
          <label>
            Tytuł:
            <input type="text" name="title" required class="border p-2 rounded w-full"/>
          </label>
          <label>
            Podtytuł:
            <input type="text" name="subtitle" required class="border p-2 rounded w-full"/>
          </label>
          <label>
            Treść:
            <textarea name="content" required class="border p-2 rounded w-full"></textarea>
          </label>
          <label>
            Autor:
            <input type="text" name="author" required class="border p-2 rounded w-full"/>
          </label>
          <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded cursor-pointer">Dodaj artykuł</button>
          <button type="button" id="cancel-button" class="bg-rose-500 hover:bg-rose-700 text-white p-2 rounded cursor-pointer">Anuluj</button>
        </form>
      </section>
    `,document.body.appendChild(t),t.showModal();const a=t.querySelector("#add-article-form");t.querySelector("#cancel-button").addEventListener("click",async()=>{t.close(),t.remove()}),a.addEventListener("submit",async r=>{r.preventDefault();const d=r.target.title.value,i=r.target.subtitle.value,p=r.target.content.value,b=r.target.author.value,{error:l}=await s.from("article").insert({title:d,subtitle:i,content:p,author:b,created_at:new Date().toISOString()});if(l){console.error("Error adding article",l),l.code==="42501"||l.message.includes("violates row-level security")?alert("Musisz być zalogowany, aby dodać artykuł."):alert("Błąd podczas dodawania artykułu. Sprawdź konsolę.");return}t.close(),t.remove(),await u()})}),o.appendChild(e)}function h(){document.querySelectorAll("article").forEach(o=>{const e=o.dataset.id,t=document.createElement("button");t.textContent="Usuń artykuł",t.type="button",t.className="bg-rose-500 hover:bg-rose-700 text-white font-bold py-2 px-4 m-1 rounded cursor-pointer",t.addEventListener("click",async()=>{if(!confirm("Czy na pewno chcesz usunąć ten artykuł?"))return;const{error:n}=await s.from("article").delete().eq("id",e);if(n){console.error("Error deleting article:",n),alert("Błąd podczas usuwania artykułu. Sprawdź konsolę.");return}await u()}),o.appendChild(t)})}function w(){document.querySelectorAll("article").forEach(o=>{const e=o.dataset.id,t=document.createElement("button");t.textContent="Edytuj artykuł",t.type="button",t.className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-1 rounded",t.addEventListener("click",()=>{const a=document.createElement("dialog");a.className="bg-transparent w-full h-full",a.innerHTML=`
        <section class="bg-white p-4 md:px-8 rounded shadow-lg max-w-md mx-auto mt-20">
          <h2 class="text-2xl font-bold mb-4">Edytuj artykuł</h2>
          <form id="edit-article-form" class="flex flex-col gap-4">
            <label>
              Tytuł:
              <input type="text" name="title" required class="border p-2 rounded w-full"/>
            </label>
          <label>
            Podtytuł:
            <input type="text" name="subtitle" required class="border p-2 rounded w-full"/>
          </label>
            <label>
              Treść:
              <textarea name="content" required class="border p-2 rounded w-full"></textarea>
            </label>
            <label>
              Autor:
              <input type="text" name="author" required class="border p-2 rounded w-full"/>
            </label>
            <button type="submit" class="bg-blue-500 text-white p-2 rounded">Zapisz zmiany</button>
          </form>
        </section>
      `,document.body.appendChild(a),a.showModal(),a.querySelector("#edit-article-form").addEventListener("submit",async r=>{r.preventDefault();const d=r.target.title.value,i=r.target.subtitle.value,p=r.target.content.value,b=r.target.author.value,{error:l}=await s.from("article").update({title:d,subtitle:i,content:p,author:b,created_at:new Date().toISOString()}).eq("id",e);if(l){console.error("Error editing article:",l),alert("Błąd podczas edycji artykułu. Sprawdź konsolę.");return}a.close(),a.remove(),await u()})}),o.appendChild(t)})}
